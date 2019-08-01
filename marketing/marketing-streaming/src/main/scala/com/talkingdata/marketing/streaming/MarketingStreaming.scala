package com.talkingdata.marketing.streaming

import scala.collection.JavaConverters._
import java.util.Properties

import _root_.kafka.serializer.StringDecoder
import com.alibaba.fastjson.{JSON, JSONException}
import com.talkingdata.marketing.streaming.kafka.KafkaOffserManager
import com.talkingdata.marketing.streaming.model._
import com.talkingdata.marketing.streaming.model.ExecutorResultDataConstant._
import com.talkingdata.marketing.streaming.pipeline.executor.PipelineExecutor
import com.talkingdata.marketing.streaming.util.JsonUtil
import com.tendcloud.tenddata.entity.EventPackage
import org.apache.spark._
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{SaveMode, SparkSession}
import org.apache.spark.streaming._
import org.apache.spark.streaming.dstream.{DStream, InputDStream}
import org.elasticsearch.spark.rdd.EsSpark
import org.slf4j.{Logger, LoggerFactory}

/**
  * Created by yangtao on 2017/9/6.
  */
object MarketingStreaming {

  val logger: Logger = LoggerFactory.getLogger(MarketingStreaming.getClass)

  def main(args: Array[String]): Unit = {
    val pipelineExecutor = new PipelineExecutor
    val streamingProperties: Properties = readProperties(pipelineExecutor)
    val topic = Set(streamingProperties.getProperty("marketing.streaming.kafka.topic", "marketing"))
    val kafkaParam: Map[String, String] = getKafkaParam(streamingProperties)
    logger.info(String.format("kafka topic: %s", topic.toString))

    initEsMapping(pipelineExecutor)

    val sparkConfig: SparkConf = getSparkConf(streamingProperties)
    val streamingContext = new StreamingContext(sparkConfig, Seconds(getBatchDuration(streamingProperties)))

    val kafkaManger = new KafkaOffserManager(kafkaParam)
    val directKafkaStream = kafkaManger.createDirectStream[String, String, StringDecoder, StringDecoder](streamingContext, kafkaParam, topic)

    val mktAccumulatorV2 = new MktAccumulatorV2
    streamingContext.sparkContext.register(mktAccumulatorV2, "mktAccumulatorV2")

    executorAndUpdateOffset(kafkaManger, directKafkaStream, pipelineExecutor, mktAccumulatorV2)

    streamingContext.start()
    streamingContext.awaitTermination()
  }

  /**
    * 初始化ES Mapping
    */
  private def initEsMapping(pipelineExecutor: PipelineExecutor) = {
    // 初始化写入es的数据的mapping
    pipelineExecutor.initEsMapping()
  }

  /**
    * 执行pipeline，执行成功后更新spark streaming消费的offset到zookeeper中
    *
    * @param kafkaManger       KafkaOffserManager
    * @param directKafkaStream InputDStream
    */
  private def executorAndUpdateOffset(kafkaManger: KafkaOffserManager, directKafkaStream: InputDStream[(String, String)],
                                      pipelineExecutor: PipelineExecutor, mktAcc: MktAccumulatorV2) = {
    val eventPackageDStream: DStream[EventPackage] = directKafkaStream
      .map(record => {
        try {
          JSON.parseObject(record._2, classOf[EventPackage])
        } catch {
          case _: JSONException =>
            logger.warn("kafka input record: {}, is not EventPackage json", record._2)
            null
        }
      })
      .filter(_ != null)

    eventPackageDStream.foreachRDD(epRdd => {
      val resultRdd: RDD[Array[ExecutorResultData]] = epRdd.mapPartitions(epIte => {
        val pipelineExecutor = new PipelineExecutor
        pipelineExecutor.injectMktAcc2Monitor(mktAcc)
        epIte.map(epMap => {
          // 调用执行引擎,执行全局的规则校验
          val validate = pipelineExecutor.validator(epMap)
          var resultData: Array[ExecutorResultData] = null
          if (validate) {
            val result = pipelineExecutor.executor(epMap)
            if (!result.isEmpty) {
              resultData = result.asScala.toArray
            }
          }
          resultData
        })
      })
      val resultDataRdd: RDD[ExecutorResultData] = resultRdd.filter(_ != null).flatMap(arr => arr)
      resultDataRdd.cache()
      saveDataToEs(resultDataRdd)
      saveDataToHdfs(resultDataRdd)
      // 保存至数据库
      val monitorMap = mktAcc.value
      pipelineExecutor.saveMonitor(monitorMap)
      mktAcc.reset()
    })

    // 更新zookeeper中当前consumer消费的offset
    directKafkaStream.foreachRDD(rdd => kafkaManger.updateZKOffsets(rdd))
  }

  /**
    * 获取配置文件中spark配置信息，并初始化SparkConf
    *
    * @param streamingProperties marketing-streaming.properties
    * @return SparkConf
    */
  private def getSparkConf(streamingProperties: Properties) = {
    new SparkConf()
      .setAppName("talkingdata-marketing-streaming")
      .set("es.nodes", streamingProperties.getProperty("es.hostname"))
      .set("es.port", streamingProperties.getProperty("es.port"))
  }

  /**
    * 获取配置文件中的kafka配置信息
    *
    * @param streamingProperties marketing-streaming.properties
    * @return Map
    */
  private def getKafkaParam(streamingProperties: Properties) = {
    val brokerList = streamingProperties.getProperty("marketing.streaming.kafka.brokers")
    val groupId = streamingProperties.getProperty("spark.consumer.group.id", "mkt_group_001")
    val leaderbackoffms = streamingProperties.getProperty("refresh.leader.backoff.ms", "3000")
    val kafkaParam = Map[String, String](
      "bootstrap.servers" -> brokerList,
      "refresh.leader.backoff.ms" -> leaderbackoffms,
      "group.id" -> groupId,
      // 默认是最大偏移量读取kafka分区中数据,此处设置为最小
      "auto.offset.reset" -> "smallest"
    )
    logger.info(String.format("kafka broker: %s, consumer group id: %s, refresh.leader.backoff.ms: %s",
      brokerList.toString, groupId, leaderbackoffms))
    kafkaParam
  }

  /**
    * 获取spark streaming 批次间隔时间
    *
    * @param streamingProperties marketing-streaming.properties
    * @return spark.streaming.batchDuration为数值类型则返回，否则返回默认值60
    */
  private def getBatchDuration(streamingProperties: Properties): Int = {
    val batchDuration = streamingProperties.getProperty("spark.streaming.batchDuration", "60")
    try {
      batchDuration.toInt
    } catch {
      case _: NumberFormatException =>
        logger.warn("properties spark.streaming.batchDuration:{}, is not a numerical type, use default 60s", batchDuration)
        60
    }
  }

  /**
    * 读取marketing-streaming.properties文件
    *
    * @return Properties
    */
  def readProperties(pipelineExecutor: PipelineExecutor): Properties = {
    pipelineExecutor.getApplicationContext.getBean("marketing-streaming", classOf[Properties])
  }

  /**
    * 保存EventPackage，MessageData，EquityDistributionRecord 数据至ES
    *
    * @param resultDataRdd 经过pipeline处理完成的数据
    */
  def saveDataToEs(resultDataRdd: RDD[ExecutorResultData]): Unit = {
    val toEsRdd: RDD[ExecutorResultDataContent[_]] = resultDataRdd.filter(rd => {
      SAVE_TYPE_ES.equals(rd.getSaveType)
    }).map(rd => rd.getContent)

    saveEpWraperToEs(toEsRdd)
    saveMessageDataToEs(toEsRdd)
    saveEquityToEs(toEsRdd)
  }

  /**
    * 保存EventPackage数据至ES
    *
    * @param toEsRdd 写到ES的所有数据
    */
  def saveEpWraperToEs(toEsRdd: RDD[ExecutorResultDataContent[_]]): Unit = {
    var epWraperRdd: RDD[EventPackageWraper] = toEsRdd
      .filter(rdc => DATA_TYPE_EVENTPACKAGE.equals(rdc.getDataType))
      .map(rdc => {
        rdc.getDataContent match {
          case wraper: EventPackageWraper =>
            wraper
          case _ =>
            null
        }
      })
    epWraperRdd = epWraperRdd.filter(_ != null)
    EsSpark.saveToEs(epWraperRdd, EP_ES_INDEX + "/" + EP_ES_TYPE)
  }

  /**
    * 保存MessageData数据至ES
    *
    * @param toEsRdd 写到ES的所有数据
    */
  def saveMessageDataToEs(toEsRdd: RDD[ExecutorResultDataContent[_]]): Unit = {
    var mdRdd: RDD[MessageData] = toEsRdd
      .filter(rdc => DATA_TYPE_MESSAGEDATA.equals(rdc.getDataType))
      .map(rdc => {
        rdc.getDataContent match {
          case md: MessageData =>
            md
          case _ =>
            null
        }
      })
    mdRdd = mdRdd.filter(_ != null)
    EsSpark.saveToEs(mdRdd, MESSAGE_ES_INDEX + "/" + MESSAGE_ES_TYPE)
  }

  /**
    * 保存EquityDistributionRecord数据至ES
    *
    * @param toEsRdd 写到ES的所有数据
    */
  def saveEquityToEs(toEsRdd: RDD[ExecutorResultDataContent[_]]): Unit = {
    var equityRdd: RDD[EquityDistributionRecord] = toEsRdd
      .filter(rdc => DATA_TYPE_EQUITY.equals(rdc.getDataType))
      .map(rdc => {
        rdc.getDataContent match {
          case equity: EquityDistributionRecord =>
            equity
          case _ =>
            null
        }
      })
    equityRdd = equityRdd.filter(_ != null)
    EsSpark.saveToEs(equityRdd, EQUITY_ES_INDEX + "/" + EQUITY_ES_TYPE)
  }

  /**
    * 保存GenerateCrowd, 异常的Eventpackage 数据至HDFS
    *
    * @param resultDataRdd 经过pipeline处理完成的数据
    */
  def saveDataToHdfs(resultDataRdd: RDD[ExecutorResultData]): Unit = {
    val toHdfsRdd: RDD[ExecutorResultDataContent[_]] = resultDataRdd.filter(rd => {
      SAVE_TYPE_HDFS.equals(rd.getSaveType)
    }).map(rd => rd.getContent)
    val spark = SparkSession.builder.config(toHdfsRdd.sparkContext.getConf).getOrCreate()
    saveCrowdToHdfs(toHdfsRdd, spark)
    saveExEpToHdfs(toHdfsRdd, spark)
  }

  /**
    * 保存GenerateCrowd数据至HDFS
    *
    * @param toHdfsRdd 写到HDFS的所有数据
    * @param spark     SparkSession
    */
  def saveCrowdToHdfs(toHdfsRdd: RDD[ExecutorResultDataContent[_]], spark: SparkSession): Unit = {
    var genCrowdRdd: RDD[GenerateCrowd] = toHdfsRdd
      .filter(rdc => DATA_TYPE_GENERATE_CROWD.equals(rdc.getDataType))
      .map(rdc => {
        rdc.getDataContent match {
          case crowd: GenerateCrowd =>
            crowd
          case _ =>
            null
        }
      })
    genCrowdRdd = genCrowdRdd.filter(_ != null)
    import spark.implicits._
    val genCrowdDs = genCrowdRdd.map(gr => GenerateCrowdScala(gr.getCampaignId, gr.getPipelineId, gr.getOffset)).toDS()
    // TODO 此处可根据批次数据量，缩小分区数，避免产生过多的小文件
    genCrowdDs.write.mode(SaveMode.Append).partitionBy(GENERATE_CROWD_HDFS_PARTITION: _*).csv(GENERATE_CROWD_HDFS_DIR)
  }

  /**
    * 保存异常的EventPackage数据至HDFS
    *
    * @param toHdfsRdd 写到HDFS的所有数据
    * @param spark     SparkSession
    */
  def saveExEpToHdfs(toHdfsRdd: RDD[ExecutorResultDataContent[_]], spark: SparkSession): Unit = {
    var exEpRdd: RDD[String] = toHdfsRdd
      .filter(rdc => DATA_TYPE_EXCEPTION_EP.equals(rdc.getDataType))
      .map(rdc => {
        rdc.getDataContent match {
          case ep: EventPackage =>
            JsonUtil.toJsonString(ep)
          case _ =>
            null
        }
      })
    exEpRdd = exEpRdd.filter(_ != null)
    import spark.implicits._
    val exEpDs = exEpRdd.toDS()
    // TODO 此处可根据批次数据量，缩小分区数，避免产生过多的小文件
    exEpDs.write.mode(SaveMode.Append).text(EXCEPTION_EP_HDFS_DIR)
  }

}

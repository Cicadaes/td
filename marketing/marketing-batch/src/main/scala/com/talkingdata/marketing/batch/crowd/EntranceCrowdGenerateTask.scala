package com.talkingdata.marketing.batch.crowd

import java.util.Properties

import com.talkingdata.marketing.core.util.JsonUtil
import com.talkingdata.marketing.util.ConfigUtil
import com.tendcloud.tenddata.entity.EventPackage
import org.apache.spark.SparkConf
import org.apache.spark.broadcast.Broadcast
import org.apache.spark.sql.{DataFrame, Dataset, SparkSession}
import org.slf4j.{Logger, LoggerFactory}

import scala.collection.mutable.HashMap
import scala.collection.mutable.ListBuffer


/**
  * Created by tend on 2017/11/22
  */
object EntranceCrowdGenerateTask {

  val logger: Logger = LoggerFactory.getLogger(EntranceCrowdGenerateTask.getClass)

  /**
    * 用户属性配置表
    */
  val PROFILE_CONFIG_TABLE: String = "TD_MKT_INPUT_DATA_SCHEMA"
  /**
    * 用户属性配置KEY
    */
  val PROFILE_CONFIG_KEY: String = "code"

  /**
    * 用户事件配置表
    */
  val EVENT_CONFIG_TABLE: String = "TD_MKT_FUNNEL_INDEX_DEFINITION"
  /**
    * 用户事件配置KEY
    */
  val EVENT_CONFIG_KEY: String = "event_id"

  /**
    * 用户管家user_log表attributes属性里event_id所对应的字段名
    */
  val USER_LOG_EVENT_ID_KEY: String = "event_id" //test

  val PIPELINE_CAMPAIGN_MAP: HashMap[String, String] = new HashMap[String, String]

  /**
    * 配置文件
    */
  val configs: Properties = ConfigUtil.readProperties("config.properties")

  /**
    * HDFS路径前缀
    */
  var hdfsURI: String = configs.getProperty("hdfs.uri")

  def main(args: Array[String]): Unit = {

    val sparkConf = getSparkConf("EntranceCrowdSparkTask")
    sparkConf.setMaster("local") //test

    val spark = getSparkSession(sparkConf)

    //hql association query
    val crowdGroupDf = sparkSqlQuery(spark, args)

    //make eventPackage
    val resultDs = makeEventPackage(spark, crowdGroupDf, args)
    resultDs.show()

    //send to kafka
    sendToKafka(spark, resultDs)
  }

  /**
    * 通过sql关联查询结果集
    *
    * @param spark
    * @param args
    * @return
    */
  private def sparkSqlQuery(spark: SparkSession, args: Array[String]): DataFrame = {

    //人群用户表
    //test
    val crowdTable = "user_crowd"

    val df1 = spark.read.json("/Users/liran/Downloads/营销管家/crowdData/user_crowd.txt")
    df1.createOrReplaceTempView(crowdTable.toUpperCase())
    df1.show()
    //TODO 与上面3行本地使用对等
    //    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.commonQueryHql(args(0)), args(0).toUpperCase())

    //用户ID映射息
    //test
    var tableInfoDt = spark.read.textFile("/Users/liran/Downloads/营销管家/crowdData/tableInfo")
    //TODO 与上面1行本地使用对等
    //    var tableInfoDt: Dataset[String] = null
    //    if (args.length > 1) {
    //      tableInfoDt  = spark.read.textFile(hdfsURI + args(1))
    //    }
    tableInfoDt.show()
    val tableInfoStr = tableInfoDt.first()
    val mapTableCode = tableInfoStr.split(",")(0)
    val mapTableColumn = tableInfoStr.split(",")(1)

    //test
    val df4 = spark.read.json("/Users/liran/Downloads/营销管家/crowdData/mapping_table.txt")
    df4.createOrReplaceTempView(mapTableCode)
    df4.show()
    //TODO 与上面3行本地使用对等
    //    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.crowdUserHql(args(0).toUpperCase(), mapTableCode, mapTableColumn), SqlConstants.CROWD_USER_DF)
    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.crowdUserHql(crowdTable.toUpperCase(), mapTableCode, mapTableColumn), SqlConstants.CROWD_USER_DF)

    //用户属性表
    //test
    val df2 = spark.read.json("/Users/liran/Downloads/营销管家/crowdData/user_profile.txt")
    df2.createOrReplaceTempView(SqlConstants.USER_PROFILE_DF)
    df2.show()
    //TODO 与上面3行本地使用对等
    //    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.commonQueryHql(SqlConstants.USER_PROFILE_TABLE), SqlConstants.USER_PROFILE_DF)
    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.crowdProfileHql(), SqlConstants.CROWD_PROFILE_DF)

    //用户事件表
    //test
    val df3 = spark.read.json("/Users/liran/Downloads/营销管家/crowdData/user_log.txt")
    df3.createOrReplaceTempView(SqlConstants.USER_LOG_ALL_DF)
    df3.show()
    //TODO 与上面3行本地使用对等
    //    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.commonQueryHql(SqlConstants.USER_LOG_ALL_TABLE), SqlConstants.USER_LOG_ALL_DF)

    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.crowdProfileLogHql(), SqlConstants.CROWD_PROFILE_LOG_DF)
    SparkSqlMaker(spark).createOrReplaceTempView(SparkSqlMaker.crowdGroupHql(), SqlConstants.CROWD_GROUP_DF)
  }

  /**
    * 遍历每个人的信息，封装成eventPackage对象
    *
    * @param spark
    * @param crowdGroupDf
    * @param args
    * @return
    */
  private def makeEventPackage(spark: SparkSession, crowdGroupDf: DataFrame, args: Array[String]): Dataset[String] = {
    //profile配置
    val profileConfigs = getUserConfig(spark, PROFILE_CONFIG_TABLE, PROFILE_CONFIG_KEY)
    //event配置
    val eventConfigs = getUserConfig(spark, EVENT_CONFIG_TABLE, EVENT_CONFIG_KEY)
    //活动和pipeline映射关系
    getCampaignPipelineMap(spark)

    import spark.implicits._
    val resultDs: Dataset[String] = crowdGroupDf.transform[String](row => {
      row.map(r => {
        val eventPackage: EventPackage = new EventPackage()

        EventPackageMaker(eventPackage, r).basicInfo()
        EventPackageMaker(eventPackage, r).profileInfo(profileConfigs.toList)
        EventPackageMaker(eventPackage, r).eventInfo(eventConfigs.toList)

        JsonUtil.toJson(eventPackage)
      })
    })
    resultDs
  }

  /**
    * 获取前台配置参数
    *
    * @param spark
    * @param table
    * @param column
    * @return
    */
  def getUserConfig(spark: SparkSession, table: String, column: String): ListBuffer[String] = {
    val querySql = SparkSqlMaker.getQuerySqlWithWhere(table, null)
    val profileDF = getJDBCQueryResult(spark, querySql)
    var profileConfigs = new ListBuffer[String]
    profileDF.select(column).distinct.collect.map(row => {
      val profileConfig: String = row.getAs[String](column)
      profileConfigs += profileConfig
    })
    profileConfigs
  }

  /**
    * 获取活动和pipeline映射关系
    *
    * @param spark
    * @return
    */
  def getCampaignPipelineMap(spark: SparkSession) = {
    val querySql = SparkSqlMaker.getCampaignPipelineMapSql()
    val campaignPipelineMapDt = getJDBCQueryResult(spark, querySql)
    campaignPipelineMapDt.foreach(row => {
      val campaignId: Long = row.getAs[Long]("campaign_id")
      val pipelineId: Long = row.getAs[Long]("pipeline_id")
      PIPELINE_CAMPAIGN_MAP.put(pipelineId.toString, campaignId.toString)
    })
  }

  /**
    * 序列化对象发送至kafka
    *
    * @param spark
    * @param resultDs
    */
  private def sendToKafka(spark: SparkSession, resultDs: Dataset[String]): Unit = {
    val kafkaProducer = getKafkaProducer(spark)
    val topic: String = configs.getProperty("kafka.topic")
    logger.info(String.format("kafka topic: %s", topic))

    resultDs.foreach(result => {
      logger.debug("send to kafka value : " + result) //test
      println("send to kafka value : " + result) //test
      //kafkaProducer.value.send(topic, resultJson)
    })
  }

  /**
    * 获取配置文件中的数据库连接并执行查询
    *
    * @param spark
    * @param querySql
    * @return
    */
  def getJDBCQueryResult(spark: SparkSession, querySql: String): DataFrame = {
    val readConnProperties = new Properties()
    readConnProperties.put("driver", configs.getProperty("datasource.driverClassName"))
    readConnProperties.put("user", configs.getProperty("datasource.username"))
    readConnProperties.put("password", configs.getProperty("datasource.password"))
    readConnProperties.put("fetchsize", configs.getProperty("datasource.fetchsize"))

    val jdbcDF = spark.read.jdbc(
      configs.getProperty("datasource.url"),
      querySql,
      readConnProperties)
    jdbcDF
  }

  /**
    * 初始化kafka广播对象
    *
    * @param spark
    * @return
    */
  def getKafkaProducer(spark: SparkSession): Broadcast[KafkaSinkManager[String, String]] = {
    val kafkaProducer: Broadcast[KafkaSinkManager[String, String]] = {
      val kafkaProducerConfig = getKafkaParam()
      spark.sparkContext.broadcast(KafkaSinkManager[String, String](kafkaProducerConfig))
    }
    kafkaProducer
  }

  /**
    * 获取配置文件中的kafka配置信息
    *
    * @return Map
    */
  def getKafkaParam() = {
    val brokerList = configs.getProperty("kafka.metadata.broker.list")
    val serializer = configs.getProperty("kafka.serializer.StringEncoder")
    val kafkaParam = Map[String, String](
      "bootstrap.servers" -> brokerList,
      "key.serializer" -> serializer,
      "value.serializer" -> serializer
    )
    logger.info(String.format("kafka brokers: %s, key.serializer: %s, value.serializer: %s",
      brokerList.toString, serializer, serializer))
    kafkaParam
  }

  /**
    * 获取配置文件中的Spark配置信息
    *
    * @param appName
    * @return Map
    */
  def getSparkConf(appName: String): SparkConf = {
    hdfsURI = configs.getProperty("hdfs.uri")
    new SparkConf()
      .setAppName(appName)
      .setMaster(configs.getProperty("spark.master"))
  }

  /**
    * 获取SparkSession
    *
    * @param sparkConf
    */
  def getSparkSession(sparkConf: SparkConf): SparkSession = {
    val spark = SparkSession
      .builder()
      .config(sparkConf)
      .getOrCreate()
    spark
  }

}


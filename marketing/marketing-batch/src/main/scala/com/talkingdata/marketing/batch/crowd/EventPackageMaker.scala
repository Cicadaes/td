package com.talkingdata.marketing.batch.crowd

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.tendcloud.tenddata.entity.{AppEvent, EventPackage, Session, TMessage}
import org.apache.spark.sql.Row
import org.apache.spark.sql.catalyst.expressions.GenericRowWithSchema
import org.slf4j.{Logger, LoggerFactory}

import scala.collection.mutable

class EventPackageMaker(eventPackage: EventPackage, r: Row) extends Serializable {

  val logger: Logger = LoggerFactory.getLogger(EventPackageMaker.getClass)

  val mapper = (new ObjectMapper()).registerModule(DefaultScalaModule)

  /**
    * 封装EventPackage基础信息
    *
    * @return
    */
  def basicInfo(): EventPackage ={
    //basic info
    val pipelineId: String = r.getAs("pipeline_id")
    val crowdId: String = r.getAs("crowd_id")
    val userId: String = r.getAs("user_id")
    eventPackage.mDeviceId = userId
    eventPackage.additiveProfile.campaignId = Integer.parseInt(EntranceCrowdGenerateTask.PIPELINE_CAMPAIGN_MAP.getOrElse(pipelineId, "0"))
    eventPackage.additiveProfile.pipelineDefinitionId = Integer.parseInt(pipelineId)
    eventPackage.additiveProfile.crowdId = Integer.parseInt(crowdId)

    eventPackage
  }

  /**
    * 封装EventPackage用户属性信息
    *
    * @return
    */
  def profileInfo(profileConfigs: List[String]): EventPackage ={
//    val profileConfigJsonStr = "[\"gender\",\"age\"]" //test
//    val profileConfigs: List[String] = mapper.readValue(profileConfigJsonStr, classOf[List[String]])//test

    val profileRowWithSchema: GenericRowWithSchema = r.getAs[GenericRowWithSchema]("profile_attributes")

    if (profileRowWithSchema != null) {
      val profileResultMap = new java.util.HashMap[String, AnyRef]

      //取出真正字段
      var profileKeyMapping: scala.collection.mutable.Map[String, String] = new scala.collection.mutable.HashMap[String, String]()
      for (profileSchema <- profileRowWithSchema.schema) {
        try {
          val realKey: String = profileSchema.name
          val keyArr = realKey.split(SqlConstants.COLUMN_DELIMITER)
          if (keyArr.length > 1) {
            val key: String = keyArr(1)
            profileKeyMapping += (key -> realKey)
          }
        } catch {
          case ex: Exception => {
            logger.error(String.format("map error : profile table schema.name = %s", profileSchema.name))
            ex.printStackTrace()
          }
        }
      }

      //循环配置的属性
      for (profileConfigKey <- profileConfigs) {
        try {
          val profileConfigRealKey = profileKeyMapping.getOrElse(profileConfigKey, "").toString
          if (!profileConfigRealKey.isEmpty) {
            val value: String = profileRowWithSchema.getAs[String](profileConfigRealKey)
            profileResultMap.put(profileConfigKey, value)
          } else {
            logger.error(String.format("profile table has no config key : %s", profileConfigKey))
          }
        } catch {
          case ex: Exception => {
            ex.printStackTrace()
          }
        }
      }
      eventPackage.userProfile.profileMap = profileResultMap
    }
    eventPackage
  }

  /**
    * 封装EventPackage事件信息
    *
    * @return
    */
  def eventInfo(eventConfigs: List[String]): EventPackage ={
//    val eventConfigJsonStr = "[\"id\",\"version\"]" //test
//    val eventConfigs: List[String] = mapper.readValue(eventConfigJsonStr, classOf[List[String]])//test

    val eventAttributesListRowWithSchemas: mutable.WrappedArray[GenericRowWithSchema] = r.getAs[mutable.WrappedArray[GenericRowWithSchema]]("log_attributes_list")

    val appEvents = new java.util.ArrayList[AppEvent]
    if (eventAttributesListRowWithSchemas != null) {
      for (eventAttributes <- eventAttributesListRowWithSchemas.seq) {

        if (eventAttributes != null) {
          val appEvent = new AppEvent

          //取出真正字段
          var eventAttributesKeyMapping: scala.collection.mutable.Map[String, String] = new scala.collection.mutable.HashMap[String, String]()
          var needAdd: Boolean = false
          for (eventAttributesSchema <- eventAttributes.schema) {
            try {
              val realKey: String = eventAttributesSchema.name
              val keyArr = realKey.split(SqlConstants.COLUMN_DELIMITER)
              if(keyArr.length > 1) {
                val key: String = keyArr(1)
                if(!key.isEmpty) {
                  eventAttributesKeyMapping += (key -> realKey)

                  if (key.equals(EntranceCrowdGenerateTask.USER_LOG_EVENT_ID_KEY)) {
                    val value: String = eventAttributes.getAs[String](realKey)
                    if (!value.isEmpty && eventConfigs.contains(value)) {
                      needAdd = true
                      appEvent.id = value
                    }
                  }
                }
              }
            } catch {
              case ex: Exception => {
                logger.error(String.format("map error : event table schema.name = %s", eventAttributesSchema.name))
                ex.printStackTrace()
              }
            }
          }

          //封装appEvent对象
          if(needAdd){
            val eventResultMap = new java.util.HashMap[String, AnyRef]
            for (eventAttributesKeyMap <- eventAttributesKeyMapping) {
              val key = eventAttributesKeyMap._1
              val realKey = eventAttributesKeyMap._2

              if (!realKey.isEmpty) {
                try {
                  val value: String = eventAttributes.getAs[String](realKey)
                  //parameters
                  eventResultMap.put(realKey, value)
                } catch {
                  case ex: Exception => {
                    ex.printStackTrace()
                  }
                }
              } else {
                logger.error(String.format("log table has no config key : %s", key))
              }
            }
            appEvent.parameters = eventResultMap
            appEvents.add(appEvent)
          } else {
            logger.error(String.format("log table has no event_id key : %s", EntranceCrowdGenerateTask.USER_LOG_EVENT_ID_KEY))
          }

          /*//原方案
          //循环配置封装值
          val appEvent = new AppEvent
          var needAdd: Boolean = false
          for (eventConfigKey <- eventConfigs) {
            var value: String = ""
            try {
              val eventConfigRealKey = eventAttributesKeyMapping.getOrElse(eventConfigKey, "").toString
              if (!eventConfigRealKey.isEmpty) {
                value = eventAttributes.getAs[String](eventConfigRealKey) + ""
                needAdd = true
              } else {
                logger.error(String.format("log table has no config key : %s", eventConfigKey))
              }
            } catch {
              case ex: Exception => {
                ex.printStackTrace()
              }
            }

            eventConfigKey match {
              case "id" => {
                appEvent.id = value
              }
              case "label" => {
                appEvent.label = value
              }
              case "count" => {
                var valueInt = 0
                if (value.equals("")) {
                  valueInt = Integer.parseInt(value)
                }
                appEvent.count = valueInt
              }
              case "startTime" => {
                var valueInt = 0
                if (value.equals("")) {
                  valueInt = Integer.parseInt(value)
                }
                appEvent.startTime = valueInt.longValue()
              }
              case _ => logger.error(String.format("error eventConfigKey : %s", eventConfigKey)) //都不匹配时
            }
          }if (needAdd) {
            appEvents.add(appEvent)
          }*/

        }
      }
    }
    val session = new Session
    session.appEvents = appEvents
    val message = new TMessage
    message.session = session
    eventPackage.mTMessages.add(message)

    eventPackage
  }
}

object EventPackageMaker { //静态类
  def main(args: Array[String]): Unit = {

  }

  def apply(eventPackage: EventPackage, r: Row): EventPackageMaker = {
    new EventPackageMaker(eventPackage, r)
  }

}
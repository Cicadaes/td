package com.talkingdata.marketing.batch.crowd

object SqlConstants {

  /**
    * 参数配置JSON的固定KEY
    */
  val CONFIG_KEY: String = "key"
  /**
    * 用户管家字段名分割符
    */
  val COLUMN_DELIMITER: String = "-"

  /**
    * 用户管家Spark用户属性表名
    */
  val USER_PROFILE_TABLE:String = "user_profile"
  /**
    * Spark用户属性DF名
    */
  val USER_PROFILE_DF: String = USER_PROFILE_TABLE.toUpperCase()

  /**
    * 用户管家Spark用户事件表名
    */
  val USER_LOG_ALL_TABLE: String = "user_log_all"
  /**
    * Spark用户事件DF名
    */
  val USER_LOG_ALL_DF: String = USER_PROFILE_TABLE.toUpperCase()

  /**
    * 用户人群、用户ID表
    */
  val CROWD_USER_DF: String = "TD_MKT_CROWD_USER"

  /**
    * Spark人群属性DF名
    */
  val CROWD_PROFILE_DF: String = "TD_MKT_CROWD_PROFILE"

  /**
    * Spark人群属性事件DF名
    */
  val CROWD_PROFILE_LOG_DF: String = "TD_MKT_CROWD_PROFILE_LOG"

  /**
    * Spark人群属性事件合并DF名
    */
  val CROWD_GROUP_DF: String = "TD_MKT_CROWD_GROUP"
}

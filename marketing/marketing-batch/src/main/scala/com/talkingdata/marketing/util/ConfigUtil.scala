package com.talkingdata.marketing.util

import java.util.Properties

object ConfigUtil {

  /**
    * 读取config.properties文件
    *
    * @return Properties
    */
  def readProperties(fileName : String): Properties = {
    val inputStream = this.getClass.getClassLoader.getResourceAsStream(fileName)
    val prop = new Properties()
    prop.load(inputStream)
    prop
  }
}

package com.talkingdata.marketing.util

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import net.minidev.json.JSONObject
import net.minidev.json.parser.JSONParser

import scala.collection.JavaConversions.{mapAsScalaMap, mutableMapAsJavaMap}
import scala.collection.mutable


object JsonUtil extends App {

  /**
    * 将map转为json
    *
    * @param map 输入格式 mutable.Map[String,Object]
    * @return
    **/
  def map2Json(map: mutable.Map[String, Object]): String = {

    val jsonString = JSONObject.toJSONString(map)

    jsonString
  }

  /**
    * 将json转化为Map
    *
    * @param json 输入json字符串
    * @return
    **/
  def json2Map(json: String): mutable.HashMap[String, Object] = {

    val map: mutable.HashMap[String, Object] = mutable.HashMap()

    val jsonParser = new JSONParser()

    //将string转化为jsonObject
    val jsonObj: JSONObject = jsonParser.parse(json).asInstanceOf[JSONObject]

    //获取所有键
    val jsonKey = jsonObj.keySet()

    val iter = jsonKey.iterator()

    while (iter.hasNext) {
      val field = iter.next()
      val value = jsonObj.get(field).toString

      if (value.startsWith("{") && value.endsWith("}")) {
        val value = mapAsScalaMap(jsonObj.get(field).asInstanceOf[java.util.HashMap[String, String]])
        map.put(field, value)
      } else {
        map.put(field, value)
      }
    }
    map
  }
}
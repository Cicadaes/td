package com.talkingdata.datacloud.schema.analyzer

import org.apache.spark.sql.types.StructType

/**
  * Created by xuan on 2017/1/10.
  */
trait SchemaAnalyzer {
  def getStructType(fsUrl:String): StructType
}

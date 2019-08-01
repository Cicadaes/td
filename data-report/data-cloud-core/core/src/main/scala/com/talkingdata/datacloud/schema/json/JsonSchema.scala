package com.talkingdata.datacloud.schema.json

import org.apache.spark.sql.execution.datasources.json.InferJsonSchema

/**
  * Created by cloudera on 1/3/17.
  */
class JsonSchema {
  val columnNameOfCorruptRecords = "_incorrect"
  def getSchema(schemaData: Array[String])={
    InferJsonSchema.infer(schemaData, columnNameOfCorruptRecords)
  }
}

object JsonSchema{
  def main(args: Array[String]): Unit = {
    val data = """{"status":"success","data":{"id":33,"name":"test_demo1","desc":"","period":0,"crontab":null,"sql":"insert overwrite into _2_\nselect * from _1_","rely_source_type":2,"configs":"{\"num-executors\":\"2\",\"driver-memory\":\"2g\",\"executor-memory\":\"4g\",\"executor-cores\":\"1\"}","upstream_tasks":null,"input_dataset":"1","output_dataset":"2","type":2,"create_type":0,"offset":0,"receiver":"","receive_condition":"","mail_switch":0,"status":0,"creator":3,"create_time":1472872672000,"update_time":1479461500000}}"""
    val schemaData = Array(data)
    val js = new JsonSchema
    js.getSchema(schemaData).printTreeString()
  }
}

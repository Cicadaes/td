package com.talkingdata.datacloud.RanksConvert

import java.util.UUID

import org.apache.spark.sql.{DataFrame, SparkSession}
import org.apache.spark.sql.functions._

/**
  * Created by xuan on 2017/1/12.
  */
object ColumToRow {
  def main(args: Array[String]) {
    val spark = SparkSession.builder()
      .appName(ColumToRow.getClass.getName).getOrCreate()
    import spark.implicits._

    val rowId = UUID.randomUUID().toString
    val df2 = loadData(spark, rowId)

    val df5 = df2.filter($"key"==="name").select(df2(rowId), df2("id"),col("val").alias("name"))
    val df6 = df2.filter($"key"==="point").select(df2(rowId), df2("id"),col("val").alias("point"))

    df5.join(df6, rowId).select(df5("id"), df5("name"), df6("point") )

  }

  val dataFormat = "csv"
  val filePath = "/Users/xuan/Downloads/data2.csv"
  val newHeader = Seq("id", "name", "point")
  val byColNames = Seq("id")

  def loadData(spark: SparkSession, rowId: String): DataFrame ={
    val df = spark.read.format(dataFormat).load(filePath).toDF(newHeader: _*)
    RowToColum.transform(df, byColNames, rowId)
  }
}


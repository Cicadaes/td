package com.talkingdata.datacloud.RanksConvert

import java.util.UUID

import org.apache.spark.sql.{ColumnName, SparkSession, DataFrame}
import org.apache.spark.sql.functions._

/**
  * Created by xuan on 2017/1/12.
  */
object RowToColum {
  val dataFormat = "csv"
  val filePath = "/Users/xuan/Downloads/data2.csv"
  val newHeader = Seq("id", "name", "point")
  val byColNames = Seq("id")

  def main(args: Array[String]) {
    val spark = SparkSession.builder()
      .appName(RowToColum.getClass.getName).getOrCreate()
    import spark.implicits._
    var df = spark.read.format(dataFormat).load(filePath)
    df = df.toDF(newHeader: _*)
    val rowId = UUID.randomUUID().toString


    df = transform(df, byColNames, rowId)
  }

  implicit class StringToColumn(val sc: StringContext) {
    def $(args: Any*): ColumnName = {
      new ColumnName(sc.s(args: _*))
    }
  }

  def transform(df: DataFrame, byClos: Seq[String], rowId: String): DataFrame= {
    val getByColNames = if(byClos.isEmpty) Seq(rowId) else byClos :+ rowId
    val dfTmp = df.withColumn(rowId, monotonically_increasing_id())
    val df2 = toLong(dfTmp, getByColNames)
    df2
  }

  def toLong(df: DataFrame, by: Seq[String]): DataFrame = {
    val (cols, types) = df.dtypes.filter{ case (c, _) => !by.contains(c)}.unzip
    require(types.distinct.size == 1)
    val kvs = explode(array( cols.map(c => struct(lit(c).alias("key"), col(c).alias("val"))): _*))
    val byExprs = by.map(col(_))
    df.select(byExprs :+ kvs.alias("_kvs"): _*).select(byExprs ++ Seq($"_kvs.key", $"_kvs.val"): _*)
  }
}

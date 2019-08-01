package com.talkingdata.datacloud.schema.analyzer

import java.io.{InputStreamReader, BufferedReader, FileFilter, File}
import java.util

import com.talkingdata.datacloud.util.{FileUtils, HdfsUtil}
import org.apache.hadoop.fs.{FileStatus, Path}
import org.apache.spark.sql.execution.datasources.json.InferJsonSchema
import org.apache.spark.sql.types.StructType

import scala.collection.JavaConversions._
/**
  * Created by xuan on 2017/1/10.
  */

class JsonAnalyzer(val path: String, val cs:java.nio.charset.Charset) extends SchemaAnalyzer{
  val UNKNOWN = "数据格式有误"

  override def getStructType(fsUrl:String): StructType = {
    val fs = new HdfsUtil(fsUrl)
    val fileStatus = new util.ArrayList[FileStatus]()
//    val hdfsSampleFile = fs.fileListAndFilter(fileStatus, path, ".json").head
    val hdfsSampleFile = fs.fileList(fileStatus, path).head
    val reader: BufferedReader = new BufferedReader(new InputStreamReader(fs.open(hdfsSampleFile.getPath), cs))
    val buf = scala.collection.mutable.ArrayBuffer[String]()
    (1 to 10).foreach{i =>
      buf.append(reader.readLine())
    }
    val data = buf.filter(_ != null)
    if(data.isEmpty) throw new Exception("data is empty!")
    InferJsonSchema.infer(data.toArray, UNKNOWN)
  }

}

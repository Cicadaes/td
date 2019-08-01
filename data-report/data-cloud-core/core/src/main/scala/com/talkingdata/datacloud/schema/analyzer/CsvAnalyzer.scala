package com.talkingdata.datacloud.schema.analyzer

import java.io.{ InputStreamReader, BufferedReader, File, FileFilter }
import java.util

import com.alibaba.fastjson.JSONObject
import com.talkingdata.datacloud.util.{ FileUtils, HdfsUtil }
import org.apache.hadoop.fs.{ FileStatus, Path }
import org.apache.spark.sql.execution.datasources.csv.InferCSVSchema
import org.apache.spark.sql.types.StructType

import scala.collection.JavaConversions._

/**
 * Created by xuan on 2017/1/10.
 */
class CsvAnalyzer(val path: String, val cs: java.nio.charset.Charset, val delimiter: String, val hasHeader: Boolean) extends SchemaAnalyzer {

  override def getStructType(fsUrl: String): StructType = {
    val lines = collection.mutable.ArrayBuffer[String]()
    val fs = new HdfsUtil(fsUrl)
    try {
      val fileStatus = new util.ArrayList[FileStatus]()
//      val hdfsSampleFile = fs.fileListAndFilter(fileStatus, path, ".csv").head
      val hdfsSampleFile = fs.fileList(fileStatus, path).head
      val reader: BufferedReader = new BufferedReader(new InputStreamReader(fs.open(hdfsSampleFile.getPath), cs))
      try {
        var line: String = reader.readLine
        while (lines.length < 10 && line != null) {
          lines += line
	  line = reader.readLine
        }
      } finally { reader.close() }
    } finally { fs.close() }
    val options = Map[String, String](
      "header" -> (if (hasHeader) "true" else "false"),
      "inferSchema" -> "true",
      "delimiter" -> delimiter,
      "encoding" -> cs.name())
    new InferCSVSchema().inferSchema(lines.toArray, options).get
  }

}

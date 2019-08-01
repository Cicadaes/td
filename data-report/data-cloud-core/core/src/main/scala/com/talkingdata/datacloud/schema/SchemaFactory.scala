package com.talkingdata.datacloud.schema

import com.talkingdata.datacloud.entity.catalog.FieldDetail
import com.talkingdata.datacloud.schema.analyzer.{CsvAnalyzer, JsonAnalyzer, ParquetAnalyzer}

import scala.collection.JavaConversions._

/**
  * Created by xuan on 2017/1/10.
  */
class SchemaFactory(val fsUrl:String, val path: String, var fileType:String, val cs:java.nio.charset.Charset,
    val properties: com.alibaba.fastjson.JSONObject) {

  lazy val analyzer = getAnalyzer()
  val reg = "\\.(parquet|json|csv)$".r

  def findFileType(p: String) = {
    val fileNames = reg.findAllMatchIn(p).map(_.matched)
    val typeName = fileNames.find(!_.isEmpty).getOrElse("")
    require(!typeName.isEmpty, s"$p is not a file path! or file suffix is not in (parquet,json,csv)!")
    typeName
  }

//  def getAnalyzer() = {
////    val fileType = findFileType(path)
//    val fileType = path
//    fileType match {
//      case ".parquet" => new ParquetAnalyzer(path)
//      case ".json" => new JsonAnalyzer(path)
//      case ".csv" => new CsvAnalyzer(path)
//      case _ => throw new Exception("file type not support!")
//    }
//  }

  def getAnalyzer() = {
    if(fileType==null){
      fileType = findFileType(path).substring(1)
    }
    fileType match {
      case "parquet" => new ParquetAnalyzer(path)
      case "json" => new JsonAnalyzer(path, cs)
      case "csv" => {
        val delimiter = properties.getString("csvDelimiter")
        val hasHeader = properties.getBoolean("csvHasHeader")
        new CsvAnalyzer(path, cs, if (delimiter == null) "," else delimiter, hasHeader != null && hasHeader.booleanValue())
      }
      case _ => throw new Exception("file type not support!")
    }
  }

  def analyzerSchema(): String = {
    StructTypeConver2Schema.StructTypeConvert2Json(st, path)
  }

  def st = analyzer.getStructType(fsUrl)

  def delimiter = analyzer

  def analyzerFields(): String = {
    StructTypeConver2FieldsJson.convert(st)
  }

  def analyzerFieldDetails(id: Integer): java.util.List[FieldDetail] = {
    seqAsJavaList(StructTypeConvert2FieldDetail.convertToFields(st, id))
  }
}

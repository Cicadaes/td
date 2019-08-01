package com.talkingdata.datacloud.schema.analyzer

import java.io.{InputStreamReader, BufferedReader}
import java.util

import com.talkingdata.datacloud.schema.parquet.ParquetSchema
import com.talkingdata.datacloud.util.{HdfsUtil}
import org.apache.hadoop.fs.{FileStatus, Path}
import org.apache.parquet.hadoop.ParquetFileReader
import org.apache.spark.sql.types.StructType


/**
  * Created by xuan on 2017/1/10.
  */
class ParquetAnalyzer(val path: String) extends SchemaAnalyzer {


  override def getStructType(fsUrl:String): StructType = {
    val fs = new HdfsUtil(fsUrl)
    val fileStatus = new util.ArrayList[FileStatus]()
//    val hdfsSampleFile = fs.fileListAndFilter(fileStatus, path, ".parquet").get(0)
    val hdfsSampleFile = fs.fileList(fileStatus, path).get(0)
    val rootFooter = ParquetFileReader.readFooter(fs.getFs.getConf, hdfsSampleFile.getPath)
    val schema = rootFooter.getFileMetaData().getSchema()
    val ps = new ParquetSchema(false, false, false);
    val st = ps.convert(schema)
    st
  }
}

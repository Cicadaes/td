package com.talkingdata.datacloud.schema

import java.util.Date

import scala.collection.mutable.ListBuffer

import org.apache.spark.sql.types.ArrayType
import org.apache.spark.sql.types.DataType
import org.apache.spark.sql.types.MapType
import org.apache.spark.sql.types.StructField
import org.apache.spark.sql.types.StructType

import com.talkingdata.datacloud.entity.catalog.FieldDetail

object StructTypeConvert2FieldDetail {

  def convertToFields(dataType: DataType, datasetId: Integer) = {
    val fields = new ListBuffer[FieldDetail]
    parseType(dataType, fields, datasetId)
    fields
  }

  def createField(fields: ListBuffer[FieldDetail], datasetId: Integer, fieldName: String, parent: FieldDetail = null): FieldDetail = {
    val field = new FieldDetail
    fields += field
    field.setSortId(fields.size)
    if (fieldName.length > 100) {
      throw new IllegalArgumentException("字段名过长，无法保存：" + fieldName)
    }
    field.setFieldName(fieldName)
    if (parent != null) {
      field.setParentSortId(parent.getSortId)
      if (parent.getParentSortId > 0) {
          field.setParentPath(parent.getParentPath + "/" + parent.getFieldName)
      } else {
          field.setParentPath(parent.getFieldName)
      }
    } else {
      field.setParentSortId(0)
      field.setParentPath("")
    }
    field.setDatasetId(datasetId)
    field.setFieldsLayoutId(0)
    field.setModified(new Date())
    field
  }

  def parseField(structField: StructField, fields: ListBuffer[FieldDetail], datasetId: Integer, parent: FieldDetail = null) {
    val field = createField(fields, datasetId, structField.name, parent)
    field.setIsNullable(if (structField.nullable) "Y" else "N")
    parseType(structField.dataType, fields, datasetId, field)
  }

  def parseType(dataType: DataType, fields: ListBuffer[FieldDetail], datasetId: Integer, parent: FieldDetail = null) {
    dataType match {
      case arrayType: ArrayType =>
        parent.setDataType("array")
        val field = createField(fields, datasetId, "element", parent)
        field.setIsNullable(if (arrayType.containsNull) "Y" else "N")
        parseType(arrayType.elementType, fields, datasetId, field)
      case mapType: MapType =>
        parent.setDataType("map")
        var field = createField(fields, datasetId, "key", parent)
        field.setIsNullable("N")
        parseType(mapType.keyType, fields, datasetId, field)
        field = createField(fields, datasetId, "value", parent)
        field.setIsNullable(if (mapType.valueContainsNull) "Y" else "N")
        parseType(mapType.valueType, fields, datasetId, field)
      case structType: StructType =>
        if (parent != null) {
            parent.setDataType("record")
        }
        structType.fields.map(field => {
          parseField(field, fields, datasetId, parent)
        })
      case _ =>
        parent.setDataType(dataType.typeName)
    }
  }

  def main(args: Array[String]): Unit = {
    val json = """{"type":"struct","fields":[{"name":"deviceId","type":"string","nullable":true,"metadata":{}},{"name":"platform","type":"integer","nullable":true,"metadata":{}},{"name":"offset","type":"long","nullable":true,"metadata":{}},{"name":"apps","type":{"type":"map","keyType":"long","valueType":"integer","valueContainsNull":false},"nullable":true,"metadata":{}},{"name":"seq","type":{"type":"array","elementType":{"type":"struct","fields":[{"name":"packageName","type":"string","nullable":true,"metadata":{}},{"name":"sdk","type":"string","nullable":true,"metadata":{}},{"name":"appkey","type":"string","nullable":true,"metadata":{}},{"name":"ip","type":"long","nullable":true,"metadata":{}},{"name":"time","type":"long","nullable":false,"metadata":{}},{"name":"cell","type":"integer","nullable":true,"metadata":{}},{"name":"net","type":"string","nullable":true,"metadata":{}},{"name":"mcc","type":"integer","nullable":true,"metadata":{}},{"name":"mnc","type":"integer","nullable":true,"metadata":{}},{"name":"netOperator","type":{"type":"array","elementType":"string","containsNull":false},"nullable":true,"metadata":{}},{"name":"simOperator","type":{"type":"array","elementType":"string","containsNull":false},"nullable":true,"metadata":{}},{"name":"apps","type":{"type":"map","keyType":"long","valueType":"integer","valueContainsNull":false},"nullable":true,"metadata":{}}]},"containsNull":true},"nullable":false,"metadata":{}},{"name":"info","type":{"type":"struct","fields":[{"name":"model","type":"string","nullable":true,"metadata":{}},{"name":"os","type":"string","nullable":true,"metadata":{}},{"name":"pix","type":"string","nullable":true,"metadata":{}},{"name":"mac","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"imei","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"idfa","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"androidId","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"aaid","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"imsi","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"simId","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"openUdid","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"secureUdid","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"carrier","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}}]},"nullable":true,"metadata":{}}]}"""
    val fields = convertToFields(DataType.fromJson(json), 22)
    fields.foreach(field => {
      println(String.format("%s, %s, %s, %s, %s", field.getFieldName, field.getDataType, field.getSortId, field.getParentSortId, field.getParentPath))
    })
  }
}

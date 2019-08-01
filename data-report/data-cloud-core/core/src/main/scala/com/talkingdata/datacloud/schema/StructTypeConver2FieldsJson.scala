package com.talkingdata.datacloud.schema

import org.apache.spark.sql.types._
import org.json4s._
import org.json4s.JsonAST.JValue
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._

import scala.collection.mutable.ListBuffer
/**
  * Created by cloudera on 1/5/17.
  */

private[datacloud] object JSortedObject {
  def unapplySeq(value: JValue): Option[List[(String, JValue)]] = value match {
    case JObject(seq) => Some(seq.toList.sortBy(_._1))
    case _ => None
  }
}

object StructTypeConver2FieldsJson {
  //    fields
  //    {"longField": {"type": "long", "name": "longField"}, "stringField": {"type": "string", "name": "stringField"}}
  //

  def convert(st: DataType): String = {
    val json = st.json
    val fields = parseDataType(parse(json))
    val lb = new ListBuffer[(String, JsonAST.JValue)]
    fields.children.foreach{ c=>
      val jFields = c.asInstanceOf[JObject].obj.asInstanceOf[scala.List[JsonAST.JField]]
      lb.appendAll(jFields)
    }

    val newJObjects = new JObject(lb.toList)
    val resJson = compact(render(newJObjects))
    resJson
  }

  val nonDecimalNameToType = {
    Seq(NullType, DateType, TimestampType, BinaryType, IntegerType, BooleanType, LongType,
      DoubleType, FloatType, ShortType, ByteType, StringType, CalendarIntervalType)
      .map(t => t.typeName -> t).toMap
  }

  /** Given the string representation of a type, return its DataType */
  def nameToType(name: String): DataType = {
    val FIXED_DECIMAL = """decimal\(\s*(\d+)\s*,\s*(\-?\d+)\s*\)""".r
    name match {
      case "decimal" => DecimalType.USER_DEFAULT
      case FIXED_DECIMAL(precision, scale) => DecimalType(precision.toInt, scale.toInt)
      case other => nonDecimalNameToType(other)
    }
  }

  def parseStructField(json: JValue): JValue = json match {
    case JSortedObject(
    ("metadata", metadata: JObject),
    ("name", JString(name)),
    ("nullable", JBool(nullable)),
    ("type", dataType: JValue)) =>
      name -> (
        ("type" -> parseDataType(dataType)) ~
        ("name" -> name)
        )


    // ~
    //      StructField(name, parseDataType(dataType), nullable)
    // Support reading schema when 'metadata' is missing.
    case JSortedObject(
    ("name", JString(name)),
    ("nullable", JBool(nullable)),
    ("type", dataType: JValue)) =>
      ("type" -> "String") ~
        ("name" -> name)
  }

  def parseDataType(json: JValue): JValue = json match {
    case JString(name) =>
      name
    case JSortedObject(
    ("containsNull", JBool(n)),
    ("elementType", t: JValue),
    ("type", JString("array"))) =>
      ("type" -> "array") ~
        ("items" -> parseDataType(t))

    case JSortedObject(
    ("keyType", k: JValue),
    ("type", JString("map")),
    ("valueContainsNull", JBool(n)),
    ("valueType", v: JValue)) =>
      ("type" -> "map") ~
        ("key" -> parseDataType(k)) ~
        ("value" -> parseDataType(v))

    case JSortedObject(
    ("fields", JArray(fields)),
    ("type", JString("struct"))) =>
      (fields.map(parseStructField))
  }

  def main(args: Array[String]): Unit = {
    val json = """{"type":"struct","fields":[{"name":"deviceId","type":"string","nullable":true,"metadata":{}},{"name":"platform","type":"integer","nullable":true,"metadata":{}},{"name":"offset","type":"long","nullable":true,"metadata":{}},{"name":"apps","type":{"type":"map","keyType":"long","valueType":"integer","valueContainsNull":false},"nullable":true,"metadata":{}},{"name":"seq","type":{"type":"array","elementType":{"type":"struct","fields":[{"name":"packageName","type":"string","nullable":true,"metadata":{}},{"name":"sdk","type":"string","nullable":true,"metadata":{}},{"name":"appkey","type":"string","nullable":true,"metadata":{}},{"name":"ip","type":"long","nullable":true,"metadata":{}},{"name":"time","type":"long","nullable":false,"metadata":{}},{"name":"cell","type":"integer","nullable":true,"metadata":{}},{"name":"net","type":"string","nullable":true,"metadata":{}},{"name":"mcc","type":"integer","nullable":true,"metadata":{}},{"name":"mnc","type":"integer","nullable":true,"metadata":{}},{"name":"netOperator","type":{"type":"array","elementType":"string","containsNull":false},"nullable":true,"metadata":{}},{"name":"simOperator","type":{"type":"array","elementType":"string","containsNull":false},"nullable":true,"metadata":{}},{"name":"apps","type":{"type":"map","keyType":"long","valueType":"integer","valueContainsNull":false},"nullable":true,"metadata":{}}]},"containsNull":true},"nullable":false,"metadata":{}},{"name":"info","type":{"type":"struct","fields":[{"name":"model","type":"string","nullable":true,"metadata":{}},{"name":"os","type":"string","nullable":true,"metadata":{}},{"name":"pix","type":"string","nullable":true,"metadata":{}},{"name":"mac","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"imei","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"idfa","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"androidId","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"aaid","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"imsi","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"simId","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"openUdid","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"secureUdid","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}},{"name":"carrier","type":{"type":"array","elementType":"string","containsNull":true},"nullable":true,"metadata":{}}]},"nullable":true,"metadata":{}}]}"""
    val stc = StructTypeConver2FieldsJson.convert(DataType.fromJson(json))
    println(stc)

//    val rightJson = """{"longField": {"type": "long", "name": "longField"}, "stringField": {"type": "string", "name": "stringField"}}"""
//
//    val jV = parse(rightJson)
//    println(jV)
    }


}

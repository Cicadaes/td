package com.talkingdata.datacloud.bitmap

/**
  * Created by changqing on 2017/3/7.
  */

case class OffsetTag(offset: Int, tags: Seq[String])
case class OffsetTag2(offset: Int, tags:String)

object Integers2Bitmap {
//
//  def main(args: Array[String]) {
//
//    val spark = SparkSession
//      .builder()
//      .master("local[2]")
//      .appName("Spark Hive Example")
//
//      .getOrCreate()
//    import spark.implicits._
//    val squaresDF = spark.sparkContext.makeRDD(1 to 5).map(i => (i, i * i)).toDF("value", "square")
//    squaresDF.show()
//    val rdd = spark.sparkContext.parallelize(Array(
//      OffsetTag(342, Seq("aa", "bb")),
//      OffsetTag(543, Seq("aa", "cc")),
//      OffsetTag(64, Seq("dd", "bb")),
//      OffsetTag(342, Seq("aa", "bb")),
//      OffsetTag(543, Seq("aa", "cc")),
//      OffsetTag(64, Seq("dd", "bb")),
//      OffsetTag(342, Seq("aa", "bb")),
//      OffsetTag(543, Seq("aa", "cc")),
//      OffsetTag(64, Seq("dd", "bb")),
//      OffsetTag(64, Seq("dd", "bb")),
//      OffsetTag(342, Seq("aa", "bb")),
//      OffsetTag(543, Seq("aa", "cc")),
//      OffsetTag(64, Seq("dd", "bb")),
//      OffsetTag(342, Seq("aa", "bb")),
//      OffsetTag(543, Seq("aa", "cc")),
//      OffsetTag(543, Seq("aa", "bb")))
//      , 3)
//    val df = spark.createDataFrame(rdd)
//    df.rdd.foreach(println(_))
//
/////标签是list[String] 情况
//    import collection.JavaConversions._
//    val tagOffsets = df.rdd.map(r => (r.getInt(0), r.getAs[Seq[String]](1))).sortByKey(true).mapPartitions {
//      it => val map = mutable.Map[String, mutable.HashSet[Int]]()
//        for ((offset, tags) <- it; tag <- tags) {
//          println(offset+"sssssssaaaaaa"+tag)
//          val offsets = map.get(tag) match {
//            case Some(offsets) => offsets
//            case _ => mutable.HashSet[Int]()
//
//          }
//          offsets += offset
//          map.put(tag, offsets)
//        }
//        map.iterator
//    }
//    def  bitmapOR(base: Array[Byte],other: Array[Byte]): Array[Byte] ={
//      val _base= BitmapUtil.byteArrayToBitmapRequest(base);
//      val _other=BitmapUtil.byteArrayToBitmapRequest(other);
//      _base.or(_other)
//      BitmapUtil.bitmapRequestToByteArray(_base);
//    }
//    val bitmapRdd= tagOffsets.map(l=> {
//      val offsets = l._2
//      val offsetsJ:java.util.List[Integer] = offsets.map(i => java.lang.Integer.valueOf(i)).toList
//      val bitmapNew: ConciseBitmapImpl = new ConciseBitmapImpl(new ConciseSet().convert(offsetsJ))
//      (l._1,BitmapUtil.bitmapRequestToByteArray(bitmapNew))
//    }
//    ).reduceByKey(bitmapOR)
//
//    bitmapRdd.toDF("tag","bitmap").write.mode("overwrite").parquet("/E/datacloud/log/sss/")
//    bitmapRdd.toDF("tag","bitmap").rdd.map(l=> {
//     val bitmap=l.getAs[Array[Byte]](1)
//     val offsets=BitmapUtil.byteArrayToBitmapRequest(bitmap).toArray
//      (l.getString(0),offsets)
//    }).foreach(l=>println(l._1+":::"+l._2.mkString(",")))
////标签是string情况
//
//    val rdd2 = spark.sparkContext.parallelize(Array(
//      OffsetTag2(342, "aa"),
//      OffsetTag2(543, "bb"),
//      OffsetTag2(64, "aa"),
//      OffsetTag2(342, "cc"),
//      OffsetTag2(543, "aa"),
//      OffsetTag2(64, "cc"),
//      OffsetTag2(342, "bb"),
//      OffsetTag2(543, "bb"),
//      OffsetTag2(64, "cc"),
//      OffsetTag2(64, "dd"),
//      OffsetTag2(342, "aa"),
//      OffsetTag2(543, "bb"),
//      OffsetTag2(64, "aa"),
//      OffsetTag2(342, "dd"),
//      OffsetTag2(543, "bb"),
//      OffsetTag2(543, "bb"))
//      , 3)
//    val bitmap_df2 = spark.createDataFrame(rdd2)
//    val bitmap_df =bitmap_df2.select("offset","tags")
//    val tagOffsets2 = bitmap_df.rdd.map(r => (r.getInt(0), r.getAs[String](1))).sortByKey(true).mapPartitions {
//      it => val map = mutable.Map[String, mutable.HashSet[Int]]()
//        for ((offset, tag) <- it) {
//          val offsets = map.get(tag) match {
//            case Some(offsets) => offsets
//            case _ => mutable.HashSet[Int]()
//
//          }
//          offsets += offset
//          map.put(tag, offsets)
//        }
//        map.iterator
//    }
//    val bitmapRdd2= tagOffsets2.map(l=> {
//      val offsets = l._2
//      val offsetsJ:java.util.List[Integer] = offsets.map(i => java.lang.Integer.valueOf(i)).toList
//      val bitmapNew: ConciseBitmapImpl = new ConciseBitmapImpl(new ConciseSet().convert(offsetsJ))
//      (l._1,BitmapUtil.bitmapRequestToByteArray(bitmapNew))
//    }
//    ).reduceByKey(bitmapOR)
//
//    bitmapRdd2.toDF("tag","bitmap").write.mode("overwrite").parquet("/E/datacloud/log/sss/")
//    bitmapRdd2.toDF("tag","bitmap").rdd.map(l=> {
//      val bitmap2=l.getAs[Array[Byte]](1)
//      val offsets=BitmapUtil.byteArrayToBitmapRequest(bitmap2).toArray
//      (l.getString(0),offsets)
//    }).foreach(l=>println(l._1+":::"+l._2.mkString(",")))
//
//    bitmap_df2.select(bitmap_df2("offset").cast("Int"),bitmap_df2("tags").cast("String"))
//
//
//
////    val test = mutable.HashSet[Int](1,5,6)
////
////    val javaTest: java.util.List[Integer] = test.map(i => java.lang.Integer.valueOf(i)).toList
////
////    val bitmapNew = new ConciseBitmapImpl(new ConciseSet().convert(javaTest))
//////    val bitmap = bitmapNew.toArray;
//val DFIN0=bitmap_df2
//    var DFOUT = DFIN0
//    import com.talkingdata.datacloud.operator.util.BitmapUtil
//
//
//    import scala.collection.mutable
//    { def  bitmapOR(base: Array[Byte],other: Array[Byte]): Array[Byte] ={
//      val _base= BitmapUtil.byteArrayToBitmapRequest(base);
//      val _other=BitmapUtil.byteArrayToBitmapRequest(other);
//      _base.or(_other)
//      BitmapUtil.bitmapRequestToByteArray(_base);
//    }
//      val _bitmap_df =DFIN0.select("offset","tags")
//      val bitmap_df =_bitmap_df.select(_bitmap_df("offset").cast("Int"),_bitmap_df("tags").cast("String"))
//      val tagOffsets2 = bitmap_df.rdd.map(r => (r.getInt(0), r.getAs[String](1))).sortByKey(true).mapPartitions {
//        it => val map = mutable.Map[String, mutable.HashSet[Int]]()
//          for ((offset, tag) <- it) {
//            val offsets = map.get(tag) match {
//              case Some(offsets) => offsets
//              case _ => mutable.HashSet[Int]()
//
//            }
//            offsets += offset
//            map.put(tag, offsets)
//          }
//          map.iterator
//      }
//      val bitmapRdd2= tagOffsets2.map(l=> {
//        val offsets = l._2
//        val offsetsJ:java.util.List[Integer] = offsets.map(i => java.lang.Integer.valueOf(i)).toList
//        val bitmapNew: ConciseBitmapImpl = new ConciseBitmapImpl(new ConciseSet().convert(offsetsJ))
//        (l._1,BitmapUtil.bitmapRequestToByteArray(bitmapNew))
//      }
//      ).reduceByKey(bitmapOR)
//
//      DFOUT =  bitmapRdd2.toDF("tags","bitmap") }
//
//    DFOUT.show()
//  }
}

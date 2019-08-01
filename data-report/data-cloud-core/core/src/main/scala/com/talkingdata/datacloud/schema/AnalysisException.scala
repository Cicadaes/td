package com.talkingdata.datacloud.schema

import org.apache.spark.sql.catalyst.plans.logical.LogicalPlan

/**
  * Created by cloudera on 1/3/17.
  */
private[datacloud] class AnalysisException protected[datacloud] (
                                         val message: String,
                                         val line: Option[Int] = None,
                                         val startPosition: Option[Int] = None,
                                         val plan: Option[LogicalPlan] = None,
                                         val cause: Option[Throwable] = None)
  extends Exception(message, cause.orNull) with Serializable {

  def withPosition(line: Option[Int], startPosition: Option[Int]): AnalysisException = {
    val newException = new AnalysisException(message, line, startPosition)
    newException.setStackTrace(getStackTrace)
    newException
  }

  override def getMessage: String = {
    val planAnnotation = plan.map(p => s";\n$p").getOrElse("")
    getSimpleMessage + planAnnotation
  }

  // Outputs an exception without the logical plan.
  // For testing only
  def getSimpleMessage: String = {
    val lineAnnotation = line.map(l => s" line $l").getOrElse("")
    val positionAnnotation = startPosition.map(p => s" pos $p").getOrElse("")
    s"$message;$lineAnnotation$positionAnnotation"
  }
}
package com.talkingdata.marketing.streaming

import java.util.concurrent.ConcurrentHashMap
import java.{lang => jl, util => ju}

import com.talkingdata.marketing.streaming.model.PipelineMonitor
import org.apache.spark.util.AccumulatorV2
import org.slf4j.{Logger, LoggerFactory}

import scala.collection.JavaConverters

/**
  * Created by tend on 2018/3/8.
  */
class MktAccumulatorV2 extends AccumulatorV2[PipelineMonitor, ju.Map[jl.String, PipelineMonitor]] {
  val logger: Logger = LoggerFactory.getLogger(MarketingStreaming.getClass)

  private val monitorMap: ju.Map[jl.String, PipelineMonitor] = new ConcurrentHashMap[jl.String, PipelineMonitor]()

  override def isZero: Boolean = {
    monitorMap.synchronized {
      monitorMap.isEmpty
    }
  }

  override def copyAndReset(): MktAccumulatorV2 = new MktAccumulatorV2

  override def copy(): AccumulatorV2[PipelineMonitor, ju.Map[String, PipelineMonitor]] = {
    val newAcc = new MktAccumulatorV2
    monitorMap.synchronized {
      newAcc.monitorMap.putAll(monitorMap)
    }
    newAcc
  }

  override def reset(): Unit = {
    monitorMap.synchronized {
      monitorMap.clear()
    }
  }

  override def add(v: PipelineMonitor): Unit = {
    monitorMap.synchronized {
      val accValue = monitorMap.get(v.getUniqueKey)
      if (accValue != null) {
        accValue.setMetricValue(accValue.getMetricValue + v.getMetricValue)
      } else {
        monitorMap.put(v.getUniqueKey, v)
      }
    }
  }

  override def merge(other: AccumulatorV2[PipelineMonitor, ju.Map[String, PipelineMonitor]]): Unit = other match {
    case oth: MktAccumulatorV2 =>
      val otherMap = JavaConverters.mapAsScalaMapConverter(oth.value).asScala
      monitorMap.synchronized {
        otherMap.foreach(elem => {
          val accValue = monitorMap.get(elem._1)
          if (accValue != null) {
            accValue.setMetricValue(accValue.getMetricValue + elem._2.getMetricValue)
          } else {
            monitorMap.put(elem._1, elem._2)
          }
        })
      }
    case _ =>
      logger.error(s"Cannot merge ${this.getClass.getName} with ${other.getClass.getName}")
  }

  override def value: ju.Map[String, PipelineMonitor] = {
    monitorMap.synchronized {
      new ConcurrentHashMap[jl.String, PipelineMonitor](monitorMap)
    }
  }
}

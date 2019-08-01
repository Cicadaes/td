#!/usr/bin/env bash
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh

cat $basedir/hiveinit.hive
declare hive="hive -S -i $basedir/hiveinit.hive"

calcObjectCode="RerunTask"
calcObjectName="补数工具,重新发送ftp数据到storm"

function usage() {
  echo "Usage: $0 [-date] [-step] [-prefixDay] [-schedulerTaskLogId]"
  echo "      -date calc date yyyy-MM-dd"
  echo "      -step CleanData,SendData,CallTask"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

projectIds="-1"

# get arguments
while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
  (--projectIds|-projectIds)
      projectIds="$2"
      shift 2
      ;;
   (--date|-date)
      date="$2"
      shift 2
      ;;
   (--step|-step)
      step="$2"
      shift 2
      ;;
   (--prefixDay|-prefixDay)
      prefixDay="$2"
      shift 2
      ;;
   (--schedulerTaskLogId|-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
    (*)
      usage
      exit 1
  esac
done
	
   tmpDate=${date//-/}
   timestampDate=`date -d ${tmpDate} +%s`
   dayUnix=86400
   prefixUnixTime=`expr $dayUnix \* $prefixDay`
   echo $prefixUnixTime
   timestampResultDate=`expr ${timestampDate} '-' ${prefixUnixTime}`
   runDate=`date -d @${timestampResultDate} +%Y-%m-%d`
   date=$runDate
   echo "实际处理时间：$date"

#判断本计算对象是否需要skip
calcObjectIsNeedSkip $schedulerTaskLogId $calcObjectCode

if [ $isCalcObjectSkip -eq 1 ]; then
  #生成计算对象，设置计算对象状态为skip
  skipExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi


#判断本计算对象是否需要stop
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectCode

if [ $isStop -eq 1 ]; then
  #生成计算对象，设置计算对象状态为stop
  stopExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#生成计算对象
generateCalcObjectLog $schedulerTaskLogId $calcObjectCode $calcObjectName

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec starting..."

echo "---date=${date} ---step=${step}---"

#建表用到的日期，除去中划线 "20171223"
tempRunDate=${date//-/}

################清理数据####################
if [ "$step" == "CleanData" ] ; then
   echo "开始清理数据"
   java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.rerun.DeleteDataTask --date "${date}" --projectIds "$projectIds"
   #备份文件夹
   dmpFolderName="dmp-${date:0:7}"
   discardFolderName="discard-${date:0:7}"
   echo "清理storm日志开始"
    for nodeName in ${STORM_HOST//,/ }
    do
       ssh hadoop@$nodeName "mkdir -p ${LOCAL_BASE_PATH}/${dmpFolderName}_bk ${LOCAL_BASE_PATH}/${discardFolderName}_bk"
       ssh hadoop@$nodeName "mv ${LOCAL_BASE_PATH}/${dmpFolderName}/dmp.${date}-* ${LOCAL_BASE_PATH}/${dmpFolderName}_bk/"
       ssh hadoop@$nodeName "mv ${LOCAL_BASE_PATH}/${discardFolderName}/discard.${date}-* ${LOCAL_BASE_PATH}/${discardFolderName}_bk/"
    done
   echo "清理storm日志结束"
   echo "结束清理数据"
fi
################重发adapter数据 要配置adapterUrl####################

if [ "$step" == "SendData" ] ; then
    echo "OfflineProjectMacDateTask(高活跃)开始"
	bash -x ${basedir}/offline/OfflineProjectMacDateTask.sh --date "$date" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "OfflineProjectMacDateTask(高活跃)失败"
    fi
	echo "OfflineProjectMacDateTask(高活跃)结束"
	
	echo "调用adapter补数开始"
	
	adapterResult=$(curl ${adapterUrl}/api/fixdata/local?startDate=$tempRunDate\&startHour=0\&endHour=24)
	echo $adapterResult     
	echo "$adapterResult" |grep -q "true"
	if [ $? -ne 0 ];then
          echo "adapter发数据失败"
          exit 1
    fi
	echo "调用adapter补数结束"
fi


################ETL离线任务####################
if [ "$step" == "CallTask" ] ; then
	
	echo "MetricFact(实时客流)开始"
	bash -x ${basedir}/MetricFactTask.sh --date "$date" --hour "23" --rerun "true" --limit "24" --parentProjectId "-1" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "MetricFact(实时客流)失败"
          exit 1
    fi
	echo "MetricFact(实时客流)结束"
	
	echo "MetricHourRealTimeTask(小时客流)开始"
	bash -x ${basedir}/MetricHourRealTimeTask.sh --date "$date" --hour "23" --rerun "true" --limit "24" --parentProjectId "-1" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "MetricHourRealTimeTask(小时客流)失败"
          exit 1
    fi
	echo "MetricHourRealTimeTask(小时客流)结束"
	
    echo "复制storm日志到hdfs上开始"
    logFolderName="dmp-${date:0:7}"
    logFileName="${LOCAL_BASE_PATH}${logFolderName}/dmp.${date}"
    sourceLogFile="${LOCAL_BASE_PATH}dmp."
	
    for nodeName in ${STORM_HOST//,/ }
    do
        fileName="dmp.${date}"
        ssh hadoop@$nodeName "/home/hadoop/wifianalytics-processor/bin/copyFileToHDFS.sh  --fileName $logFileName --runDate $date  --hdfsPath $HADOOP_BASE_DIR$nodeName/ --name $fileName  --sourceLogFile $sourceLogFile --nodeName $nodeName "
        if [ $? -ne 0 ];then
          echo "拷贝${nodeName}节点日志失败"
          exit 1
        fi
    done

    tempRunDate=${date//-/}
    hdfsFile="${HADOOP_BASE_DIR}*/$tempRunDate/*.dmp.${date}-*"
    tmpSensorLogTableName="tmp_sensor_log_${tempRunDate}"
    $hive -e "drop table $tmpSensorLogTableName; CREATE TABLE IF NOT EXISTS $tmpSensorLogTableName LIKE tmp_sensor_log_template;"
    $hive -e "load data inpath  '$hdfsFile' into table $tmpSensorLogTableName ;"

	hdfsFrontFile="${HADOOP_BASE_DIR}*/$tempRunDate/*.front.${date}-*"
    tmpSensorFrontLogTableName="tmp_sensor_front_log_${tempRunDate}"
	$hive -e "drop table $tmpSensorFrontLogTableName; CREATE TABLE IF NOT EXISTS $tmpSensorFrontLogTableName LIKE tmp_sensor_front_log_template;"
	$hive -e "load data inpath  '$hdfsFrontFile' into table $tmpSensorFrontLogTableName ;"


    echo "复制storm日志到hdfs上结束"
    #调用把日志导入到ES上
    echo "T+1任务开始： "
    echo "OfflineCopyLogToESJob任务开始"
   tmpDate=${date//-/}
   timestampDate=`date -d ${tmpDate} +%s`
   timestampResultDate=`expr ${timestampDate} '+' 86400`
   tomorrow=`date -d @${timestampResultDate} +%Y-%m-%d`
   echo $tomorrow
   
    bash -x ${basedir}/offline/OfflineCopyLogToESJob.sh --runDate "$tomorrow" --schedulerTaskLogId $schedulerTaskLogId
    if [ $? -ne 0 ];then
          echo "OfflineCopyLogToESJob 失败"
          exit 1
    fi
    echo "OfflineCopyLogToESJob结束"
	
	echo "跳出客流OfflineJumpTask开始"
	bash -x ${basedir}/offline/OfflineJumpTask.sh --date  "$tomorrow" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "跳出客流OfflineJumpTask失败"
          exit 1
    fi
	echo "跳出客流OfflineJumpTask结束"
	
	echo "MetricDayActiveTask(活跃天客流)开始"
	bash -x ${basedir}/offline/OfflineMetricDayActiveTask.sh --date "$tomorrow" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "MetricDayActiveTask(活跃天客流)失败"
          exit 1
    fi
	echo "MetricDayActiveTask(活跃天客流)结束"
	
	echo "OfflineComputeTimesAndDurationTask(停留时长)开始"
	bash -x ${basedir}/offline/OfflineComputeTimesAndDurationTask.sh --runDate "$tomorrow" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "OfflineComputeTimesAndDurationTask(停留时长)失败"
          exit 1
    fi
	echo "OfflineComputeTimesAndDurationTask(停留时长)结束"
	
	echo "VisitCycle.sh(到访周期)开始"
	bash -x ${basedir}/offline/OfflineVisitCycle.sh --runDate "$tomorrow" --schedulerTaskLogId $schedulerTaskLogId
	result=$?
	if [ $result -eq 1 ]; then
	  echo "VisitCycle.sh(到访周期)失败"
	  exit 1
	fi
	echo "VisitCycle.sh(到访周期)结束"
	
	echo "OfflineMetricDayTask开始"
	bash -x ${basedir}/offline/OfflineMetricDayTask.sh --date "$tomorrow" --schedulerTaskLogId $schedulerTaskLogId
	result=$?
	if [ $result -eq 1 ]; then
	  echo "OfflineMetricDayTask失败"
	  exit 1
	fi
	echo "OfflineMetricDayTask结束"
	
	
	echo "OfflineAggregationDataByDayTask(汇总)开始"
	bash -x ${basedir}/offline/OfflineAggregationDataByDayTask.sh  --runDate "$tomorrow"  --parentProjectId "-1" --type "day" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "OfflineAggregationDataByDayTask(汇总)失败"
          exit 1
    fi
	echo "OfflineAggregationDataByDayTask(汇总)结束"
	
	echo "周汇总MetricWeekTask开始"
	bash -x ${basedir}/MetricWeekTask.sh  --startDate "$tomorrow"  --endDate "$tomorrow" --type "week" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "周汇总MetricWeekTask失败"
          exit 1
    fi
	echo "周汇总MetricWeekTask结束"
	
	echo "月汇总MetricMonthTask开始"
	bash -x ${basedir}/MetricMonthTask.sh  --startDate "$tomorrow"  --endDate "$tomorrow" --type "month" --schedulerTaskLogId $schedulerTaskLogId
	if [ $? -ne 0 ];then
          echo "月汇总MetricMonthTask失败"
          exit 1
    fi
	echo "月汇总MetricMonthTask结束"

	 echo "T+1任务结束。 "
     echo "清理临时hive表开始"
     bash -x ${basedir}/cleanData/cleanTempHiveTable.sh --runDate "$date" --schedulerTaskLogId $schedulerTaskLogId  --calcObjectLogId   $calcObjectLogId --subCalcObjectCode "cleanTempHiveTable_$tempRunDate" --subCalcObjectName "cleanTempHiveTable_$tempRunDate"
     if [ $? -ne 0 ];then
          echo "cleanTempHiveTable 失败"
          finishCalcObjectLogWithExcetpion $calcObjectLogId ""
          echo "$calcObjectName($calcObjectCode) exit with exception!!!"
          exit 1
     fi
     echo "清理临时hive表结束"

   echo "结束调用Azkaban任务"
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
source $basedir/env.sh
source $basedir/func.sh

function usage() {
  echo "Usage: $0 [-runDate] [-hour] [-schedulerTaskLogId] [-calcObjectLogId] [-subCalcObjectCode] [-subCalcObjectName]"
  echo "      -runDate calc yyyy-mm-dd"
  echo "      -hour calc hour , hh format"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
  echo "      -calcObjectLogId calc object log id"
  echo "      -subCalcObjectCode sub calc object code"
  echo "      -subCalcObjectName sub calc object name"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
  (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
  (--hour|-hour)
      hour="$2"
      shift 2
      ;;
  (--calcObjectLogId|-calcObjectLogId)
      calcObjectLogId="$2"
      shift 2
      ;;
  (-schedulerTaskLogId|--schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
  (-subCalcObjectCode|--subCalcObjectCode)
      subCalcObjectCode="$2"
      shift 2
      ;;
  (-subCalcObjectName|--subCalcObjectName)
      subCalcObjectName="$2"
      shift 2
      ;;
  (*)
      usage
      exit 1
  esac
done

subCalcObjectIsNeedSkip $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isSubCalcObjectSkip -eq 1 ]; then
  skipExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isStop -eq 1 ]; then
  stopExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

generateSubCalcObjectLog $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec starting..."


tempRunDate=${runDate//-/}

if [ "00" == "$hour" ];then
   hour="24";
   timestamp_startdate=`date -d ${tempRunDate} +%s`
   timestamp_resultdate=`expr ${timestamp_startdate} '-' 86400`
   runDate=`date -d @${timestamp_resultdate} +%Y-%m-%d`
fi
hour=`expr $hour - 1`
if [ $hour -lt 10 ];then
    hour="0${hour}"  
fi 
logFolderName="dmp-${runDate:0:7}"
frontlogFolderName="front-${runDate:0:7}"
discardLogFolderName="discard-${runDate:0:7}"
failLogFolderName="fail-${runDate:0:7}"

#拷贝一个storm 上日志文件
#模糊匹配
logFileName="${LOCAL_BASE_PATH}${logFolderName}/dmp.${runDate}-${hour}"
frontlogFileName="${LOCAL_BASE_PATH}${frontlogFolderName}/front.${runDate}-${hour}"
discardLogFileName="${LOCAL_BASE_PATH}${discardLogFolderName}/discard.${runDate}-${hour}"
failLogFileName="${LOCAL_BASE_PATH}${failLogFolderName}/fail.${runDate}-${hour}"

#原始log文件，在没有归档的时候，需要拷贝原始log文件
sourceLogFile="${LOCAL_BASE_PATH}dmp."
frontSourceLogFile="${LOCAL_BASE_PATH}front."

for nodeName in ${STORM_HOST//,/ }
do
    fileName="dmp.${runDate}-${hour}"
    frontFileName="front.${runDate}-${hour}"
    discardFileName="discard.${runDate}-${hour}"
    failFileName="fail.${runDate}-${hour}"

    #save log to hadoop
    ssh hadoop@$nodeName "/home/hadoop/wifianalytics-processor/bin/copyFileToHDFS.sh  --fileName $logFileName --frontFileName $frontlogFileName --runDate $runDate  --hdfsPath $HADOOP_BASE_DIR$nodeName/ --name $fileName --frontName $frontFileName  --sourceLogFile $sourceLogFile --frontSourceLogFile $frontSourceLogFile --nodeName $nodeName "
    if [ $? -ne 0 ];then
       content="copy $nodeName ${logFileName} exception"
       exceptionInfo="copy $nodeName ${logFileName} exception"
       finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
       exit 1
    fi
    echo "---over copy $nodeName ${logFileName} over "
done

content="拷贝storm日志成功${runDate} ${hour}"
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0


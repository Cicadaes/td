#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
#汇总 metric hour real time 表
source $basedir/env.sh
source $basedir/func.sh

function usage() {
  echo "Usage: $0 [-runDate] [-hour] [-parentProjectId]"
  echo " -runDate  format yyyy-MM-dd"
  echo " -hour  the hour to query the data in the hour"
  echo " -parentProjectId  project id. default value is -1"
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
  (--parentProjectId|-parentProjectId)
      parentProjectId="$2"
      shift 2
      ;;
  (--hour|-hour)
      hour="$2"
      shift 2
      ;;
  (--reRun|-reRun)
      reRun="$2"
      shift 2
      ;;
  (--limit|-limit)
      limit="$2"
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

calcObjectCode="AggregationMetricHourRealTimeTask_${runDate}"
calcObjectName="汇总计算"

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

java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.group.AggregationMetricHourRealTimeTask --date ${runDate} --hour ${hour} --limit ${limit} --reRun ${reRun} --parentProjectId ${parentProjectId}
if [ $? -ne 0 ];then
  content="汇总失败"
  finishCalcObjectLogWithExcetpion $calcObjectLogId $content
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
#汇总 metric fact day
source $basedir/env.sh
source $basedir/func.sh

function usage() {
  echo "Usage: $0 [-runDate] [-runDate] [-parentProjectId]"
  echo " -runDate  format yyyy-MM-dd"
  echo " -type  min or day"
  echo " -parentProjectId  project id. default value is -1, find all projectIds that not parent project"
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
  (--type|-type)
      type="$2"
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

calcObjectCode="AggregationDataByDayTask_${runDate}"
calcObjectName="汇聚"

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

java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.group.AggregationDataByDayTask --date ${runDate} --type ${type} --parentProjectId ${parentProjectId}
if [ $? -ne 0 ];then
  content="汇总失败"
  finishCalcObjectLogWithExcetpion $calcObjectLogId $content
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

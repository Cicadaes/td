#!/usr/bin/env bash
#MetricHourRealTimeTask
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh

calcObjectCode="MetricHourRealTimeTask"
calcObjectName="实时小时客流"
function usage() {
  echo "Usage: $0 [-date] [-schedulerTaskLogId]"
  echo "      -date calc date yyyy-MM-dd"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
}

if [ $# -le 0 ]; then
  usage
  exit 1
fi


while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
   (--date|-date)
      date="$2"
      shift 2
      ;;
   (--hour|-hour)
      hour="$2"
      shift 2
      ;;
   (--parentProjectId|-parentProjectId)
      parentProjectId="$2"
      shift 2
      ;;
   (--rerun|-rerun)
      rerun="$2"
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


# 实时小时客流 MetricHourRealTimeTask
echo "<<etl exec>> MetricHourRealTimeTask exec starting..."

java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.lz.MetricHourRealTimeTask --date ${date} --hour ${hour} --limit ${limit} --reRun ${rerun}

result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> MetricHourRealTimeTask calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.group.AggregationMetricHourRealTimeTask --date ${date} --hour ${hour} --limit ${limit} --reRun ${rerun} --parentProjectId ${parentProjectId}
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> AggregationMetricHourRealTimeTask calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> MetricHourRealTimeTask exec finished."
exit 0

#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
#一方数据导入
source $basedir/../env.sh
source $basedir/../func.sh

function usage() {
  echo "Usage: $0 [-runDate] [-days]"
  echo " -runDate  format yyyy-MM-dd"
  echo " --days  integer type. default is 1 days"
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
  (--days|-days)
      days="$2"
      shift 2
      ;;
  (--basePath|-basePath)
      basePath="$2"
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


if [ !${days} ];then
    days=1
    echo "days is not exist. set default value"
fi

calcObjectCode="PartyDayTask_${runDate}"
calcObjectName="一方数据导入"

#判断本计算对象是否需要skip
calcObjectIsNeedSkip $schedulerTaskLogId $calcObjectCode

if [ $isCalcObjectSkip -eq 1 ]; then
  #生成计算对象，设置计算对象状态为skip
  skipExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#判断本计算对象是否需要stop
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectCode

if [ ${isStop} -eq 1 ]; then
  #生成计算对象，设置计算对象状态为stop
  stopExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#生成计算对象
generateCalcObjectLog $schedulerTaskLogId $calcObjectCode $calcObjectName

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec starting..."

getYesterday $runDate


java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.party.PartyDayTask --date ${runDate} --days ${days}
if [ $? -ne 0 ];then
  content="一方数据导入失败"
  finishCalcObjectLogWithExcetpion $calcObjectLogId $content
  exit 1
fi

runDate=$yesterday
echo "OfflinePartyDay RunDate ${runDate}"

#所有指标汇总更新
bash -x ${basedir}/../AggregationDataByDayTask.sh --runDate "${runDate}" --type "day" --parentProjectId "-1" --schedulerTaskLogId ${schedulerTaskLogId}
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> Exception: AggregationDataByDayTask calculate failed!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

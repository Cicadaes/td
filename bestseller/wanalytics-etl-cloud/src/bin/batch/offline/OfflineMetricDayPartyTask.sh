#!/usr/bin/env bash
#MetricDayPartyTask
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

calcObjectCode="MetricDayPartyTask.sh"
calcObjectName="一方数据指标"

function usage() {
  echo "Usage: $0 [-runDate] [-schedulerTaskLogId]"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
}
while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
   (--runDate|-runDate)
	  runDate="$2"
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

getYesterday $runDate

runDate=$yesterday

echo "OfflineMetricDayParty RunDate ${runDate}"

calcObjectIsNeedSkip $schedulerTaskLogId $calcObjectCode
if [ $isCalcObjectSkip -eq 1 ]; then
  skipExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectCode
if [ $isStop -eq 1 ]; then
  stopExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi
generateCalcObjectLog $schedulerTaskLogId $calcObjectCode $calcObjectName
#################################################################################################
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec starting..."

java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.lz.MetricDayPartyTask --runDate "${runDate}"
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

	
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0
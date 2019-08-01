#!/usr/bin/env bash
#ProjectIndexTask

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh
		
function usage() {
  echo "Usage: $0 [-date] [-hour]"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

# get arguments
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
    (--schedulerTaskLogId|-schedulerTaskLogId)
    schedulerTaskLogId="$2"
    shift 2
    ;;
    (*)
      usage
      exit 1
  esac
done

calcObjectCode="ProjectIndexTask"

calcObjectName="项目指标计算任务"

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

java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.ProjectIndexTask --date $date --hour $hour
if [ $? -ne 0 ]; then
  echo "<<etl exec>> Exception:$calcObjectName($calcObjectName) calculate failed!!!"
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectName) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0
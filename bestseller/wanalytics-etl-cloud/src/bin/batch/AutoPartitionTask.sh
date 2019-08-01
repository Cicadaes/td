#!/usr/bin/env bash
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh

calcObjectCode="AutoPartitionTask"
calcObjectName="动态添加分区"
function usage() {
  echo "Usage: $0 [-year] [-schedulerTaskLogId]"
  echo "      -year calc date yyyy"
  echo "      -interval int value"
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
  (--year|-year)
      year="$2"
      shift 2
      ;;
  (--interval|-interval)
      interval="$2"
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


# 实时天客流 AutoPartitionTask
echo "<<etl exec>> AutoPartitionTask exec starting..."

java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.db.AutoPartitionTask --year ${year}  --interval ${interval}

result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> AutoPartitionTask calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> AutoPartitionTask exec finished."
exit 0

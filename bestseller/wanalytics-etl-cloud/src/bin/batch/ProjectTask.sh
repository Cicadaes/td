#!/usr/bin/env bash
#ProjectTask
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh

calcObjectCode="ProjectTask"
calcObjectName="ProjectTask 描述 project 表及相关表的自动同步"
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
   (--schedulerTaskLogId|-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
   (--hour|-hour)
      hour="$2"
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


# 自动任务同步 ProjectTask
echo "<<etl exec>> ProjectTask exec starting..."

#HdfsDirProjectTask=hdfs://10.150.33.112:8020/BS_ETL/dw/wifi/dw_wifi_shop_yyyymmdd/

#java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.lz.ProjectTask --factDate $date --factHour $hour --HdfsDirProjectTask  $HdfsDirProjectTask
java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.lz.ProjectTask --HdfsDirProjectTask  ${HdfsDirProjectTask}

result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> ProjectTask calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> ProjectTask exec finished."
exit 0

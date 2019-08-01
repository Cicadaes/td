#!/bin/bash
#探针指标
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh
declare hive="hive -S -i $basedir/hiveinit.hive"
function usage() {
  echo "Usage: $0 [-date] [-schedulerTaskLogId] [-tenantId] [-projectId]"
  echo "      -date calc date yyyymmdd"
  echo "      -tenantId"
  echo "      -value the value of mod"
  echo "      -projectId if it is not empty and not null ,task only run this project"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
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
   (--tenantId|-tenantId)
      tenantId="$2"
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

calcObjectCode="SensorIndexTask_${tenantId}_${date}_${hour}_$$"
calcObjectName="探针指标"

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
tempRunDate=${date//-/}

#当tenantId传-1时，为不限制租户的全部探针
java -classpath .:${basedir}/../libs/* td.enterprise.wanalytics.etl.task.SensorIndexTask --date $date --tenantId $tenantId --hour $hour
result=$?
if [ $result -eq 2 ];then
  content="SensorIndexTask 失败"
  exceptionInfo="SensorIndexTask 失败"
#必须调用api记录子计算对象异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectName) exit with exception!!!"
exit 2
fi
if [ $result -ne 0 ];then
  content="SensorIndexTask 失败"
  exceptionInfo="SensorIndexTask 失败"
#必须调用api记录子计算对象异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectName) exit with exception!!!"
  exit 1
fi



finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0
#!/usr/bin/env bash
#WifiAnalyticsMasterTask
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh

calcObjectCode="CleanWifianalyticsDataMasterTask"
calcObjectName="清理临时文件夹，临时hive表和DB"
#TD_TENANT_JOB_HOUSING_COUNT,TD_TENANT_SURROUNDING_AREA_COUNT,TD_TENANT_REGION_COUNT
function usage() {
  echo "Usage: $0 [-date] [-maxDays] [-schedulerTaskLogId]"
  echo "      -date calc date yyyy-MM-dd"
  echo "      -maxDays one number"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

#默认值值
maxDays=3

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
   (--maxDays|-maxDays)
      maxDays="$2"
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

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec starting..."

#删除运行日期3天前的
tempRunDate=${date//-/}
timestamp_startdate=`date -d ${tempRunDate} +%s`
timestamp_resultdate=`expr ${timestamp_startdate} '-' ${maxDays} '*' 86400`
date=`date -d @${timestamp_resultdate} +%Y-%m-%d`

subCalcObjectCode="cleanTempHiveTable_$tempRunDate"
subCalcObjectName="清理临时hive表"
bash -x ${basedir}/cleanData/cleanTempHiveTable.sh  --runDate ${date}  --schedulerTaskLogId ${schedulerTaskLogId}  --calcObjectLogId $calcObjectLogId --subCalcObjectCode ${subCalcObjectCode} --subCalcObjectName ${subCalcObjectName}
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

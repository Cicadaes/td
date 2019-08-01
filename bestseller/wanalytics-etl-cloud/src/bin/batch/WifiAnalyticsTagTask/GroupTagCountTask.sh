#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: GroupTagCountTask.sh
# AUTHOR: weiguang.liu
# DATE: 2016.04.26
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 人群导出

#demo data
#bash -x GroupTagCountTask.sh --tenantId 2000152 --projectId 1 --projectIds 1 --runDate 2016-04-23 --cycle_statistics  30  --schedulerTaskLogId 568 --crowdType NU

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

#subCalcObjectCode="WifiAnalyticsMasterTask_300"
#subCalcObjectName="GroupTagCountTask"

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-runDate] [-projectId] [-tenantId] [-schedulerTaskLogId]"
  echo "      -runDate calc date yyyy-mm-dd"
  echo "      -projectId"
  echo "      -tenantId"
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
   (--tenantId|-tenantId)
      tenantId="$2"
      shift 2
      ;;
   (--date|-date)
      date="$2"
      shift 2
      ;;
   (--startDate|-startDate)
      startDate="$2"
      shift 2
      ;;
   (--endDate|-endDate)
      endDate="$2"
      shift 2
      ;;
   (--projectIds|-projectIds)
      projectIds="$2"
      shift 2
      ;;
   (--schedulerTaskLogId|-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
   (--calcObjectLogId|-calcObjectLogId)
         calcObjectLogId="$2"
         shift 2
         ;;
    (*)
      usage
      exit 1
  esac
done


subCalcObjectCode="WifiAnalyticsMasterTask_050_${tenantId}_${date}"
subCalcObjectName="GroupTagCountTask"

#判断本子计算对象是否需要skip
subCalcObjectIsNeedSkip $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isSubCalcObjectSkip -eq 1 ]; then
  #生成子计算对象，设置子计算对象状态为skip
  skipExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

#判断本子计算对象是否需要stop
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isStop -eq 1 ]; then
  #生成子计算对象，设置子计算对象状态为stop
  stopExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

generateSubCalcObjectLog $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec starting..."

echo "tenantId=$tenantId,projectIds=$projectIds,date=$date,schedulerTaskLogId=$schedulerTaskLogId"

echo '#################GroupTagCountTask start#################'

echo "java -classpath .:${basedir}/../../libs/* td.enterprise.wanalytics.etl.task.tag.GroupTagCountTask --date $date --tenantId $tenantId --projectIds $projectIds"
java -classpath .:${basedir}/../../libs/* td.enterprise.wanalytics.etl.task.tag.GroupTagCountTask --date $date --tenantId $tenantId --projectIds $projectIds --startDate $startDate --endDate $endDate
result=$?
if [ $result -eq 2 ];then
  content="GroupTagCountTask 失败"
  exceptionInfo="GroupTagCountTask 失败"
#必须调用api记录子计算对象异常信息
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
exit 2
fi
if [ $result -ne 0 ];then
  content="GroupTagCountTask 失败"
  exceptionInfo="GroupTagCountTask 失败"
#必须调用api记录子计算对象异常信息
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo '#################GroupTagCountTask end#################'

content="CustomGroupTask成功"
#必须调用此api,更新子计算对象状态为已完成
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

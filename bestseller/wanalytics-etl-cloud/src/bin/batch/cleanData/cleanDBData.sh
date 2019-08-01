#!/bin/bash
set -o nounset
#set -o errexit

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

function usage() {
  echo "Usage: $0 [-tenantId] [-projectId] [-crowdId] [-runDate] [-cycle_statistics] [-schedulerTaskLogId]"
  echo "      -runDate calc date yyyymmdd"
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
   (--projectId|-projectId)
      projectId="$2"
      shift 2
      ;;
   (--crowdId|-crowdId)
      crowdId="$2"
      shift 2
      ;;
   (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
   (--cycle_statistics|-cycle_statistics)
      cycle_statistics="$2"
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
   (--schedulerTaskLogId|-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
   (--calcObjectLogId|-calcObjectLogId)
      calcObjectLogId="$2"
      shift 2
      ;;
   (--subCalcObjectCode|-subCalcObjectCode)
         subCalcObjectCode="$2"
         shift 2
         ;;
   (--subCalcObjectName|-subCalcObjectName)
         subCalcObjectName="$2"
         shift 2
         ;;
    (*)
      usage
      exit 1
  esac
done

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

#TD_TENANT_JOB_HOUSING_COUNT,TD_TENANT_SURROUNDING_AREA_COUNT,TD_TENANT_REGION_COUNT,all
deleteTable='all'

#java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.CleanDBDataTask --tenantId $tenantId --projectId $projectId --crowdId $crowdId --runDate ${runDate} --untilDate ${runDate} --cycle_statistics $cycle_statistics --deleteTable $deleteTable --schedulerTaskLogId $schedulerTaskLogId

if [ $? -ne 0 ];then
  content="CleanDBDataTask 失败"
  exceptionInfo="CleanDBDataTask 失败"
#必须调用api记录子计算对象异常信息
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

content="清理数据成功！"
#必须调用此api,更新子计算对象状态为已完成
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0


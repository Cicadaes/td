#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: CorrelationCountTask.sh
# AUTHOR: nan.e
# DATE: 2016.12.16
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 关联度计算脚本
# Description :

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-runDate] [-start_date] [-end_date] [-competitorProjectId] [-competitorCrowdId] [-cycle_statistics] [-crowdId] [-projectId] [-tenantId] [-calcObjectLogId] [-subCalcObjectCode] [-subCalcObjectName]"
  echo "      -runDate calc date yyyy-mm-dd"
  echo "      参数不正确"
}

#if no args specified, show usage
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
   (--runDate|-runDate)
      runDate="$2"
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
   (--competitorProjectId|-competitorProjectId)
      competitorProjectId="$2"
      shift 2
      ;;
   (--competitorCrowdId|-competitorCrowdId)
      competitorCrowdId="$2"
      shift 2
      ;;
   (--cycleStatistics|-cycleStatistics)
      cycleStatistics="$2"
      shift 2
      ;;
   (--crowdId|-crowdId)
      crowdId="$2"
      shift 2
      ;;
   (--projectId|-projectId)
      projectId="$2"
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

echo "projectId=${projectId} crowdId=${crowdId} competitorCrowdId=${competitorCrowdId} competitorProjectId=${competitorProjectId}"
tmpOffsetPath=$tmpDataBaseDir/position_offset_$runDate

crowdTDFILE="$tmpOffsetPath/${projectId}_${crowdId}_${cycleStatistics}_mac"
competitorcrowdTDFILE="$tmpOffsetPath/${competitorProjectId}_${competitorCrowdId}_${cycleStatistics}_mac"
outputpath="$tmpOffsetPath/${crowdId}_${cycleStatistics}_${competitorCrowdId}_${cycleStatistics}.counter"

java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.position.CorrelationCountTask --inputmy "$crowdTDFILE" --inputcompetitor "$competitorcrowdTDFILE" --outputpath "$outputpath"
if [ $? -ne 0 ];then
  content="计算和竞品项目的关联度失败"
  exceptionInfo="计算和竞品项目的关联度失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi


java -classpath .:$basedir/../../libs/*  td.enterprise.wanalytics.etl.task.position.CorrelationCountSaveTask --inputpath "$outputpath" --tenantId "${tenantId}" --projectId "${projectId}" --crowdId "${crowdId}" --competitorProjectId "${competitorProjectId}" --competitorCrowdId "${competitorCrowdId}" --cycleStatistics "${cycleStatistics}" --runDate "${runDate}" --startDate "${startDate}" --endDate "${endDate}"
if [ $? -ne 0 ];then
  content="计算和竞品项目的关联度失败"
  exceptionInfo="计算和竞品项目的关联度失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

content="CorrelationCountTask over successfully"
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"
echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0



#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: deleteHiveTable.sh
# AUTHOR: junmin.li
# DATE: 2016.05.17
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: Delete hive table if exit.
# Description : 

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-runDate] [-schedulerTaskLogId] [-calcObjectLogId] [-subCalcObjectCode] [-subCalcObjectName]"
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
   (--runDate|-runDate)
      runDate="$2"
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

#转化为yyyyMMdd格式
tempRunDate=${runDate//-/}

outputFile=$tmpDataBaseDir/tmp_hive_${tempRunDate}

#查询处理临时hive 表，然后清理下
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.clean.GetTempHiveTableByDate --date $tempRunDate --dbName $hive_dbName --outputFile "$outputFile"
if [ $? -ne 0 ];then
  content="CleanDBDataTask 失败"
  exceptionInfo="CleanDBDataTask 失败"
#必须调用api记录子计算对象异常信息
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

$hive -f "$outputFile"

rm "$outputFile"

content="清理$tempRunDate 临时hive表 成功!"
#必须调用此api,更新子计算对象状态为已完成
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

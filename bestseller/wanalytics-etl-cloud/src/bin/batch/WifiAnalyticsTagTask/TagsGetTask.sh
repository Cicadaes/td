#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: TagsGetTask.sh
# AUTHOR: yan.xu
# DATE: 2016.12.07
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 获取tag，并导入

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-tenantId] [-inputFile] [-date] [-outputFile] [-schedulerTaskLogId]"
  echo "      -tenantId"
  echo "      -date"
  echo "      -inputFile"
  echo "      -outputFile"
  echo "      -runDate yyyy-mm-dd"
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
   (--inputFile|-inputFile)
  	  inputFile="$2"
 	  shift 2
 	  ;;
   (--outputFile|-outputFile)
  	  outputFile="$2"
 	  shift 2
 	  ;;
 	(--inputType|-inputType)
  	  inputType="$2"
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

#############【azkaban框架需要】##########################################################################################
subCalcObjectCode="WifiAnalyticsMasterTask_080_${tenantId}_${date}"
subCalcObjectName="TagsGetTask"

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

#######################################################################################################################

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec starting..."
echo "tenantId=$tenantId,runDate=$date,schedulerTaskLogId=$schedulerTaskLogId"

tempRunDate=${date//-/}

echo '#################TagsGetTask.sh start#############################################################################'
echo ''
tmpMacFile=${tmpDataBaseDir}/${tenantId}/${date}/tmp.mac
awk '{print $2}' $inputFile > $tmpMacFile

echo "inputFile:"$inputFile
cat $inputFile | head

echo "tmpMacFile:"$tmpMacFile
cat $tmpMacFile | head

java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.tag.TagsDataGetTask --tenantId $tenantId --date $date --inputType "$inputType" --inputFile $tmpMacFile --outputFile $outputFile
res=$?
if [ $res -eq 2 ]; then
  echo "文件下载失败，返回继续执行"
  exit 0
fi
if [ $res -eq 1 ];then
  content="TagsDataGetTask 失败"
  exceptionInfo="TagsDataGetTask 失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi
echo '#################TagsGetTask.sh end#############################################################################'

content="TagsDataGetTask"
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"
echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

#!/bin/bash
set -o nounset
#set -o errexit

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

tmpFileDir="$tmpDataBaseDir"

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

#转化为yyyyMMdd格式
tempRunDate=${runDate//-/}

#计算要删除的日期函数保留两个格式yyyyMMdd 和 yyyy-MM-dd
function getToDeleteDate() {
   timestamp_startdate=`date -d ${tempRunDate} +%s`
   folderDate=`date -d @${timestamp_startdate} +%Y-%m-%d`
   fileDate=`date -d @${timestamp_startdate} +%Y%m%d`
}

#待删除临时文件夹
function deleteFolder() {
   if [ -d "$tempFolder" ] || [ -f "$tempFolder" ];then
   rm -r "$tempFolder"
   result=$?
   if [ $result -eq 0 ]; then
      echo "delete temp folder  $tempFolder success"
   fi
   if [ $result -ne 0 ]; then
      echo "delete temp folder  $tempFolder fail"
   fi
   fi
}

#compute the value
getToDeleteDate

tempFolder="${tmpFileDir}/${tenantId}/${projectId}/${folderDate}"
#delete the folder
deleteFolder

while read line
do
    name=`echo "$line" | awk -F ',' '{print $1}'`
    dateType=`echo "$line" | awk -F ',' '{print $2}'`
    suffix=`echo "$line" | awk -F ',' '{print $3}'`
	
    if [ "$dateType" = "folderDate" ];then
      tempFolder="${tmpFileDir}/${name}${folderDate}${suffix}"
    fi
    if [ "$dateType" = "fileDate" ];then
      tempFolder="${tmpFileDir}/${name}${fileDate}${suffix}"
    fi
	echo "start delete ${tempFolder}..."
    #delete the folder
    deleteFolder
done < "${basedir}/clean_folder"

content="清理temp folder 成功！"
#必须调用此api,更新子计算对象状态为已完成
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

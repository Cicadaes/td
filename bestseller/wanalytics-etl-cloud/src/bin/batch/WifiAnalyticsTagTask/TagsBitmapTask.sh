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
  echo "Usage: $0 [-tenantId] [-projectId] [-runDate]  [-schedulerTaskLogId]"
  echo "      -tenantId"
  echo "      -date yyyy-mm-dd"
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
subCalcObjectName="TagsImportHiveTask"

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
echo "tenantId=$tenantId,runDate=$date,schedulerTaskLogId=$schedulerTaskLogId"

tempRunDate=${date//-/}
echo "runDate=$date,schedulerTaskLogId=$schedulerTaskLogId"

echo '#################MacExportTask start#################'


echo 'Step1 下载tags表到本地...'
allTagsTmp=${tmpDataBaseDir}/${tenantId}/${date}/all.tenent_tag.tmp
allTags=${tmpDataBaseDir}/${tenantId}/${date}/all.tenent_tag
$hive -e "insert overwrite local directory '$allTagsTmp'
            row format delimited fields terminated by '\t' LINES TERMINATED BY '\n'
            select * from tenant_tag_table;"

cat $allTagsTmp/* > $allTags
rm -rf $allTagsTmp
echo "Step1 解析tag文件至 $allTags"


echo 'Step2 导入到bitmap数据库中...'
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.tag.TagsBitmapTask --tenantId $tenantId --date $date --inputFile $allTags --schedulerTaskLogId ${schedulerTaskLogId}

echo 'Step2 导入到bitmap数据库完成'
echo '#################MacExportTask end#################'

if [ $? -ne 0 ];then
  content="MacMySql2HiveTask 失败"
  exceptionInfo="MacMySql2HiveTask 失败"
#必须调用api记录子计算对象异常信息
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

content="MacMySql2HiveTask"
#必须调用此api,更新子计算对象状态为已完成
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

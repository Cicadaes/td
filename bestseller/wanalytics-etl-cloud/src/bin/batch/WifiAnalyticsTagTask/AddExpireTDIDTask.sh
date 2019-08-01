#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: AddExpireTDIDTask.sh
# AUTHOR: weiguang.liu
# DATE: 2016.04.26
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 过期TDID导出

#demo data
#bash -x MacExportTask.sh --date 0000-00-00 --tenantId 2000247 --schedulerTaskLogId 568 --calcObjectLogId 300

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-runDate] [-schedulerTaskLogId]"
  echo "      -runDate calc date yyyy-mm-dd"
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
   (--tenantId|-tenantId)
      tenantId="$2"
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

subCalcObjectCode="WifiAnalyticsMasterTask_100_${date}_${tenantId}"
subCalcObjectName="MacMySql2HiveTask"


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

tempRunDate=${date//-/}
echo "runDate=$date,schedulerTaskLogId=$schedulerTaskLogId"

echo '#################AddExpireTDIDTask start#################'


echo '从hive表中导出过期tdid...'
hiveTdidTmp=${tmpDataBaseDir}/${tenantId}/${date}/hive.tmp.tdid
hiveTdid=${tmpDataBaseDir}/${tenantId}/${date}/hive.tdid

$hive -e "insert overwrite local directory '$hiveTdidTmp'
          row format delimited fields terminated by '\t' LINES TERMINATED BY '\n'
          select offset, mac, tdid from tenant_tag_table where update_date> unix_timestamp(date_sub('$date',180));"

cat $hiveTdidTmp/* > $hiveTdid
rm -rf hiveTdidTmp
echo "已经导入本地目录 $hiveTdid"
echo "从hive表中导出过期tdid完成"


echo 'Step2 合并tdid...'

cat $hiveTdid $inputFile > $outputFile
echo 'Step2 合并tdid完成'

rm -rf $hiveTdidTmp

echo '#################AddExpireTDIDTask end#################'

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


#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: MacExportTask.sh
# AUTHOR: weiguang.liu
# DATE: 2016.04.26
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 新增人群mac导出

#demo data
#bash -x MacExportTask.sh --date 0000-00-00 --tanentId 2000247 --schedulerTaskLogId 568 --calcObjectLogId 300

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
   (--startDate|-startDate)
      startDate="$2"
      shift 2
      ;;
   (--endDate|-endDate)
      endDate="$2"
      shift 2
      ;;
   (--tenantId|-tenantId)
      tenantId="$2"
      shift 2
      ;;
   (--projectIds|-projectIds)
      projectIds="$2"
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
echo '#################MacMySql2HiveTask start#################'

echo 'Step1 从mysql中获取需要标签的用户数据开始...'

mysqlMac=${tmpDataBaseDir}/${tenantId}/${date}/mysql.offset_mac
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.tag.MacMySql2HiveTask --tenantId ${tenantId} --date ${date} --startDate $startDate  --endDate $endDate --outputFile ${mysqlMac} --projectIds ${projectIds}
echo '从mysql中获取需要标签的用户数据完成！'


echo 'Step2 和HIVE中已有数据进行过滤，防止已有的数据...'
currentTime=`date +%s`
tmpOffsetMacFile=${tmpDataBaseDir}/${tenantId}/${date}/tmp.offset_mac
tmpMacFile=${tmpDataBaseDir}/${tenantId}/${date}/tmp.mac
$hive -e "Create Table new_mac_${currentTime} like new_mac_template;
          LOAD DATA local INPATH '$mysqlMac' INTO TABLE new_mac_${currentTime};
          insert overwrite local directory '$tmpOffsetMacFile'
            row format delimited fields terminated by '\t' LINES TERMINATED BY '\n'
                select a.offset, a.mac from new_mac_${currentTime} a left join tenant_tag_table b on (a.mac=b.mac) where isnull(b.mac);
          insert overwrite local directory '$tmpMacFile'
            row format delimited fields terminated by '\t' LINES TERMINATED BY '\n'
            select mac from new_mac_${currentTime};
          Drop Table new_mac_${currentTime};"

echo "tmpOffsetMacFile:"$tmpOffsetMacFile
echo "tmpMacFile:"$tmpMacFile
echo "create hive table new_mac_"$currentTime

cat $tmpOffsetMacFile/* > ${tmpDataBaseDir}/${tenantId}/${date}/new.offset_mac
rm -rf $tmpOffsetMacFile

echo "cat "$tmpOffsetMacFile" > new.offset_mac"

cat $tmpMacFile/* > $outputFile
rm -rf $tmpMacFile

echo "cat "$tmpMacFile" > "$outputFile


echo 'Step2 和HIVE中已有数据过滤完成！'

echo '#################MacMySql2HiveTask end#################'

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


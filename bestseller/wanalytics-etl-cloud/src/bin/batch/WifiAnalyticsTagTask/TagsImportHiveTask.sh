#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: TagsImportHiveTask.sh
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
   (--inputFile|-inputFile)
  	  inputFile="$2"
 	  shift 2
 	  ;;
   (--macOffsetFile|-macOffsetFile)
  	  macOffsetFile="$2"
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
echo '#################TagsImportHiveTask start#################'

echo 'Step2 解析tag文件...'
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.tag.TagsConvertorTask --date $date --tenantId $tenantId --inputFile $inputFile --offsetMacFile $macOffsetFile --outputFile $outputFile
echo "Step2 解析tag文件至 $outputFile!"

echo 'Step3 导入到hive中...'
currentTime=`date +%s`
$hive -e "Create Table tmp_tag_${currentTime} like tenant_tag_table;
          LOAD DATA local INPATH '$outputFile' INTO TABLE tmp_tag_${currentTime};
          insert into tenant_tag_table select * from tmp_tag_${currentTime};
          Drop Table tmp_tag_${currentTime};

          insert overwrite table tenant_tag_table
            select t.tenant_id, t.offset, t.mac, t.tdid, t.sex, t.age, t.profession,
            t.marriage, t.car, t.child, t.mobile_price, t.mobile_brand, t.app_shopping,
            t.app_education, t.app_reading, t.app_news, t.app_social, t.app_communication,
            t.app_video, t.app_travel, t.app_home, t.app_health, t.app_life, t.app_work,
            t.app_tool, t.app_finance, t.app_estates, t.app_mom, t.app_entertainment,
            t.app_car, t.app_beautify, t.update_date from
                (select tenant_id, offset, mac, tdid, sex, age, profession, marriage,
                car, child, mobile_price, mobile_brand, app_shopping, app_education,
                app_reading, app_news, app_social, app_communication, app_video,
                app_travel, app_home, app_health, app_life, app_work, app_tool,
                app_finance, app_estates, app_mom, app_entertainment, app_car,
                app_beautify, update_date, row_number() over (partition by mac order by unix_timestamp(update_date,'yyyy-MM-dd') asc) as num from tenant_tag_table) t where t.num=1;  "

echo 'Step3 导入到hive中完成'
echo '#################TagsImportHiveTask end#################'

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

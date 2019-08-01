#!/bin/bash
#生成全局画像
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh
declare hive="hive -S -i $basedir/hiveinit.hive"
function usage() {
  echo "Usage: $0 [-date] [-schedulerTaskLogId] [-tenantId] [-projectIds] [-startDate] [-endDate]"
  echo "      -date calc date yyyy-mm-dd"
  echo "      -tenantId"
  echo "      -value the value of mod"
  echo "      -projectIds if it is not empty and not null ,task only run this project"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
  echo "      -startDate start date yyyy-mm-dd"
  echo "      -endDate end date yyyy-mm-dd"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

projectIds="-1"
#开始日期
startDate="-1"
#结束日期
endDate="-1"
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
   (--projectIds|-projectIds)
      projectIds="$2"
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
    (*)
      usage
      exit 1
  esac
done

calcObjectCode="WifiAnalyticsTagTask_001_${tenantId}_${date}_$$"
calcObjectName="行业地产DMP 生成全局画像"

#判断本计算对象是否需要skip
calcObjectIsNeedSkip $schedulerTaskLogId $calcObjectCode

if [ $isCalcObjectSkip -eq 1 ]; then
  #生成计算对象，设置计算对象状态为skip
  skipExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi


#判断本计算对象是否需要stop
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectCode

if [ $isStop -eq 1 ]; then
  #生成计算对象，设置计算对象状态为stop
  stopExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#生成计算对象
generateCalcObjectLog $schedulerTaskLogId $calcObjectCode $calcObjectName
tempRunDate=${date//-/}

workDirectory=${tmpDataBaseDir}/${tenantId}/${date}

#创建临时目录
mkdir -p "$workDirectory"

newMacFile=${workDirectory}/new.mac
newMacOffsetFile=${workDirectory}/new.offset_mac
tdidFile=${workDirectory}/all.mac
tagsFile=${workDirectory}/all.tag
tagTableFile=${workDirectory}/new.tenant_tag_table

#创建tag表
$hive -e "Create Table IF NOT EXISTS tenant_tag_table like tenant_tag_table_template;"


#人群mac导出
subCalcObjectCode="WifiAnalyticsTagTask_100_${date}_${tenantId}_$$"
subCalcObjectName="MacExportTask"
bash -x ${basedir}/WifiAnalyticsTagTask/MacExportTask.sh --date ${date} --tenantId ${tenantId} --startDate $startDate --endDate $endDate --outputFile $newMacFile --projectIds ${projectIds} --calcObjectLogId ${calcObjectLogId} --schedulerTaskLogId $schedulerTaskLogId
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> Exception:$subCalcObjectName($subCalcObjectCode) calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
  exit 1
fi

if [ -s "$newMacFile" ]; then
    echo "${newMacFile}文件不为空"

    #获取Tag
    subCalcObjectCode="WifiAnalyticsTagTask_400_${date}_${tenantId}_$$"
    subCalcObjectName="TagsGetTask"
    bash -x ${basedir}/WifiAnalyticsTagTask/TagsGetTask.sh --tenantId ${tenantId} --date ${date} --inputFile $newMacOffsetFile --inputType "mac" --outputFile $tagsFile --schedulerTaskLogId ${schedulerTaskLogId} --calcObjectLogId $calcObjectLogId
    result=$?
    if [ $result -eq 1 ]; then
      echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
      #更新计算对象日志状态为异常，后端会自动获取异常信息
      finishCalcObjectLogWithExcetpion $calcObjectLogId ""
      echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
      exit 1
    fi

    # 导入基础表
    subCalcObjectCode="WifiAnalyticsTagTask_500_${date}_${tenantId}_$$"
    subCalcObjectName="TagsTenantTask"
    bash -x ${basedir}/WifiAnalyticsTagTask/TagsImportHiveTask.sh --tenantId ${tenantId} --date ${date} --inputFile $tagsFile --macOffsetFile $newMacOffsetFile --outputFile $tagTableFile --schedulerTaskLogId ${schedulerTaskLogId}  --calcObjectLogId $calcObjectLogId
    result=$?
    if [ $result -eq 1 ]; then
      echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
      #更新计算对象日志状态为异常，后端会自动获取异常信息
      finishCalcObjectLogWithExcetpion $calcObjectLogId ""
      echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
      exit 1
    fi

    # 生成bitmap
    subCalcObjectCode="WifiAnalyticsTagTask_500_${date}_${tenantId}_$$"
    subCalcObjectName="TagsBitmapTask"
    bash -x ${basedir}/WifiAnalyticsTagTask/TagsBitmapTask.sh --tenantId ${tenantId} --date ${date} --schedulerTaskLogId ${schedulerTaskLogId}  --calcObjectLogId $calcObjectLogId
    result=$?
    if [ $result -eq 1 ]; then
      echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
      #更新计算对象日志状态为异常，后端会自动获取异常信息
      finishCalcObjectLogWithExcetpion $calcObjectLogId ""
      echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
      exit 1
    fi
fi

# 根据人群计算count
subCalcObjectCode="WifiAnalyticsTagTask_500_${date}_${tenantId}_$$"
subCalcObjectName="GroupTagCountTask"
bash -x ${basedir}/WifiAnalyticsTagTask/GroupTagCountTask.sh --tenantId ${tenantId} --date ${date} --startDate $startDate --endDate $endDate --projectIds ${projectIds} --schedulerTaskLogId ${schedulerTaskLogId}  --calcObjectLogId $calcObjectLogId
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
  exit 1
fi

#java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.group.GroupResultSumTask --runDate $date --type "portrayal"

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

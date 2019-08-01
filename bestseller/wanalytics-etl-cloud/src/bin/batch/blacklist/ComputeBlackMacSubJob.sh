#!/bin/bash
set -o nounset

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-totalDays] [-occureTimes] [-projectIds] [-endDate] [-calcObjectLogId] [-schedulerTaskLogId] [-subCalcObjectCode] [-subCalcObjectName]"
  echo "   -totalDays 连续天数"
  echo "   -occureTimes 出现次数"
  echo "   -projectIds 项目ids"
  echo "   -endDate 结束日期"
  echo "   -calcObjectLogId"
  echo "   -schedulerTaskLogId azkaban schedule task log id"
}

while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
	(--totalDays|-totalDays)
	  totalDays="$2"
	  shift 2
	  ;;
	(--occureTimes|-occureTimes)
	  occureTimes="$2"
	  shift 2
	  ;;
	(--projectIds|-projectIds)
	  projectIds="$2"
	  shift 2
	  ;;
	(--endDate|-endDate)
	  endDate="$2"
	  shift 2
	  ;;
   (--calcObjectLogId|-calcObjectLogId)
      calcObjectLogId="$2"
      shift 2
      ;;
  (-schedulerTaskLogId|--schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
  (-subCalcObjectCode|--subCalcObjectCode)
      subCalcObjectCode="$2"
      shift 2
      ;;
  (-subCalcObjectName|--subCalcObjectName)
      subCalcObjectName="$2"
      shift 2
      ;;
    (*)
      usage
      exit 1
  esac
done

subCalcObjectIsNeedSkip $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isSubCalcObjectSkip -eq 1 ]; then
  skipExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isStop -eq 1 ]; then
  stopExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

generateSubCalcObjectLog $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec starting..."

#导出项目文件
tmpEndDate=${endDate//-/}
outputFile="${basedir}/projectsOffsetList_${tmpEndDate}_${totalDays}_${occureTimes}"
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.blacklist.CreateProjectsOffsetTask --outputFile "$outputFile"  --projectIds $projectIds --endDate $endDate --totalDays $totalDays
result=$?
if [ $result -eq 1 ]; then
  content=" ${subCalcObjectCode} exception"
  exceptionInfo=" ${subCalcObjectName} exception"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

#临时表名称
tempName="temp_project_offset_${tmpEndDate}_${totalDays}_${occureTimes}"
#删除临时表，如果存在
$hive -e "DROP TABLE IF EXISTS $tempName"
#根据模板，创建表
$hive -e "CREATE TABLE $tempName like temp_project_offset_template"
if [ $? -ne 0 ]; then
  content=" ${subCalcObjectCode} exception"
  exceptionInfo=" ${subCalcObjectName} exception"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo "开始导入 load data local inpath '$outputFile' into table $tempName"
$hive -e "load data local inpath '$outputFile' into table $tempName"
if [ $? -ne 0 ]; then
  content="导入到 $tempName失败"
  exceptionInfo="导入到 $tempName失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi
echo "导入到 $tempName成功 ."

#删除临时文件
rm "$outputFile"

sql="select  tenant_id, project_id, offset ,count(1) as c from $tempName  group by tenant_id, project_id, offset having c >= ${occureTimes}"
outputFolder="/home/hadoop/wanalytics/datafile/tmp/sensorLogCompute/tempprojectoffset_${totalDays}_${occureTimes}_${tmpEndDate}"
exportDataSql="insert overwrite local directory '${outputFolder}' row format delimited fields terminated by ',' $sql"
echo "开始执行 $exportDataSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ]; then
  content="导出到${outputFolder}失败"
  exceptionInfo="导出到${outputFolder}失败"
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

#合并文件
cat $outputFolder/* > $outputFolder/data

echo "---------开始导入黑名单---------"

java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.filterblackmac.ImportBlackOffsetListTask --inputFile "$outputFolder/data" --totalDays $totalDays --days $occureTimes
if [ $? -ne 0 ]; then
  echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

echo "---------导入黑名单结束---------"

rm -rf "/home/hadoop/wanalytics/datafile/tmp/sensorLogCompute/tempprojectoffset_${totalDays}_${occureTimes}_${tmpEndDate}"
$hive -e "DROP TABLE IF EXISTS $tempName"

content="过滤黑名单成功"
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

exit 0

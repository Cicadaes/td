#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: PositionGetTask.sh
# AUTHOR: junmin.li
# DATE: 2017.04-24
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 计算城市位置坐标点任务，项目位置信息通过和城市位置信息 关联查询后获取

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-cityName] [-cityHashCode]  [-runDate]  [-schedulerTaskLogId] [-calcObjectLogId] [-tdidFile] "
  echo "      -cityName city name "
  echo "      -cityHashCode hash code of city name"
  echo "      -runDate yyyy-mm-dd"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
  echo "      -calcObjectLogId number value that function.sh created "
  echo "      -tdidFile city user tdid file"
}

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
   (--cityName|-cityName)
      cityName="$2"
      shift 2
      ;;
   (--cityHashCode|-cityHashCode)
      cityHashCode="$2"
      shift 2
      ;;
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
   (--tdidFile|-tdidFile)
         tdidFile="$2"
         shift 2
         ;;
    (*)
      usage
      exit 1
  esac
done

subCalcObjectCode="PositionGetTask_${cityHashCode}_${runDate}"
subCalcObjectName="PositionGetTask"

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

tempRunDate=${runDate//-/}

#判断城市tdid文件是否为空，如果为空忽略执行

tmpOffsetPath=$tmpDataBaseDir/position_offset_$runDate

positionNotGZFile="$tmpOffsetPath/${cityHashCode}.position"

java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.position.PositionDataGetTask --runDate ${runDate} --inputFile $tdidFile --outputFile  $positionNotGZFile
  if [ $? -ne 0 ];then
    content="下载位置信息失败"
    exceptionInfo="下载位置信息失败"
    finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
    exit 1
  fi

 tempPostionTableName="tmp_position_line_${cityHashCode}_${tempRunDate}"
 $hive -e "DROP TABLE IF EXISTS $tempPostionTableName; CREATE TABLE $tempPostionTableName LIKE tmp_tag_template;"
 if [ $? -ne 0 ];then
    content="create table  $tempPostionTableName fail!"
    exceptionInfo="create table  $tempPostionTableName fail!"
    finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
 fi

echo "create table  $tempPostionTableName success!"
echo "===========load data into $tempPostionTableName ============="
$hive -e "load data local inpath  '$positionNotGZFile' into table $tempPostionTableName;"
if [ $? -ne 0 ];then
  content="load data table fail $tempPostionTableName, drop temp table"
  exceptionInfo="load data table fail, drop temp table"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  $hive -e "DROP TABLE IF EXISTS $tempPostionTableName;"
  exit 1
fi

tempAppTabName="tmp_position_${cityHashCode}_${tempRunDate}"
echo '#################step3: 计算地址位置信息，导入到hive临时表开始...#################'
#删除临时表，如果存在
$hive -e "DROP TABLE IF EXISTS $tempAppTabName"
#根据模板，创建表
$hive -e "CREATE TABLE $tempAppTabName LIKE tmp_project_position_template"
if [ $? -ne 0 ];then
  content="创建  $tempAppTabName 失败"
  exceptionInfo="创建  $tempAppTabName 失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

$hive -e "add jar $udtfJar;
    create temporary function position_convertor as 'td.enterprise.hive.udfs.PositionsConvertorUDTF';
      set mapreduce.job.maps=10;
      set mapred.map.tasks=10;
      set hive.merge.mapfiles=false;
      set hive.input.format=org.apache.hadoop.hive.ql.io.HiveInputFormat;
      insert into $tempAppTabName
        select position_convertor(line,'$cityName') as (tdid ,  mac ,   longtitude ,  latitude ,   day_type ,   hour ,   hour_type ,   metric_value ,   region_name ,   region_type ,   bd09_longtitude ,   bd09_latitude ,  business_name ) from $tempPostionTableName ;"

echo '#################step2: 解析mac地址地理位置信息结束 ...#################'
echo "导入到 $tempAppTabName成功"

content="PositionGetTask over successfully"

finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

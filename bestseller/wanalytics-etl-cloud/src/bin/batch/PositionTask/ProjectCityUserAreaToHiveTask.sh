#!/bin/bash bash
set -o nounset

# 城市范围内的数据，根据用户mac计算用户夜间所在区域地址的前top3，并将记录录入hive表

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-cityName] [-cityHashCode]  [-runDate]  [-schedulerTaskLogId] [-calcObjectLogId] [-macFile] [-outputFile] [-inputType]"
  echo "      -cityName city name"
  echo "      -cityHashCode hash code of city name"
  echo "      -runDate yyyy-mm-dd"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
  echo "      -calcObjectLogId number value that function.sh created"
  echo "      -macFile city user mac file"
  echo "      -outputFile output file"
  echo "      -inputFileType input file type. city or crowd"
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
   (--macFile|-macFile)
     macFile="$2"
     shift 2
     ;;
   (--outputFile|-outputFile)
     outputFile="$2"
     shift 2
     ;;
   (*)
      usage
      exit 1
  esac
done

subCalcObjectCode="ProjectCityUserAreaToHiveTask_${cityName}_${runDate}"
subCalcObjectName="ProjectCityUserAreaToHiveTask"

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

tmpOffsetPath="$tmpDataBaseDir/position_offset_${runDate}"

echo "tmpOffsetPath: "${tmpOffsetPath}

echo "runDate=${runDate} inputFile=${macFile} outputFile=${outputFile}"
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.position.ProjectUserMacToHiveTask  --inputFile ${macFile} --outputFile  ${outputFile}
  if [ $? -ne 0 ];then
    content="存储用户夜间活跃地域失败"
    exceptionInfo="存储用户夜间活跃地域失败"
    finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
    exit 1
  fi

tempAppTabName="tmp_city_user_top_area_${cityHashCode}_${tempRunDate}"

echo '...城市范围内用户夜间活跃地域数据开始导入到hive临时表开始...'
#删除临时表，如果存在
$hive -e "DROP TABLE IF EXISTS $tempAppTabName"
#根据hive模板，创建表
$hive -e "CREATE TABLE $tempAppTabName LIKE tmp_user_top_template"
if [ $? -ne 0 ];then
  content="创建  $tempAppTabName 失败"
  exceptionInfo="创建  $tempAppTabName 失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

$hive -e "load data local inpath  '${outputFile}' into table $tempAppTabName"
if [ $? -ne 0 ];then
  content="load data table fail $tempAppTabName, drop temp table"
  exceptionInfo="load data table fail, drop temp table"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
#  $hive -e "DROP TABLE IF EXISTS $tempAppTabName;"
  exit 1
fi

echo 'cityName=$cityName 处理完毕！'

content="ProjectCityUserAreaToHiveTask over successfully"

finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

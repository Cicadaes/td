#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: 把对应offset文件 找出来对应tdid文件
# AUTHOR: junmin.li
# DATE: 2017.04.24
# REV: 1.0  客群辐射计算
# PLATFORM: Linux
# PURPOSE: 

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh


cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-date] [-schedulerTaskLogId]"
  echo "      -date calc date yyyymmdd"
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
   (--offsetFile|-offsetFile)
      offsetFile="$2"
      shift 2
      ;;
   (--tdidFile|-tdidFile)
      tdidFile="$2"
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
   (*)
      usage
      exit 1
  esac
done

subCalcObjectCode="GetTDIDFromOffset_${runDate}"
subCalcObjectName="GetTDIDFromOffset"

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

#建表用到的日期，除去中划线
tempRunDate=${runDate//-/}

#临时ID
tmpId=$$

#tdid输出文件
baseDir="$tmpDataBaseDir/${runDate}/tdid/$tmpId"

#load 进行hive表中
tmpOffsetTable="tmp_offset_${tempRunDate}_$tmpId"
$hive -e "DROP TABLE  $tmpOffsetTable;"
$hive -e "CREATE TABLE $tmpOffsetTable LIKE tmp_tdid_template;"
if [ $? -ne 0 ];then
    content="创建offset临时表失败"
    exceptionInfo="创建offset临时表失败"
    finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
    exit 1
fi

$hive -e "load data local inpath  '$offsetFile' into table $tmpOffsetTable ;"
if [ $? -ne 0 ];then
    content="导入offset临时表失败"
    exceptionInfo="导入offset临时表失败"
    finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
    exit 1
fi

echo "开始导出tdid"


sql="select  t1.tdid from  $tmpOffsetTable t0 inner join tenant_tag_table t1 on t0.tdid=t1.offset"
exportDataSql="insert overwrite local directory '$baseDir' row format delimited fields terminated by '\t' $sql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出tdid失败"
  exceptionInfo="导出tdid失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo "导出tdid成功."

cat $baseDir/00* > $baseDir/tdid

#复制到目标文件
cp $baseDir/tdid $tdidFile

#删除临时文件
rm -r "$baseDir"

content="获取offset 对应tdid 结束"
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"
echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

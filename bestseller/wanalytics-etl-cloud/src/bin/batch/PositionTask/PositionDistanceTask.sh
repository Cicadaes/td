#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: PositionDistanceTask.sh
# AUTHOR: junmin.li
# DATE: 2016.12.20
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
   (--macFile|-macFile)
         macFile="$2"
         shift 2
         ;;
   (--cityHashCode|-cityHashCode)
         cityHashCode="$2"
         shift 2
         ;;
   (--crowdType|-crowdType)
         crowdType="$2"
         shift 2
         ;;
   (--crowdName|-crowdName)
         crowdName="$2"
         shift 2
         ;;
   (--crowdNum|-crowdNum)
         crowdNum="$2"
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

#建表用到的日期，除去中划线
tempRunDate=${runDate//-/}
echo "parameter values : tenantId=$tenantId ,projectId=$projectId crowdId=$crowdId runDate=${runDate} cycle_statistics=$cycle_statistics tempRunDate=$tempRunDate schedulerTaskLogId=$schedulerTaskLogId startDate=$startDate endDate=$endDate "
echo '#################PositionDistanceTask start#################'

#使用城市过滤结果表
cityPositionTab="tmp_position_${cityHashCode}_${tempRunDate}"

baseDir="$tmpDataBaseDir/${tenantId}/${projectId}/${runDate}/${cycle_statistics}"

tmpCrowdTable="tmp_crowd_${tenantId}_${projectId}_${tempRunDate}_${crowdId}"
$hive -e "DROP TABLE IF EXISTS $tmpCrowdTable; CREATE TABLE $tmpCrowdTable LIKE tmp_tdid_template;"
if [ $? -ne 0 ];then
    content="create table  $tmpCrowdTable fail!"
    exceptionInfo="create table  $tmpCrowdTable fail!"
    finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
    exit 1
fi

$hive -e "load data local inpath  '$macFile' into table $tmpCrowdTable ;"

tempAppTabName="tmp_position_${tenantId}_${projectId}_${crowdId}_${tempRunDate}_${cycle_statistics}"
echo '#################step3: 计算地址位置信息，导入到hive临时表开始...#################'
$hive -e "DROP TABLE IF EXISTS $tempAppTabName"
$hive -e "CREATE TABLE $tempAppTabName LIKE tmp_project_position_template"
if [ $? -ne 0 ];then
  content="创建  $tempAppTabName 失败"
  exceptionInfo="创建  $tempAppTabName 失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

$hive -e "insert into $tempAppTabName select  t1.* from  $tmpCrowdTable t0 inner join $cityPositionTab t1 on t0.tdid=t1.mac;"
if [ $? -ne 0 ];then
  content="导入到地理位置表数据失败"
  exceptionInfo="导入到地理位置表数据失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo "----------------------step8 开始计算项目覆盖度---------------------------"
#查询出来所有合理的坐标点和小时类型
positionSql="select distinct longtitude , latitude, hour_type from $tempAppTabName t where length (t.region_name ) > 0 and hour_type in(2,3) "
exportDataSql="insert overwrite local directory '$baseDir/position/distance/${crowdId}' row format delimited fields terminated by '\t' $positionSql"
echo "开始执行 $exportDataSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出到$baseDir/position/distance/${crowdId}失败"
  exceptionInfo="导出到$baseDir/position/distance/${crowdId}失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
  fi

#调用java代码，计算项目中心距离
cat $baseDir/position/distance/${crowdId}/00* > $baseDir/position/distance/${crowdId}/position
outputDistance=$baseDir/position/distance/${crowdId}/distance
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.position.ProjectDistanceTask --inputFile  $baseDir/position/distance/${crowdId}/position --outputFile $outputDistance --projectId $projectId
if [ $? -ne 0 ];then
  content="计算距离失败"
  exceptionInfo="计算距离失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi


#导入hive表中，计算距离范围覆盖度，统计结果
tmpDistanceTable="tmp_distance_${tenantId}_${projectId}_${crowdId}_${tempRunDate}_${cycle_statistics}"
$hive -e "DROP TABLE IF EXISTS $tmpDistanceTable;CREATE TABLE $tmpDistanceTable LIKE tmp_project_distance_template;"
$hive -e "load data local inpath  '$outputDistance' into table $tmpDistanceTable ;"

distanceReportSql="select $tenantId,$projectId,$crowdId,'${runDate}','${startDate}','${endDate}', $cycle_statistics,hour_type, sum(case when distance between 0 and 999 then 1 else 0 end ) ,  sum( case when distance between 1000 and 2999 then 1 else 0 end ),  sum( case when distance between 3000 and 5000  then 1 else 0 end ) ,  sum( case when distance >= 5001 then 1 else 0 end ),'$crowdType','$crowdName','$crowdNum'  from ${tmpDistanceTable}   group by hour_type  ;"
exportDataSql="insert overwrite local directory '$baseDir/position/distance_result/${crowdId}' row format delimited fields terminated by ',' $distanceReportSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出到$baseDir/position/distance_result/${crowdId}失败"
  exceptionInfo="导出到$baseDir/position/distance_result/${crowdId}失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

#合并文件结果
cat $baseDir/position/distance_result/${crowdId}/* > $baseDir/position/distance_result/${crowdId}/result
outputFile=$baseDir/position/distance_result/${crowdId}/distance_result
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.position.ProjectDistanceFormatTask --inputFile  $baseDir/position/distance_result/${crowdId}/result --outputFile $outputFile
if [ $? -ne 0 ];then
  content="生成距离文件失败"
  exceptionInfo="生成距离文件失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo "清理数据开始"
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.CleanMysqlDataTask --code TD_TENANT_HOUSING_COVERAGE_COUNT --condition  "$runDate|${projectId}|${crowdId}"
echo "清理数据结束"

java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.MysqlLoaderTask --inputFilePath  $baseDir/position/distance_result/${crowdId}/distance_result
if [ $? -ne 0 ];then
  content="导入到覆盖度表中失败"
  exceptionInfo="导入到覆盖度表中失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi
	
#导入到统计结果表中
echo "----------------------step8 结束计算项目覆盖度---------------------------"
#添加删除
$hive -e "DROP TABLE IF EXISTS $tempAppTabName;DROP TABLE IF EXISTS $tmpCrowdTable;"

#删除临时文件
rm -r "$baseDir/position/distance/${crowdId}"
rm -r "$baseDir/position/distance_result//${crowdId}"

echo '#################客群辐射计算完毕#################'
content="PositionDistanceTask"
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"
echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

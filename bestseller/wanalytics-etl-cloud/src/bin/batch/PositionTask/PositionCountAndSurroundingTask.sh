 #!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: PositionCountAndSurroundingTask.sh
# AUTHOR: junmin.li
# DATE: 2016.05.03
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 人群地理位置，（职住往来，区域来源）

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
   (--cityHashCode|-cityHashCode)
         cityHashCode="$2"
         shift 2
         ;;
   (--macFile|-macFile)
         macFile="$2"
         shift 2
         ;;
   (--cityName|-cityName)
         cityName="$2"
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
echo "parameter values : tenantId=$tenantId ,projectId=$projectId crowdId=$crowdId runDate=${runDate} cycle_statistics=$cycle_statistics tempRunDate=$tempRunDate schedulerTaskLogId=$schedulerTaskLogId startDate=$startDate endDate=$endDate cityHashCode=$cityHashCode"
echo '#################PositionCountAndSurroundingTask start#################'

baseDir="$tmpDataBaseDir/${tenantId}/${projectId}/${runDate}/${cycle_statistics}"

#load 进行hive表中
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

projectPosititonTab="tmp_position_${cityHashCode}_${tempRunDate}"
$hive -e "insert into $tempAppTabName select  t1.* from  $tmpCrowdTable t0 inner join $projectPosititonTab t1 on t0.tdid=t1.mac;"
if [ $? -ne 0 ];then
  content="导入到地理位置表数据失败"
  exceptionInfo="导入到地理位置表数据失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi
#-----------------通过关联查询出来 开始结束-------------------------

#生成区域来源数据
echo '#################step4 生成区域来源(行政区域)数据开始...#################'
regionSql="select  'TD_TENANT_REGION_COUNT|${tenantId}', ${projectId},  $crowdId , 1, t.region_name , '${runDate}','0', t.hour,  sum(t.metric_value) metri_value ,${cycle_statistics}, '${startDate}','${endDate}' from $tempAppTabName t where length (t.region_name ) > 0 group by  t.region_name ,t.hour"
exportDataSql="insert overwrite local directory '$baseDir/position/region/${crowdId}' row format delimited fields terminated by '\t' $regionSql"
echo "开始执行 $exportDataSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出到$baseDir/position/region/${crowdId}失败"
  exceptionInfo="导出到$baseDir/position/region/${crowdId}失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo "导出到$baseDir/position/region/${crowdId}成功."

echo "清理数据开始"
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.CleanMysqlDataTask --code TD_TENANT_REGION_COUNT --condition  "${runDate}|${projectId}|${crowdId}"
echo "清理数据结束"

echo "step4 导入到区域来源开始"
cat $baseDir/position/region/${crowdId}/00* > $baseDir/position/region/${crowdId}/region
if [ ! -s "$baseDir/position/region/${crowdId}/region" ]; then
    echo "$baseDir/position/region/${crowdId}/region文件为空,忽略往下执行!"
    exit 0 ;
fi
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.MysqlLoaderTask --inputFilePath  $baseDir/position/region/${crowdId}/region
if [ $? -ne 0 ];then
  content="导入到区域来源开始失败"
  exceptionInfo="导入到区域来源开始失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo 'step4: 导入到区域来源结束..'
echo '#################step4 生成区域来源(行政区域)数据结束...#################'

echo '#################step4 生成区域来源(商圈区域)数据开始...#################'
regionSql="select  'TD_TENANT_REGION_COUNT|${tenantId}', ${projectId},  $crowdId , 2, t.business_name , '${runDate}','0', t.hour,  sum(t.metric_value) metri_value ,${cycle_statistics}, '${startDate}','${endDate}' from $tempAppTabName t where length (t.business_name ) > 0 group by t.business_name ,t.hour"
exportDataSql="insert overwrite local directory '$baseDir/position/region_bussiness/${crowdId}' row format delimited fields terminated by '\t' $regionSql"
echo "开始执行 $exportDataSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出到$baseDir/position/region_bussiness/${crowdId}失败"
  exceptionInfo="导出到$baseDir/position/region_bussiness/${crowdId}失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo "导出到$baseDir/position/region_bussiness/${crowdId}成功."

echo "step4 导入到区域来源开始"
cat $baseDir/position/region_bussiness/${crowdId}/* > $baseDir/position/region_bussiness/${crowdId}/region
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.MysqlLoaderTask --inputFilePath  $baseDir/position/region_bussiness/${crowdId}/region
if [ $? -ne 0 ];then
  content="导入到区域来源开始失败"
  exceptionInfo="导入到区域来源开始失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo 'step4: 导入到区域来源结束..'
echo '#################step4 生成区域来源(商圈区域)数据结束...#################'

echo '#################step5 生成职住来源开始...#################'
jobHousingSql="select  'TD_TENANT_JOB_HOUSING_COUNT|${tenantId}', ${projectId},  $crowdId , bd09_longtitude, bd09_latitude, '${runDate}','0', hour,hour_type,sum(metric_value ) metric_value, ${cycle_statistics}, '${startDate}','${endDate}' from $tempAppTabName  where length(bd09_longtitude) > 0 and length(region_name) > 0  group by  hour, hour_type, bd09_longtitude,bd09_latitude limit 20000 "
exportDataSql="insert overwrite local directory '$baseDir/position/job_housing/${crowdId}' row format delimited fields terminated by '\t' $jobHousingSql"
echo "开始执行 $exportDataSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出到$baseDir/position/job_housing/${crowdId}失败"
  exceptionInfo="导出到$baseDir/position/job_housing/${crowdId}失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo "导出到$baseDir/position/job_housing/${crowdId}成功."

tableName=" wifianalytics.TD_TENANT_JOB_HOUSING_COUNT "
whereClause=" tenant_id=${tenantId} and project_id=${projectId} and crowd_id=${crowdId} and run_date=${runDate} and cycle_statistics=${cycle_statistics} and start_date=${startDate} and end_date=${endDate} "

echo "清理数据开始"
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.CleanMysqlDataTask --code TD_TENANT_JOB_HOUSING_COUNT --condition  "${runDate}|${projectId}|${crowdId}"
echo "清理数据结束"

echo "step5 导入到职住来源开始"
cat $baseDir/position/job_housing/${crowdId}/* > $baseDir/position/job_housing/${crowdId}/job_housing
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.MysqlLoaderTask --inputFilePath  $baseDir/position/job_housing/${crowdId}/job_housing
if [ $? -ne 0 ];then
  content="导入到职住来源失败"
  exceptionInfo="导入到职住来源失败"
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi

echo 'step5: 导入到职住来源结束..'
echo '#################step5 生成职住来源结束...#################'

#添加删除
$hive -e "DROP TABLE IF EXISTS $tempAppTabName"
$hive -e "DROP TABLE IF EXISTS $tmpCrowdTable"

#删除临时文件
rm -r "$baseDir/position/region_bussiness/${crowdId}"
rm -r "$baseDir/position/region/${crowdId}"
rm -r "$baseDir/position/job_housing/${crowdId}"

echo '#################人群地理位置任务成功结束#################'
content="PositionCountAndSurroundingTask成功"
#必须调用此api,更新子计算对象状态为已完成
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"
echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"

exit 0

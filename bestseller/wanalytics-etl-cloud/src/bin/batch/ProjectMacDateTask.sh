#!/usr/bin/env bash
#ProjectMacDateJob
basedir=$(cd "$(dirname "$0")"; pwd)

##统计最大客流最近访问时间
source $basedir/env.sh
source $basedir/func.sh

cat $basedir/hiveinit.hive
declare hive="hive -S -i $basedir/hiveinit.hive"


calcObjectCode="ProjectMacDateJob"
calcObjectName="项目租户mac地址日志"
function usage() {
  echo "Usage: $0 [-date] [-schedulerTaskLogId]"
  echo "      -date calc date yyyy-MM-dd"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
}

if [ $# -le 0 ]; then
  usage
  exit 1
fi


while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
   (--date|-date)
      date="$2"
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


# 实时天客流 ProjectMacDateJob
echo "<<etl exec>> ProjectMacDateJob exec starting..."

#将入店客流和日期保存到hive表project_mac_date中

tempRunDate=${date//-/}
tmpSensorLogTableName="tmp_sensor_log_${tempRunDate}"

$hive -e "use wifianalytics; 
CREATE TABLE IF NOT EXISTS project_mac_date LIKE project_mac_date_template; 
insert into table project_mac_date
select 
distinct project_id,
tenant_id,
mac,${tempRunDate}
from
${tmpSensorLogTableName};"

if [ $? -ne 0 ]; then
	echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
	finishCalcObjectLogWithExcetpion $calcObjectLogId "从hive表中的tmp_sensor_log到project_mac_date失败"
	echo "$calcObjectName($calcObjectCode) exit with exception!!!"
	exit 1
fi


#将查询结果保存到临时文件上
tmpProjectMacDateFile=$tmpDataBaseDir/project_mac_date/tmp/project_mac_date_${tempRunDate}
projectMacDateFile=$tmpDataBaseDir/project_mac_date/project_mac_date_${tempRunDate}
$hive -e "use wifianalytics;
insert overwrite local directory '$tmpProjectMacDateFile' 
row format delimited fields terminated by ',' 
select project_id,
tenant_id,
mac,
max(ts_receive) 
from project_mac_date 
where ts_receive < ${tempRunDate}
group by project_id,tenant_id,mac;"

#合并文件
cat $tmpProjectMacDateFile/* > $projectMacDateFile

if [ $? -ne 0 ]; then
	echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
	finishCalcObjectLogWithExcetpion $calcObjectLogId "从hive表中的tmp_sensor_log到project_mac_date失败"
	echo "$calcObjectName($calcObjectCode) exit with exception!!!"
	exit 1
fi

##将结果同步到redis
java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.lz.ProjectMacDate2Redis --d $tempRunDate -f $projectMacDateFile

result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> ProjectMacDateJob calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

rm -rf $tmpProjectMacDateFile
rm $projectMacDateFile

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> ProjectMacDateJob exec finished."
exit 0

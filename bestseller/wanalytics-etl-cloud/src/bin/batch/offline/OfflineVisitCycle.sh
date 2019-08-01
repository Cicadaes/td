#!/bin/bash bash
set -o nounset

basedir=$(cd "$(dirname "$0")"; pwd)

source ${basedir}/../env.sh
source ${basedir}/../func.sh

cat ${basedir}/../hiveinit.hive
declare hive="hive -S -i ${basedir}/../hiveinit.hive"

calcObjectCode="OfflineVisitCycle"
calcObjectName="OfflineVisitCycle 店铺人群到访周期指标开发"
function usage() {
  echo "Usage: $0 [-runDate] [-schedulerTaskLogId]"
  echo "      -runDate calc date yyyy-MM-dd"
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
   (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
   (--schedulerTaskLogId|-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
   (--hour|-hour)
      hour="$2"
      shift 2
      ;;
    (*)
      usage
      exit 1
  esac
done

getYesterday $runDate

runDate=$yesterday

echo "OfflineVisitCycle RunDate ${runDate}"

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

tempRunDate=${runDate//-/}

calcObjectCode="MetricDayVisitCycleTask_${tempRunDate}"
calcObjectName="MetricDayVisitCycleTask"

tmpHiveResultPath="${tmpDataBaseDir}/MetricDayVisitCycle_${runDate}"

regionSql="select o.project_id,sum(o.visit_interval) from (select distinct project_id, mac, visit_interval from tmp_sensor_log_${tempRunDate} where visit_interval>0)o group by o.project_id;"

exportDataSql="use wifianalytics;insert overwrite local directory '${tmpHiveResultPath}' row format delimited fields terminated by ',' $regionSql"
$hive -e "$exportDataSql"

#hive导出结果放入 指定目录
cat ${tmpHiveResultPath}/00* > ${tmpDataBaseDir}/MetricDayVisitCycle_deal.txt

echo "<<etl exec>> VisitCycleTask district to mysql exec starting..."

# 执行java 程序，update visit_cycle 字段
java -classpath .:${basedir}/../../libs/* td.enterprise.wanalytics.etl.task.lz.VisitCycle --dealFile ${tmpDataBaseDir}/MetricDayVisitCycle_deal.txt --runDate ${runDate}

result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> OfflineVisitCycle calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> OfflineVisitCycle exec finished."
exit 0
#!/bin/sh
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh
source $basedir/func.sh
cat $basedir/hiveinit.hive
declare hive="hive -S -i $basedir/hiveinit.hive"

function usage() {
  echo "Usage: $0 [-fileName] [-runDate] [-hour] [-schedulerTaskLogId] [-calcObjectLogId] [-subCalcObjectCode] [-subCalcObjectName]"
  echo "      -fileName 计算hdfs上文件名称范式"
  echo "      -runDate calc yyyy-mm-dd"
  echo "      -hour calc hour hh format"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
  echo "      -calcObjectLogId calc object log id"
  echo "      -subCalcObjectCode sub calc object code"
  echo "      -subCalcObjectName sub calc object name"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
  (--fileName|-fileName)
      fileName="$2"
      shift 2
      ;;
  (--hdfsFrontFile|-hdfsFrontFile)
      hdfsFrontFile="$2"
      shift 2
      ;;
  (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
  (--hour|-hour)
      hour="$2"
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

#将探针日志文件载入hive中
tempRunDate=${runDate//-/}
tmpSensorLogTableName="tmp_sensor_log_${tempRunDate}"
tmpSensorFrontLogTableName="tmp_sensor_front_log_${tempRunDate}"
$hive -e "CREATE TABLE IF NOT EXISTS $tmpSensorLogTableName LIKE tmp_sensor_log_template;"
$hive -e "CREATE TABLE IF NOT EXISTS $tmpSensorFrontLogTableName LIKE tmp_sensor_front_log_template;"
$hive -e "load data inpath  '$fileName' into table $tmpSensorLogTableName ;"
$hive -e "load data inpath  '$hdfsFrontFile' into table $tmpSensorFrontLogTableName ;"

content="每小时计算storm日志成功"
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"
echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0
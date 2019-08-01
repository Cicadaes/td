#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
#把每天storm日志查询后放到ES表中
source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-runDate] "
  echo " -runDate yyyy-MM-dd"
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
  (--runDate|-runDate)
      runDate="$2"
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

getYesterday $runDate

runDate=$yesterday
echo "OfflineCopyLogToESJob RunDate ${runDate}"

calcObjectCode="OfflineCopyLogToESJob_${runDate}"

calcObjectName="每天拷贝Storm日志到ES中"

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

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec starting..."

#建表用到的日期，除去中划线
tempRunDate=${runDate//-/}

ESUrl=`echo "$es_nodes" | awk -F ',' '{print $1}'`

timestampDate=`date -d ${runDate} +%s`

#清空ES当天日志
function deleteESLogByDate() {
  echo "ES node url : $ESUrl"
  #long 类型
  _dateTime=$1
  data="{   \"query\": {   \"match\": {      \"ts_receive\":$_dateTime   }  } }"
  curl -H "Content-Type:application/json" -X POST --data "$data" "$ESUrl/$es_resource_index/$es_resource_type/_delete_by_query?conflicts=proceed&pretty"
  echo "删除成功！"
}

deleteESLogByDate "${timestampDate}000"

tmpESTableName=$es_resource_type
$hive -e " add jar $esJar;
	CREATE EXTERNAL TABLE IF NOT EXISTS $tmpESTableName(
  tenant_id bigint,
  ts_receive bigint,
  project_id bigint,
  tenant_offset bigint,
  session_id bigint,
  session_duration bigint,
  new_flag bigint,
  active_sign string
)
STORED BY 'org.elasticsearch.hadoop.hive.EsStorageHandler'
TBLPROPERTIES('es.nodes'='$es_nodes',
              'es.resource'='$es_resource_index/$tmpESTableName')";
if [ $? -ne 0 ]; then
	echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
	finishCalcObjectLogWithExcetpion $calcObjectLogId "创建ES表失败"
	echo "$calcObjectName($calcObjectCode) exit with exception!!!"
	exit 1
fi

#汇总表
tmpSensorLog=tmp_sensor_log_${tempRunDate}
tmpTableName=tmp_log_es_hive_${tempRunDate}
$hive -e "DROP TABLE IF EXISTS $tmpTableName;CREATE TABLE $tmpTableName LIKE tmp_log_es_hive_template"
$hive -e "insert into table $tmpTableName
select
tenant_id,
unix_timestamp(curr_date,'yyyy-MM-dd')*1000,
project_id,
tenant_offset,
session_id ,
max(session_duration) as session_duration,
case project_new_flag when 'true' then 1 else 0 end as new_flag,
active_sign
from
(
        select
        tenant_id,
        from_unixtime(cast(substr(ts_receive,1,length(ts_receive) -3) as int),'yyyy-MM-dd' ) as curr_date,
        project_id,
        tenant_offset,
        session_id as session_id,
        session_duration,
        project_new_flag,
        active_sign
        from $tmpSensorLog
) t

group by tenant_id,
      project_id,
      session_id,
      tenant_offset,
      project_new_flag,
      active_sign,
      curr_date ";

if [ $? -ne 0 ]; then
	echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
	finishCalcObjectLogWithExcetpion $calcObjectLogId "导入到hive数据失败"
	echo "$calcObjectName($calcObjectCode) exit with exception!!!"
	exit 1
fi

#需要先删除ES中数据,再导入
$hive -e "add jar $esJar;
insert overwrite table $tmpESTableName
select
tenant_id,
ts_receive,
project_id,
tenant_offset,
session_id,
session_duration,
new_flag,
active_sign
from $tmpTableName"

if [ $? -ne 0 ]; then
	echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
	finishCalcObjectLogWithExcetpion $calcObjectLogId "从hive导入到ES失败"
	echo "$calcObjectName($calcObjectCode) exit with exception!!!"
	exit 1
fi

tmpFrontSensorLog=tmp_sensor_front_log_${tempRunDate}
#将查询结果保存到hdfs上
$hive -e "use wifianalytics;
insert overwrite  directory \"/datacloud/wifianalytics/sensor_logs/${runDate}\" 
row format delimited fields terminated by \",\" 
SELECT DISTINCT
tenant_id,
project_id,
tenant_offset,
session_id,
mac,
session_duration,
active_sign,
front_sign
FROM
(
SELECT
tenant_id,
project_id,
tenant_offset,
session_id,
mac,
max(session_duration) AS session_duration,
active_sign,
max('notFront') AS front_sign
FROM
${tmpSensorLog}
GROUP BY
tenant_id,
project_id,
session_id,
tenant_offset,
mac,
active_sign
UNION ALL
SELECT
tenant_id,
project_id,
tenant_offset,
session_id,
mac,
max(session_duration) AS session_duration,
active_sign,
max('front') AS front_sign
FROM
${tmpFrontSensorLog}
GROUP BY
tenant_id,
project_id,
session_id,
tenant_offset,
mac,
active_sign
) AS t"


if [ $? -ne 0 ]; then
	echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
	finishCalcObjectLogWithExcetpion $calcObjectLogId "从hive导入到ES失败"
	echo "$calcObjectName($calcObjectCode) exit with exception!!!"
	exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

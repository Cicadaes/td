#!/bin/bash

basedir=$(cd "$(dirname "$0")"; pwd)
rootdir=$(cd "$(dirname "$0")"; cd ..; pwd)

function usage() {
  echo "Usage: $0 [-template]"
  echo "  -template"
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
  (--template|-template)
      template="$2"
      shift 2
      ;;
    (*)
      usage
      exit 1
  esac
done

#初始化env.sh
# echo "=====================开始进行模板替换============="
# cat $basedir/template/$template/env_template.sh  > $basedir/env.sh
# cat $basedir/template/$template/func_template.sh > $basedir/func.sh
# dos2unix  $basedir/*.sh > /dev/null 2>&1
# chmod +x  $basedir/*.sh > /dev/null 2>&1
# echo "=====================模板替换结束================"

etlbash="/home/hadoop/wanalytics/etl"
deteleTableName="active_executing_flows,active_sla,execution_flows,execution_jobs,execution_logs,project_events,project_files,project_flows,project_permissions,project_properties,project_versions,projects,properties,schedules,triggers"

#删除数据表内容
java -classpath .:${etlbash}/libs/* td.enterprise.wanalytics.etl.task.azkaban.DeleteAzkabScheduleTask --deleteFile $deteleTableName

#启动dmp monitor（防止monitor异常）
cd /home/hadoop/jetty-9.2.10-dmp-monitor-9030/
bash -x ./bin/jetty.sh restart

#脚本重启web
cd /home/hadoop/azkaban-web-2.5.0/
bash -x ./bin/azkaban-web-shutdown.sh
nohup ./bin/start-web.sh >> ./logs/start-web.log 2>&1

#根据表格创建
java -classpath .:${etlbash}/libs/* td.enterprise.wanalytics.etl.task.azkaban.AzkabanJobTask

#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
#用户权限任务
source $basedir/../env.sh
source $basedir/../func.sh

function usage() {
  echo "      -schedulerTaskLogId azkaban schedule task log id"
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
#  (--opUmid|-opUmid)
#      opUmid="$2"
#      shift 2
#      ;;
#  (--tenantId|-tenantId)
#      tenantId="$2"
#      shift 2
#      ;;
  (--schedulerTaskLogId|-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
  (*)
      usage
      exit 1
  esac
done

#只为code服务一下，方便日志
runDate=`date +%Y-%m-%d`
calcObjectCode="UmUserTask_${runDate}"
calcObjectName="用户权限任务"

#判断本计算对象是否需要skip
calcObjectIsNeedSkip $schedulerTaskLogId $calcObjectCode

if [ $isCalcObjectSkip -eq 1 ]; then
  #生成计算对象，设置计算对象状态为skip
  skipExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#判断本计算对象是否需要stop
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectCode

if [ ${isStop} -eq 1 ]; then
  #生成计算对象，设置计算对象状态为stop
  stopExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#生成计算对象
generateCalcObjectLog $schedulerTaskLogId $calcObjectCode $calcObjectName

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec starting..."

#执行同步UM用户和权限
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.um.UmUserTask
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

finishCalcObjectLogWithSuccess $calcObjectLogId
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

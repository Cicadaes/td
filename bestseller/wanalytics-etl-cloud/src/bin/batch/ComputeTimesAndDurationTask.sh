#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
#从ES中查询每个项目到访次数，到访时间，停留次数，停留时间，然后放到counter表中
source $basedir/env.sh
source $basedir/func.sh

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

calcObjectCode="ComputeTimesAndDurationTask_${runDate}"
calcObjectName="计算次数和时长任务"

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

#每个项目计算结果
timesDurationFile=$basedir/timesDurationFile_${tempRunDate}
#删除临时文件
rm "$timesDurationFile"

# 获取每个店铺(项目)到访、停留时间阀值配置信息的文件. 文件数据格式: tenant_id project_id visit_time_threshold stay_time_threshold
outputFile=$basedir/projectConfigList_${tempRunDate}
java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.counter.CreateProjectConfigTask --runDate "$runDate" --outputFile "$timesDurationFile"
if [ $? -ne 0 ];then
  content="项目配置信息失败"
  finishCalcObjectLogWithExcetpion $calcObjectLogId $content
  exit 1
fi


#导入到结果表中
java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.counter.ImportTimesAndDurationResult --inputFile "$timesDurationFile"
if [ $? -ne 0 ];then
  content="导入到结果表中失败"
  finishCalcObjectLogWithExcetpion $calcObjectLogId $content
  exit 1
fi

#进店时长分布
java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.counter.ImportDurationDistributionTask --runDate "$runDate"

#删除临时文件
rm "$outputFile"
rm "$timesDurationFile"

finishCalcObjectLogWithSuccess $calcObjectLogId
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

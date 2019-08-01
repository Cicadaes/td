#!/bin/bash
set -o nounset

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

calcObjectCode="BatchFilterBlackMacJob_$$"
calcObjectName="批量过滤项目黑名单"

function usage() {
  echo "Usage: $0[-schedulerTaskLogId]"
  echo "      -endDate yyyy-MM-dd"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
}

while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
  (--endDate|-endDate)
	  endDate="$2"
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

getYesterday $endDate

endDate=$yesterday

echo "OfflineBatchFilterBlackMac RunDate ${endDate}"

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
echo "endDate=${endDate} schedulerTaskLogId=${schedulerTaskLogId} "
tmpEndDate=${endDate//-/}
outputFile="${basedir}/batchFilterBlackMac_${tmpEndDate}"

#生成配置文件信息，相同规则的项目一行记录
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.blacklist.CreateProjectBlackListConfigTask --outputFile "$outputFile"
result=$?
if [ $result -eq 1 ]; then
  echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$calcObjectName($calcObjectCode) exit with exception!!!"
  exit 1
fi

#遍历配置文件，逐个进行判断
while read line
      do
    	#连续总天数
        totalDays=`echo "$line" | awk -F ';' '{print $1}'`
        #出现次数
        occureTimes=`echo "$line" | awk -F ';' '{print $2}'`
        #项目Id
        projectIds=`echo "$line" | awk -F ';' '{print $3}'`
        
        subCalcObjectCode="ComputeBlackMacSubJob_${totalDays}_${occureTimes}"
        subCalcObjectName="计算项目黑名单"
        bash -x ${basedir}/../blacklist/ComputeBlackMacSubJob.sh --endDate ${endDate} --totalDays $totalDays --occureTimes $occureTimes --projectIds $projectIds --calcObjectLogId $calcObjectLogId --schedulerTaskLogId $schedulerTaskLogId --subCalcObjectCode $subCalcObjectCode --subCalcObjectName --$subCalcObjectName
        if [ $? -eq 1 ]; then
            echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
            finishCalcObjectLogWithExcetpion $calcObjectLogId ""
            echo "$calcObjectName($calcObjectCode) exit with exception!!!"
            exit 1
        fi
done < "$outputFile"

rm  "${outputFile}"

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0


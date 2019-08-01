#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
source $basedir/env.sh
source $basedir/func.sh

function usage() {
  echo "Usage: $0 [-runDate] [-hour]"
  echo " -runDate -hour runDate yyyy-MM-dd hour is two digit"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

#添加重跑标记
reRun=false

while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
  (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
  (--hour|-hour)
      hour="$2"
      shift 2
      ;;
  (--schedulerTaskLogId|-schedulerTaskLogId)
     schedulerTaskLogId="$2"
     shift 2
     ;;
  (--reRun|-reRun)
     reRun="$2"
     shift 2
     ;;
   (*)
      usage
      exit 1
  esac
done

calcObjectCode="CopyFileToHDFSJob_${runDate}_${hour}"

#重跑标记
if [ "$reRun" == "true" ]; then
	calcObjectCode="CopyFileToHDFSJob_${runDate}_${hour}_$$"
fi
calcObjectName="每小时拷贝storm日志到hdfs上任务"

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

#要执行的数组
hoursArray=($hour)
echo "array=${hoursArray[@]}"
tmpHour=$hour
tempRunDate=$runDate

if [ "00" == "$tmpHour" ];then
	tmpHour="24";
	timestamp_startdate=`date -d ${tempRunDate} +%s`
	timestamp_resultdate=`expr ${timestamp_startdate} '-' 86400`
	tempRunDate=`date -d @${timestamp_resultdate} +%Y-%m-%d`
fi

tempDate=${tempRunDate//-/}
tmpHour=`expr $tmpHour - 1`
if [ $tmpHour -lt 10 ];then
    tmpHour="0${tmpHour}"
fi

hdfsFile="${HADOOP_BASE_DIR}*/$tempDate/*.dmp.${tempRunDate}-${tmpHour}-*"
hdfsFrontFile="${HADOOP_BASE_DIR}*/$tempDate/*.front.${tempRunDate}-${tmpHour}-*"

if [ ! -f "${basedir}/log_synch.flag" ]; then 
   #复制全天的日志
   hdfsFile="${HADOOP_BASE_DIR}*/$tempDate/*.dmp.${tempRunDate}-*"
   hdfsFrontFile="${HADOOP_BASE_DIR}*/$tempDate/*.front.${tempRunDate}-*"
   for((i=1; i<=$hour;i++));
   do 
      temp=$i
    if [ $i -lt 10 ];then
      temp="0${i}"
    fi
    hoursArray[$i-1]=$temp
   done
fi

echo "--------hoursArray=${hoursArray[@]}"

for eHour in ${hoursArray[@]}  
do
	subCalcObjectCode="CopyHourFileToHDFSSubJob_${runDate}_${eHour}"
	subCalcObjectName="拷贝指定小时内storm日志到hdfs上"
	bash -x ${basedir}/CopyHourFileToHDFSSubJob.sh --runDate $runDate --hour $eHour --calcObjectLogId $calcObjectLogId --schedulerTaskLogId $schedulerTaskLogId --subCalcObjectCode $subCalcObjectCode --subCalcObjectName --$subCalcObjectName
	if [ $? -eq 1 ]; then
		echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
		finishCalcObjectLogWithExcetpion $calcObjectLogId ""
		echo "$calcObjectName($calcObjectCode) exit with exception!!!"
		exit 1
	fi
	echo "${runDate}-${eHour}" >> "${basedir}/log_synch.flag"
done 

echo "---导入到hive表中开始... ... "
subCalcObjectCode="LoadDataToHiveSubJob_${runDate}_${tmpHour}"
subCalcObjectName="每小时日志导入到hive表中"
bash -x ${basedir}/LoadDataToHiveSubJob.sh  --fileName $hdfsFile --hdfsFrontFile $hdfsFrontFile --runDate $tempRunDate --hour $eHour --calcObjectLogId $calcObjectLogId --schedulerTaskLogId $schedulerTaskLogId --subCalcObjectCode $subCalcObjectCode --subCalcObjectName --$subCalcObjectName
if [ $? -eq 1 ]; then
	echo "<<etl exec>> Exception:$calcObjectName($calcObjectCode) calculate failed!!!"
	finishCalcObjectLogWithExcetpion $calcObjectLogId ""
	echo "$calcObjectName($calcObjectCode) exit with exception!!!"
	exit 1
fi
echo "---导入到hive表中完成！ "

finishCalcObjectLogWithSuccess $calcObjectLogId

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0

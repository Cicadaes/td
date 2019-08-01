#!/bin/sh
basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/env.sh

function usage() {
  echo "Usage: $0 [-fileName] [-runDate] [-hdfsPath] [-name] [-sourceLogFile]"
  echo "  -fileName"
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
      fileName="$2*"
      shift 2
      ;;
  (--frontFileName|-frontFileName)
      frontFileName="$2*"
      shift 2
      ;;
  (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
  (--hdfsPath|-hdfsPath)
      hdfsPath="$2"
      shift 2
      ;;
  (--nodeName|-nodeName)
      nodeName="$2"
      shift 2
      ;;
  (--name|-name)
      name="$2"
      shift 2
      ;;
  (--frontName|-frontName)
      frontName="$2"
      shift 2
      ;;
  (--sourceLogFile|-sourceLogFile) #原始文件, 如果拷贝的文件不存在，需要检查原始文件是否存在，并在指定日期和小时存在
      sourceLogFile="$2*"
      shift 2
      ;;
  (--frontSourceLogFile|-frontSourceLogFile) #原始文件, 如果拷贝的文件不存在，需要检查原始文件是否存在，并在指定日期和小时存在
      frontSourceLogFile="$2*"
      shift 2
      ;;
    
   (*)
      usage
      exit 1
  esac
done
echo "begin copy file from local to hdfs fileName=${fileName} runDate=${runDate} hdfsPath=${hdfsPath} name=$name sourceLogFile=$sourceLogFile"
tempDate=${runDate//-/}

$HADOOP_BASE/hadoop fs -test -d "${hdfsPath}${tempDate}"
if [ $? -ne 0 ] ;then
$HADOOP_BASE/hadoop fs -mkdir "${hdfsPath}${tempDate}"
fi

#检查没有归档文件时间，是否需要归档
echo "----------sourceLogFile====${sourceLogFile}"
for logFile in $sourceLogFile
do
	echo "------------logFile========${logFile}"
	tmpLogFileLong=`stat -c %Y $logFile`
	tmpLogFileDate=`date -d @$tmpLogFileLong +%Y-%m-%d-%H`
	#模糊匹配，判断是否在需要拷贝的范围内
    tempName=`basename $logFile`
    tempFileName="dmp.${tmpLogFileDate}"
    echo "check tempFileName=tempFileName name=${name}"
    if [ "${tempFileName}" == "${name}" ]; then
		echo "-----copy dmp file as $name----"
		#提取出来6701等
		worker=`echo $tempName|cut -c5-9`
		${HADOOP_BASE}hadoop fs -copyFromLocal $logFile  ${hdfsPath}${tempDate}/${nodeName}.dmp.${tmpLogFileDate}-${worker}.log
	else
		echo "---not equal-------"
	fi
done
##店前客流日志
echo "----------frontSourceLogFile====${frontSourceLogFile}"
for logFile in $frontSourceLogFile
do
	echo "------------logFile========${logFile}"
	tmpLogFileLong=`stat -c %Y $logFile`
	tmpLogFileDate=`date -d @$tmpLogFileLong +%Y-%m-%d-%H`
	#模糊匹配，判断是否在需要拷贝的范围内
    tempName=`basename $logFile`
    tempFileName="front.${tmpLogFileDate}"
    echo "check tempFileName=tempFileName name=${name}"
    if [ "${tempFileName}" == "${name}" ]; then
		echo "-----copy dmp file as $name----"
		#提取出来6701等
		worker=`echo $tempName|cut -c5-9`
		${HADOOP_BASE}hadoop fs -copyFromLocal $logFile  ${hdfsPath}${tempDate}/${nodeName}.front.${tmpLogFileDate}-${worker}.log
	else
		echo "---not equal-------"
	fi
done




echo "${HADOOP_BASE}hadoop fs -copyFromLocal $fileName  ${hdfsPath}${tempDate}/"

#hadoop fs -test -f ${hdfsPath}${tempDate}/${name}
#if [ $? -eq 0 ] ;then
#echo "------file ${hdfsPath}${tempDate}/${name} exsit,do not need copy-----------"
#exit 0
#fi

#遍历文件，添加上ip信息，校验文件是否存在
for archiveLogFile in $fileName
do
    tempFileName=$(basename $archiveLogFile)
    #workerName=`echo $tempFileName|cut -c19-29`
    copyFileName="${nodeName}.${tempFileName}"
    outputFile="${FILTER_LOG_TMP_DIR}${tempFileName}"
	java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.FilterSessionLogTask --inputFile $archiveLogFile --outputFile $outputFile
	result=$?
	if [ $result -ne 0 ] ;then
       echo "-----------过滤文件失败---------"
       exit 1
    fi
    ${HADOOP_BASE}hadoop fs -copyFromLocal $outputFile  ${hdfsPath}${tempDate}/$copyFileName
    result=$?
    if [ $result -eq 0 ] ;then
       echo "------copy $archiveLogFile  as $copyFileName success------------"
    fi
    if [ $result -ne 0 ] ;then
       echo "-----------copy $archiveLogFile  as $copyFileName failure---------"
    fi
    #删除临时文件
    rm "$outputFile"
done
##店前客流日志
for archiveLogFile in $frontFileName
do
    tempFileName=$(basename $archiveLogFile)
    copyFileName="${nodeName}.${tempFileName}"
    ${HADOOP_BASE}hadoop fs -copyFromLocal $archiveLogFile  ${hdfsPath}${tempDate}/$copyFileName
    result=$?
    if [ $result -eq 0 ] ;then
       echo "------copy $archiveLogFile  as $copyFileName success------------"
    fi
    if [ $result -ne 0 ] ;then
       echo "-----------copy $archiveLogFile  as $copyFileName failure---------"
    fi
done


echo "end copy files from local to hdfs"
exit 0
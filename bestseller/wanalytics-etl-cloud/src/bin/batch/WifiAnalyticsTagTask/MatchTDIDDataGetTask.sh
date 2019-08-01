#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: MatchTDIDDataGetTask.sh
# AUTHOR: junmin.li
# DATE: 2016.04.25
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 由MAC匹配TDID

#demo data
#bash -x MatchTDIDDataGetTask.sh --tenantId 2000247 --date 2016-04-23 --cycle_statistics 30  --schedulerTaskLogId 568

basedir=$(cd "$(dirname "$0")"; pwd)

source $basedir/../env.sh
source $basedir/../func.sh

#subCalcObjectCode="WifiAnalyticsMasterTask_200"
#subCalcObjectName="MatchTDIDDataGetTask"

cat $basedir/../hiveinit.hive
declare hive="hive -S -i $basedir/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-tenantId] [-projectId] -runDate] [-schedulerTaskLogId]"
  echo "      -date calc date yyyy-mm-dd"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

# get arguments
while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
   (--date|-date)
      date="$2"
      shift 2
      ;;
   (--tenantId|-tenantId)
      tenantId="$2"
      shift 2
      ;;
   (--inputFile|-inputFile)
      inputFile="$2"
      shift 2
      ;;
   (--outputFile|-outputFile)
      outputFile="$2"
      shift 2
      ;;
   (--schedulerTaskLogId|-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
   (--calcObjectLogId|-calcObjectLogId)
         calcObjectLogId="$2"
         shift 2
         ;;
    (*)
      usage
      exit 1
  esac
done

subCalcObjectCode="WifiAnalyticsMasterTask_200_${tenantId}_${date}"
subCalcObjectName="MatchTDIDDataGetTask"


#判断本子计算对象是否需要skip
subCalcObjectIsNeedSkip $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isSubCalcObjectSkip -eq 1 ]; then
  #生成子计算对象，设置子计算对象状态为skip
  skipExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

#判断本子计算对象是否需要stop
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode

if [ $isStop -eq 1 ]; then
  #生成子计算对象，设置子计算对象状态为stop
  stopExecSubCalcObject $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
  exit 0
fi

generateSubCalcObjectLog $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec starting..."

tempRunDate=${date//-/}
echo "tenantId=$tenantId,date=$date,schedulerTaskLogId=$schedulerTaskLogId"

localPath="${tmpDataBaseDir}/${tenantId}/${date}"

echo '################# Step 1, 调用TD DMP接口，获取tdid数据 start#################'

macTdidDmkFile=${tmpDataBaseDir}/${tenantId}/${date}/dmk.tdid
java -classpath .:$basedir/../../libs/* td.enterprise.wanalytics.etl.task.tag.MatchTDIDDataGetTask --date ${date} --tenantId ${tenantId} --inputFile $inputFile --outputFile $macTdidDmkFile
result=$?
if [ $result -ne 0 ];then
  content="调用TD DMP接口 fail!"
  exceptionInfo="调用TD DMP接口 fail"
#必须调用api记录子计算对象异常信息
  finishSubCalcObjectLogWithException $subCalcObjectLogId "$content" "$exceptionInfo"
  exit 1
fi
echo '################# Step 1, 调用接口，获取tdid数据 end#################'


echo '################# Step 2, 合并offset start#################'
currentTime=`date +%s`
macTdidTmp=${tmpDataBaseDir}/${tenantId}/${date}/tmp.offset_mac_tdid
$hive -e "Create Table tmp_mac_tdid_${currentTime} like mac_tdid_template;
          LOAD DATA local INPATH '$macTdidDmkFile' INTO TABLE tmp_mac_tdid_${currentTime};
          Create Table tmp_offset_mac_${currentTime} like offset_mac_template;
          LOAD DATA local INPATH '${tmpDataBaseDir}/${tenantId}/${date}/new.offset_mac' INTO TABLE tmp_offset_mac_${currentTime};

          insert overwrite local directory '$macTdidTmp'
            row format delimited fields terminated by '\t' LINES TERMINATED BY '\n'
            select a.offset, a.mac, b.tdid from tmp_offset_mac_${currentTime} a inner join tmp_mac_tdid_${currentTime} b on (a.mac=b.mac) ;

          DROP table tmp_mac_tdid_${currentTime};
          DROP table tmp_offset_mac_${currentTime};"
cat $macTdidTmp/* > $outputFile
rm -rf $macTdidTmp

echo '################# Step 2, 合并offset end#################'


content="MatchTDIDDataGetTask成功"
#必须调用此api,更新子计算对象状态为已完成
finishSubCalcObjectLogWithSuccess $subCalcObjectLogId "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

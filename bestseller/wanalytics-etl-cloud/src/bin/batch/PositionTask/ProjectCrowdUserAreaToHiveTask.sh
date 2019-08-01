#!/bin/bash bash
set -o nounset

# 根据城市

basedir=$(cd "$(dirname "$0")"; pwd)

source ${basedir}/../env.sh
source ${basedir}/../func.sh

cat ${basedir}/../hiveinit.hive
declare hive="hive -S -i ${basedir}/../hiveinit.hive"

function usage() {
  echo "Usage: $0 [-cityName] [-cityHashCode]  [-runDate]  [-schedulerTaskLogId] [-calcObjectLogId] [-macFile] [-outputFile] [-inputType]"
  echo "      -cityName city name "
  echo "      -cityHashCode hash code of city name"
  echo "      -runDate yyyy-mm-dd"
  echo "      -schedulerTaskLogId azkaban schedule task log id"
  echo "      -calcObjectLogId number value that function.sh created "
  echo "      -macFile city user mac file"
  echo "      -outputFile output file"
  echo "      -inputFileType input file type. city or crowd"
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
   (--cityName|-cityName)
      cityName="$2"
      shift 2
      ;;
   (--cityHashCode|-cityHashCode)
      cityHashCode="$2"
      shift 2
      ;;
   (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
  (--startDate|-startDate)
      startDate="$2"
      shift 2
      ;;
  (--endDate|-endDate)
      endDate="$2"
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
   (--macFile|-macFile)
     macFile="$2"
     shift 2
     ;;
   (--outputFile|-outputFile)
     outputFile="$2"
     shift 2
     ;;
   (--inputFileType|-inputFileType)
     inputFileType="$2"
     shift 2
     ;;
   (--projectId|-projectId)
     projectId="$2"
     shift 2
     ;;
   (--tenantId|-tenantId)
     tenantId="$2"
     shift 2
     ;;
   (--crowdId|-crowdId)
     crowdId="$2"
     shift 2
     ;;
   (--crowdType|-crowdType)
     crowdType="$2"
     shift 2
     ;;
   (--crowdName|-crowdName)
     crowdName="$2"
     shift 2
     ;;
   (*)
      usage
      exit 1
  esac
done

subCalcObjectCode="ProjectCrowdUserAreaToHiveTask_${projectId}_${crowdId}_${runDate}"
subCalcObjectName="ProjectCrowdUserAreaToHiveTask"

#判断本子计算对象是否需要skip
subCalcObjectIsNeedSkip ${schedulerTaskLogId} ${calcObjectLogId} ${subCalcObjectCode}

if [ ${isSubCalcObjectSkip} -eq 1 ]; then
  #生成子计算对象，设置子计算对象状态为skip
  skipExecSubCalcObject ${schedulerTaskLogId} ${calcObjectLogId} ${subCalcObjectCode} ${subCalcObjectName}
  exit 0
fi

#判断本子计算对象是否需要stop
schedulerTaskIsNeedStop ${schedulerTaskLogId} ${calcObjectLogId} ${subCalcObjectCode}

if [ ${isStop} -eq 1 ]; then
  #生成子计算对象，设置子计算对象状态为stop
  stopExecSubCalcObject ${schedulerTaskLogId} ${calcObjectLogId} ${subCalcObjectCode} ${subCalcObjectName}
  exit 0
fi

generateSubCalcObjectLog ${schedulerTaskLogId} ${calcObjectLogId} ${subCalcObjectCode} ${subCalcObjectName}

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec starting..."

tempRunDate=${runDate//-/}
tmpOffsetPath="${tmpDataBaseDir}/position_offset_${runDate}"
echo "tmpOffsetPath: "${tmpOffsetPath}

tempAppTabName="tmp_crowd_user_top_area_${cityHashCode}_${crowdId}_${tempRunDate}"
tempAppTabNameCity="tmp_city_user_top_area_${cityHashCode}_${tempRunDate}"

echo "crowd用户活动区域数据开始导入到hive临时表开始... 表 ${tempAppTabName}"
#删除临时表，如果存在
$hive -e "DROP TABLE IF EXISTS ${tempAppTabName}"
#根据hive模板，创建表
$hive -e "CREATE TABLE ${tempAppTabName} LIKE tmp_crowd_user_top_area_template"
if [ $? -ne 0 ];then
  content="创建  ${tempAppTabName} 失败"
  exceptionInfo="创建  ${tempAppTabName} 失败"
  finishCalcObjectLogWithExcetpion "$content" "$exceptionInfo"
  exit 1
fi

#店铺人群用户的mac地址从macFile文件读取到hive表中
echo "macFile is ${macFile}"
$hive -e "load data local inpath  '${macFile}' into table ${tempAppTabName}"

if [ $? -ne 0 ];then
  content="load data table fail ${tempAppTabName}, drop temp table"
  exceptionInfo="load data table fail, drop temp table"
  finishCalcObjectLogWithExcetpion ${subCalcObjectLogId} "$content" "$exceptionInfo"
#  $hive -e "DROP TABLE IF EXISTS ${tempAppTabName};"
  exit 1
fi

#-----------------通过关联查询出来 开始结束-------------------------

#生成区域来源数据
echo '城市人群夜间区域hive查询开始 residence...'
tmpHiveResultPath="${tmpOffsetPath}/hive/residence_${projectId}_${crowdId}"

regionSql="select collect_set(residence), COUNT(*)ICOUNT from ${tempAppTabNameCity} area inner join ${tempAppTabName} crowd on area.mac = crowd.mac"
exportDataSql="insert overwrite local directory '${tmpHiveResultPath}' row format delimited fields terminated by '\t' ${regionSql}"

echo "开始执行 $exportDataSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出到${tmpOffsetPath}/hive/${crowdId}失败"
  exceptionInfo="导出到${tmpOffsetPath}/hive/${crowdId}失败"
  finishSubCalcObjectLogWithException ${subCalcObjectLogId} "$content" "$exceptionInfo"
  exit 1
fi

#hive导出结果放入 指定目录
topResultDir=${tmpOffsetPath}/top
mkdir -p ${topResultDir}
echo "mkdir ${topResultDir}"
cat ${tmpHiveResultPath}/00* > ${topResultDir}/${projectId}_${crowdId}_residence.area

#删除临时文件
#rm -r "$baseDir"

echo "<<etl exec>> ProjectSaveCrowdAreaTask exec starting..."
echo "input file path is ${topResultDir}/${projectId}_${crowdId}_residence.area"
areaType=2
java -classpath .:${basedir}/../../libs/* td.enterprise.wanalytics.etl.task.position.ProjectSaveCrowdAreaTask --inputFile ${topResultDir}/${projectId}_${crowdId}_residence.area --tenantId ${tenantId} --projectId ${projectId} --crowdId ${crowdId} --crowdType ${crowdType} --crowdName ${crowdName} --areaType ${areaType} --runDate ${runDate} --startDate ${startDate} --endDate ${endDate}
result=$?
if [ ${result} -eq 1 ]; then
  echo "<<etl exec>> ProjectHeatMapTask calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion $calcObjectLogId ""
  echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
  exit 1
fi



#-----------------通过关联查询出来 开始结束-------------------------

#生成区域来源数据
echo '...hive人群夜间区域hive查询开始, district...'
tmpHiveResultPath="${tmpOffsetPath}/hive/district_${projectId}_${crowdId}"

regionSql="select collect_set(district), COUNT(*)ICOUNT from ${tempAppTabNameCity} area inner join ${tempAppTabName} crowd on area.mac = crowd.mac"
exportDataSql="insert overwrite local directory '${tmpHiveResultPath}' row format delimited fields terminated by '\t' $regionSql"
echo "开始执行 $exportDataSql"
$hive -e "$exportDataSql"
if [ $? -ne 0 ];then
  content="导出到${tmpOffsetPath}/hive/${crowdId}失败"
  exceptionInfo="导出到${tmpOffsetPath}/hive/${crowdId}失败"
  finishSubCalcObjectLogWithException ${subCalcObjectLogId} "$content" "$exceptionInfo"
  exit 1
fi

#从hive中删除临时表
#$hive -e "drop table ${tempAppTabNameCity};"
#$hive -e "drop table ${tempAppTabName};"

#hive导出结果放入 指定目录
cat ${tmpHiveResultPath}/00* > ${topResultDir}/${projectId}_${crowdId}_district.area

echo "<<etl exec>> ProjectSaveCrowdAreaTask district to mysql exec starting..."

areaType=1
java -classpath .:${basedir}/../../libs/* td.enterprise.wanalytics.etl.task.position.ProjectSaveCrowdAreaTask --inputFile ${topResultDir}/${projectId}_${crowdId}_district.area --tenantId ${tenantId} --projectId ${projectId} --crowdId ${crowdId} --crowdType ${crowdType} --areaType ${areaType} --runDate ${runDate} --startDate ${startDate} --endDate ${endDate}

result=$?
if [ ${result} -eq 1 ]; then
  echo "<<etl exec>> ProjectHeatMapTask calculate failed!!!"
  #更新计算对象日志状态为异常，后端会自动获取异常信息
  finishCalcObjectLogWithExcetpion ${calcObjectLogId} ""
  echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
  exit 1
fi

echo 'cityName=${cityName}, crowdId=${crowdId} 处理完毕！'

content="ProjectCrowdUserAreaToHiveTask over successfully"

finishCalcObjectLogWithExcetpion ${subCalcObjectLogId} "$content"

echo "<<etl exec>> $subCalcObjectName($subCalcObjectCode) exec finish"
exit 0

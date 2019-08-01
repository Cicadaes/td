#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
rootdir=$(cd "$(dirname "$0")"; cd ..; pwd)

source $basedir/../env/env.sh
source $basedir/func.sh

function usage() {
  echo "Usage: $0 [-type] [-schedulerTaskLogId]"
  echo "      -type eg. crowd"
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
    (-type)
      type="$2"
      shift 2
      ;;
    (-schedulerTaskLogId)
      schedulerTaskLogId="$2"
      shift 2
      ;;
    (*)
      usage
      exit 1
  esac
done

calcObjectCode="EntranceCrowdTask"
calcObjectName="营销管家入口人群生成任务"

#一、生成需要计算的人群ID配置文件
crowdIdPath=$rootdir/input/crowdId
mkdir -p $crowdIdPath
crowdIdFile="${configPath}/${schedulerTaskLogId}"
java -classpath .:$rootdir/libs/* com.talkingdata.marketing.batch.etl.entrancecrowd.EntranceCrowdGenerate --outputFile "$crowdIdFile"
if [ $? -eq 0 ]; then
    #更新offset路径文件
    echo "EntranceCrowdGenerate $crowdIdFile success!"
else
    echo "---EntranceCrowdGenerate $crowdIdFile failure---"
fi

#二、循环读取人群ID
if [ -f $crowdIdFile ] && [ -s $crowdIdFile ]; then

    #记录userId路径
    hdfsUserPathTmpPath=$rootdir/input/userPath
    mkdir -p $hdfsUserPathTmpPath
    hdfsUserPathTmpFile=$hdfsUserPathTmpPath/$schedulerTaskLogId

    #生成userId文件和offset映射表信息文件保存至hdfs
    hdfsOffsetPath=$HDFS_TMP_PATH/crowd/$schedulerTaskLogId
    hdfsTablePath=$HDFS_TMP_PATH/table/$schedulerTaskLogId
    for line in `cat $crowdIdFile` ;do

        pipelineId=`echo "$line" | awk -F ',' '{print $1}'`
        crowdId=`echo "$line" | awk -F ',' '{print $2}'`
        crowdRefId=`echo "$line" | awk -F ',' '{print $3}'`
        idTypeCode=`echo "$line" | awk -F ',' '{print $4}'`
        crowdCalcType=`echo "$line" | awk -F ',' '{print $5}'`

        java -classpath .:$rootdir/libs/* com.talkingdata.marketing.batch.etl.entrancecrowd.EntranceCrowdUser --pipelineId "$pipelineId" --crowdId "$crowdId" --crowdRefId "$crowdRefId" --idTypeCode "$idTypeCode" --hdfsOffsetPath "$hdfsOffsetPath" --hdfsTablePath "$hdfsTablePath"
        if [ $? -eq 0 ]; then
            #更新userId路径文件
            echo "${pipelineId},${crowdRefId},${crowdCalcType}"  >> $hdfsUserPathTmpFile
            echo "EntranceCrowdUser $pipelineId $crowdRefId $crowdCalcType $hdfsOffsetPath $hdfsTablePath success!"
        else
            echo "---EntranceCrowdUser $pipelineId $crowdRefId $crowdCalcType $hdfsOffsetPath $hdfsTablePath failure---"
        fi

    done

    #sparksql合并人群，生成临时表
    ##创建临时表
    allUserTmpTable="tmp_mkt_crowd_${schedulerTaskLogId}"
    createUserIdTmpTable="create table if not exists ${allUserTmpTable} ( pipeline_id string, crowd_id string, offset string ) ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' STORED AS textfile;"
    echo "$sparksql -e $createUserTmpTable"
    $sparksql -e "$createUserTmpTable"
    if [ $? -ne 0 ]; then
      echo "ERROR: create table : $createUserTmpTable is failed!"
      exit 1
    fi

    ##追加人群user数据
    loadUserTmpDataSql="load data inpath '${hdfsOffsetPath}' into table ${allUserTmpTable};"
    dropUserTmpTable="drop table if exists ${allUserTmpTable};"
    echo "$sparksql -e $loadUserTmpDataSql"
    $sparksql -e "$loadUserTmpDataSql"
    if [ $? -ne 0 ]; then
      echo "ERROR: load data : $loadUserTmpDataSql is failed!"
      $sparksql -e "$dropUserTmpTable"
      exit 1
    fi

    #sparksql关联user_profile、user_log，生成文件文件
    sparkLib=/home/$USER/jars
    echo "spark-submit"
    spark-submit --class com.talkingdata.marketing.batch.crowd.EntranceCrowdGenerateTask --executor-memory $spark_executor_memory --executor-cores $spark_executor_cores   $sparkLib/spark_aux.jar "$allUserTmpTable" "$hdfsTablePath"
    if [ $? -eq 0 ]; then
        echo "spark-submit EntranceCrowdGenerateTask exec success!"
    else
        echo "---spark-submit EntranceCrowdGenerateTask exec failure---"
        exit 1
    fi

    #spark合并生成eventPackage

    #标志人群计算结束
    for line in `cat $hdfsUserPathTmpFile`; do
        pipelineId=`echo "$line" | awk -F ',' '{print $1}'`
        crowdRefId=`echo "$line" | awk -F ',' '{print $2}'`
        crowdCalcType=`echo "$line" | awk -F ',' '{print $3}'`

        java -classpath .:$rootdir/libs/* com.talkingdata.marketing.batch.etl.entrancecrowd.EntranceCrowdFinish --pipelineId "$pipelineId" --crowdRefId "$crowdRefId" --crowdCalcType= "$crowdCalcType"
        if [ $? -eq 0 ]; then
            echo "EntranceCrowdFinish $crowdRefId $crowdCalcType success!"
        else
            echo "---EntranceCrowdFinish $crowdRefId $crowdCalcType failure---"
        fi
    done

    #删除
    ##删除sparksql关联结果

    ##删除userId临时表
    echo "$sparksql -e $dropUserTmpTable"
    $sparksql -e "$dropUserTmpTable"
    if [ $? -ne 0 ]; then
      echo "ERROR: drop table : $dropUserTmpTable is failed!"
      exit 1
    fi

    ##删除hdfs人群userId文件和offset映射表信息文件
    if [ ! "$HDFS_TMP_PATH" = "" ] && [ ! "$schedulerTaskLogId" = "" ] ; then
        hadoop fs -rm $hdfsOffsetPath
        hadoop fs -rm $hdfsTablePath
    fi

    ##删除userId路径文件
    if [ -n "$hdfsUserPathTmpFile" ] && [ ! "$hdfsUserPathTmpFile" = "" ]; then
        rm -r $hdfsUserPathTmpFile
    fi

else
    echo "---------$crowdIdFile not exeist or empty !!!---------"
fi
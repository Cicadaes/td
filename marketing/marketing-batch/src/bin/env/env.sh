#!/bin/sh
HOME_PATH_PREFIX=home
USER="hadoop"
HDFS_TMP_PATH="/tmp/mkt"
HDFS_CROWD_TMP_PATH=$HDFS_TMP_PATH/crowd

basedir=$(cd "$(dirname "$0")"; pwd)
rootdir=$(cd "$(dirname "$0")"; cd ..; pwd)
COMPUTE_DAY=`date -d"1 day ago" +"%Y%m%d"`
MONITOR_URL=http://172.23.7.130:9030/dmp-monitor

spark_executor_memory=6G
spark_executor_cores=2

#spark
SPARK_USERNAME=hadoop
SPARK_PASSWORD=hadoop
SPARK_URL=jdbc:hive2://localhost:10000

declare sparksql="beeline -n$SPARK_USERNAME -p$SPARK_PASSWORD -u$SPARK_URL --verbose --showNestedErrs  -i /home/hadoop/dmp/etl/bin/spark/sparkinit.spark "


#JVM
export JAVA_OPTS="-Djava.net.preferIPv4Stack=true"
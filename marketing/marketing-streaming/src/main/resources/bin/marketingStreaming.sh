#!/bin/bash

basedir=$(cd "$(dirname "$0")"; pwd)
#脚本执行目录
bin_dir=$(cd `dirname $0`; pwd)
#设置APP HOME目录
APP_HOME=$(dirname ${bin_dir})

#JVM
export JAVA_OPTS="-server -Xms1536m -Xmx1536m -Djava.net.preferIPv4Stack=true"

libs_dir=${APP_HOME}/libs

#启动
nohup ${SPARK_HOME}/bin/spark-submit \
             --class com.talkingdata.marketing.streaming.MarketingStreaming \
             --master spark://sz-pg-smce-grayhadoop-001.tendcloud.com:7077 \
             --executor-memory 4g \
             --total-executor-cores 5 \
             --conf spark.streaming.kafka.maxRatePerPartition=1000 \
             --conf spark.streaming.backpressure.enabled=true \
             --conf spark.driver.extraJavaOptions=-XX:+UseConcMarkSweepGC \
             --conf spark.executor.extraJavaOptions=-XX:+UseConcMarkSweepGC \
             ${libs_dir}/marketing-streaming.jar > marketingStreaming.log &

echo $! > ${APP_HOME}/marketingStreaming.pid
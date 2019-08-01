#!/bin/bash

basedir=$(cd "$(dirname "$0")"; pwd)
#脚本执行目录
bin_dir=$(cd `dirname $0`; pwd)
#设置APP HOME目录
APP_HOME=$(dirname ${bin_dir})

#JVM
export JAVA_OPTS="-server -Xms1536m -Xmx1536m -Djava.net.preferIPv4Stack=true -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/hadoop/marketing-report/logs/dump"

#设置classpath
libs_dir=${APP_HOME}/libs
config_dir=${APP_HOME}/config
i18n=${APP_HOME}/i18n

classpath=${classpath}:${config_dir}:${i18n}

for i in `ls ${libs_dir}`
do
    classpath=${classpath}:${libs_dir}/$i
done

echo ${classpath}

#启动
nohup ${JAVA_HOME}/bin/java ${JAVA_OPTS} -classpath ".:${classpath}" com.talkingdata.marketing.Application >> /dev/null 2>&1 &

echo $! > ${APP_HOME}/app.pid
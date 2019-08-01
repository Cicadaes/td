#!/bin/bash

current_dir=$(cd "$(dirname "$0")"; pwd)
base_dir=$(cd ${current_dir}/../../; pwd)

source ${current_dir}/../env/env.sh

#设置classpath
libs_dir=${base_dir}/libs
config_dir=${base_dir}/config

classpath=".:"${classpath}:${base_dir}:${config_dir}:${libs_dir}/*
echo "classpath is : "${classpath}

${JAVA_HOME}/bin/java ${JAVA_OPTS} -cp "${classpath}" com.talkingdata.marketing.batch.etl.pipelinedata.EpEs2KafkaJob
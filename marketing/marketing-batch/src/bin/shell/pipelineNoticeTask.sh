#!/bin/bash

current_dir=$(cd "$(dirname "$0")"; pwd)
base_dir=$(cd ${current_dir}/../../; pwd)

source ${current_dir}/../env/env.sh
source ${current_dir}/func.sh

notice_type="$1"

#设置classpath
libs_dir=${base_dir}/libs
config_dir=${base_dir}/config

classpath=".:"${base_dir}:${config_dir}
for i in `ls ${libs_dir}`
do
    classpath=${classpath}:${libs_dir}/$i
done
echo "classpath is : "${classpath}


${JAVA_HOME}/bin/java ${JAVA_OPTS} -classpath "${classpath}" com.talkingdata.marketing.batch.etl.ExecuteEtlJob -t "${notice_type}"
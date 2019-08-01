#!/bin/bash

basedir=$(cd "$(dirname "$0")"; pwd)

#脚本执行目录
bin_dir=$(cd `dirname $0`; pwd)
#设置APP HOME目录
APP_HOME=$(dirname ${bin_dir})

kill `cat ${APP_HOME}/app.pid`

rm -rf ${APP_HOME}/app.pid
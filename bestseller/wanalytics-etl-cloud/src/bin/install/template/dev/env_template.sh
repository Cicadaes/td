#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)

COMPUTE_DAY=`date -d"1 day ago" +"%Y%m%d"`
ROOTPATH="/dmp"
DATABASE_NAME=dmp_tmp

export JAVA_HOME=/home/hadoop/jdk1.8.0_111
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH

CLUSTER_URL="hdfs://172.30.4.225.tdsh.com"

HADOOP_BASE="/home/hadoop/hadoop-2.7.2/bin/"
HADOOP_BASE_DIR="/wifianalytics/logs/storm_logs/dmp/"
HADOOP_BASE_DISCARD_DIR="/wifianalytics/logs/storm_logs/discard/"
LOCAL_BASE_PATH="/data/wifianalytics/apache-storm-1.0.2/logs/"
FILTER_LOG_TMP_DIR="/home/hadoop/wifianalytics-processor/temp/"
STORM_HOST=supervisor01.td.com,supervisor02.td.com,supervisor03.td.com

S3_BASE="/home/hadoop/hadoop-2.7.2/bin/"
S3_BASE_DIR="/wifianalytics/s3/logs/storm_logs/dmp/"
S3_BASE_DISCARD_DIR="/wifianalytics/s3/logs/storm_logs/discard/"
S3_BASE_FAIL_DIR="/wifianalytics/s3/logs/storm_logs/fail/"
        

tmpDataBaseDir="/home/hadoop/wanalytics/datafile/tmp/"
udtfJar=/home/hadoop/wanalytics/etl/udf/wanalytics-udf-4.0.4.SNAPSHOT.jar

esJar=/home/hadoop/apache-hive-1.2.1-bin/lib/elasticsearch-hadoop-5.1.2.jar

#ES配置
es_nodes=elasticsearch01.td.com:9200,elasticsearch02.td.com:9200,elasticsearch03.td.com:9200
#ES创建表index
es_resource_index=wifianalytics
#ES 默认type名称
es_resource_type=log_es

#sftp
#sftp root path
SFTP_ROOT_PATH="/upload/offline-enhancement"

#etl
#temp log path
# ETL_TMPLOG_PATH="/home/hadoop/offline-etl/output/tmpLog"
ETL_TMPLOG_PATH=${FILTER_LOG_TMP_DIR}

#storm
#storm etl root bin
STORM_ETLROOT_PATH="/home/hadoop/offline-processor"
#storm log path
LOCAL_LOG_PATH="/data/apache-storm-1.0.2/offlinelogs"
#storm log prefix
STORM_ALLLOG_PREFIX="offlinesuccess"
STORM_DISCARDLOG_PREFIX="offlinediscard"
STORM_FAILLOG_PREFIX="offlinefail"

#hosts
#strom host(supervisiors)
# STORM_HOST=172.23.5.114,172.23.5.115,172.23.5.116
#etl host(only one)
ETL_HOST=172.23.5.109
#sftp host(only one)
SFTP_HOST=172.23.5.113

hive_dbName=wifianalytics

adapterUrl=172.23.4.137:7000
## ftp 文件存储路径
ftpPath=/data/wifianalytics/bestseller/
seaFtpPath=/data/wifianalytics/seabestseller/

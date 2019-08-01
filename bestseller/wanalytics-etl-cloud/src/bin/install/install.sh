#!/bin/bash

basedir=$(cd "$(dirname "$0")"; pwd)
rootdir=$(cd "$(dirname "$0")"; cd ..; pwd)
date=$(date +"%Y%m%d")


install_dir=/home/hadoop/wanalytics/etl
backup_dir=/home/hadoop/wanalytics/backup

maxDays=5
#删除5天前的备份
tempRunDate=${date//-/}
timestampStartdate=`date -d ${tempRunDate} +%s`
timestampResultdate=`expr ${timestampStartdate} '-' ${maxDays} '*' 86400`
deleteDate=`date -d @${timestampResultdate} +%Y%m%d`

cat $rootdir/bin/hiveinit.hive
declare hive="hive -S -i $rootdir/bin/hiveinit.hive"

function usage() {
  echo "Usage: $0 [-template]"
  echo "  -template"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
  (--template|-template)
      template="$2"
      shift 2
      ;;
    (*)
      usage
      exit 1
  esac
done

#设置参数信息(mv不能覆盖)
cp -r $rootdir/bin/V2/*   $rootdir/bin/
cp -r $rootdir/bin/shell/*   $rootdir/bin/
rm -rf $rootdir/bin/V2
rm -rf $rootdir/bin/shell

echo "=====================开始进行模板替换============="
cat $rootdir/install/template/$template/env_template.sh  > $rootdir/bin/env.sh
cat $rootdir/install/template/$template/func_template.sh > $rootdir/bin/func.sh
echo "=====================模板替换结束================"
dos2unix  $rootdir/bin/*.sh > /dev/null 2>&1
dos2unix  $rootdir/bin/WifiAnalyticsMasterTask/*.sh > /dev/null 2>&1
dos2unix  $rootdir/bin/competitor/*.sh > /dev/null 2>&1
dos2unix  $rootdir/install/*.sh > /dev/null 2>&1
chmod +x  $rootdir/bin/WifiAnalyticsMasterTask/*.sh > /dev/null 2>&1
chmod +x  $rootdir/bin/*.sh > /dev/null 2>&1
chmod +x  $rootdir/bin/competitor/*.sh > /dev/null 2>&1
chmod +x  $rootdir/install/*.sh > /dev/null 2>&1
echo "=====================开始备份================"
mkdir -p  $backup_dir/$date
mv $install_dir/bin $backup_dir/$date/
mv $install_dir/libs $backup_dir/$date/
#mv   $install_dir/udf $backup_dir/$date/
echo "=====================备份结束================"

echo "=====================开始安装================"
cp -r $rootdir/bin  $install_dir/
cp -r $rootdir/job  $install_dir/bin/
cp -r $rootdir/libs  $install_dir/
#cp -r $rootdir/udf  $install_dir/
echo "=====================安装结束================"

echo "=====================开始删除${maxDays}天前备份=========="
rm -rf $backup_dir/$deleteDate/
echo "=====================删除${maxDays}天前备份结束================"

echo "=====================初始化hive表================"
$hive -f "$rootdir/hive_create_table.sql"
echo "=====================hive表执行成功================"

echo "===========部署storm节点开始================"
source $rootdir/bin/env.sh
#遍历每个storm节点，进行备份部署
for nodeName in ${STORM_HOST//,/ }
do
	
#创建文件夹,适用于第一次部署
ssh hadoop@$nodeName " mkdir -p /home/hadoop/wifianalytics-processor/bin "
ssh hadoop@$nodeName " mkdir -p /home/hadoop/wifianalytics-processor/bin/job "
ssh hadoop@$nodeName " mkdir -p /home/hadoop/wifianalytics-processor/libs "
ssh hadoop@$nodeName " mkdir -p /home/hadoop/wifianalytics-processor/temp "
ssh hadoop@$nodeName " mkdir -p /home/hadoop/wifianalytics-processor/backup "

#备份文件
echo "开始备份$nodeName"
ssh hadoop@$nodeName " mkdir -p /home/hadoop/wifianalytics-processor/backup/$date "
ssh hadoop@$nodeName " cp -r /home/hadoop/wifianalytics-processor/bin /home/hadoop/wifianalytics-processor/backup/$date/ "
ssh hadoop@$nodeName " cp -r /home/hadoop/wifianalytics-processor/libs /home/hadoop/wifianalytics-processor/backup/$date/ "
echo "备份$nodeName 完毕"
echo "开始部署$nodeName"
scp -r $rootdir/libs hadoop@$nodeName:/home/hadoop/wifianalytics-processor/
scp  $rootdir/bin/env.sh hadoop@$nodeName:/home/hadoop/wifianalytics-processor/bin/
scp  $rootdir/bin/copyFileToHDFS.sh hadoop@$nodeName:/home/hadoop/wifianalytics-processor/bin/

#删除备份
ssh hadoop@$nodeName "rm -rf /home/hadoop/wifianalytics-processor/backup/$deleteDate "
echo "部署$nodeName完毕"
done
echo "===========部署storm节点结束================"
echo "=====================成功结束================"

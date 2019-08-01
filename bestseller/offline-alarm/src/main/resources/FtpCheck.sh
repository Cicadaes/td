#!/bin/sh
export LANG="zh_CN.GB18030"
echo 'start offline alarm'
/home/hadoop/jdk1.8.0_40/bin/java -classpath /home/hadoop/offline-alarm/lib/offline-alarm-3.0.jar com.talkingdata.offline.alarm.main.FtpCheck /data/wifianalytics/bestseller/ yinglei.li@tendcloud.com,junmin.li@tendcloud.com,xiongkun.sun@tendcloud.com,liuxili@bestseller.com.cn,robinhan@bestseller.com.cn
echo 'end offline alarm'

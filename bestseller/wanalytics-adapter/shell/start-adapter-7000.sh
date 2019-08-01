#!/bin/bash


nohup java -XX:+UseG1GC -Xmx10g -Xloggc:/home/hadoop/wifianalytics-adapter-7000/gc.out -jar wanalytics-adapter-2.0.jar --server.port=7000\
 --ftp.downFileNum=30\
 --ftp.fixMinute=10\
 --ftp.lock.key=lock\
 --ftp.directory.lock.key=directoryNum\
 --ftp.fixedDelay=10000\
 --ftp.host=h3crd-wlan1.chinacloudapp.cn\
 --ftp.username=bestseller\
 --ftp.password=bestsellersecurity\
 --collector.url=http://10.150.33.122:8083/g/ow\
 --ftp.localPath=/data/wifianalytics/bestseller/\
 --redis.host=redis01.uat.bs.com:26379,mysql.uat.bs.com:26379\
 --redis.master=mymaster\
 --appcode=wadatper > /dev/null 2>&1 &

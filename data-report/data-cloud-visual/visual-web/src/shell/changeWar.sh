#!/bin/bash

#开发环境
scp visual-web.war hadoop@172.23.4.43:/home/hadoop/apache-tomcat-7.0.62-datareport-9097/changeConfig
ssh hadoop@172.23.4.43 "cd /home/hadoop/apache-tomcat-7.0.62-datareport-9097/changeConfig/;nohup sh changeConfig.sh &"
scp visual-web.war hadoop@172.23.4.45:/home/hadoop/apache-tomcat-7.0.62-datareport-9097/changeConfig
ssh hadoop@172.23.4.45 "cd /home/hadoop/apache-tomcat-7.0.62-datareport-9097/changeConfig/;nohup sh changeConfig.sh &"
#!/bin/bash

# SCRIPT: database_init.sh.sh
# AUTHOR: yunlong.wang
# DATE: 2016.12.27
# REV: 1.0
# PLATFORM: Linux
# PURPOSE: 客缘数据库初始化

basedir=$(cd "$(dirname "$0")"; pwd)

changelog_path=/home/hadoop/liquibase/changelogs
driver=com.mysql.jdbc.Driver
classpath=/home/hadoop/liquibase/lib/mysql-connector-java-5.1.29-bin.jar

azkaban_url="jdbc:mysql://172.23.5.110:3306/azkaban?useUnicode=true&characterEncoding=UTF-8"
azkaban_user=azkaban
azkaban_passwd=azkaban

dmp_console_url="jdbc:mysql://172.23.5.110:3306/dmp_console?useUnicode=true&characterEncoding=UTF-8"
dmp_console_user=dmp
dmp_console_passwd=dmp

um_url="jdbc:mysql://172.23.5.110:3306/um?useUnicode=true&characterEncoding=UTF-8"
um_user=um
um_passwd=um

wifianalytics_url="jdbc:mysql://172.23.5.110:3306/wifianalytics?useUnicode=true&characterEncoding=UTF-8"
wifianalytics_user=wifianalytics
wifianalytics_passwd=wifianalytics

wifianalytics_bitmap_url="jdbc:mysql://172.23.5.110:3306/wifianalytics_bitmap?useUnicode=true&characterEncoding=UTF-8"
wifianalytics_bitmap_user=wifianalytics
wifianalytics_bitmap_passwd=wifianalytics

wifianalytics_counter_url="jdbc:mysql://172.23.5.110:3306/wifianalytics_counter?useUnicode=true&characterEncoding=UTF-8"
wifianalytics_counter_user=wifianalytics
wifianalytics_counter_passwd=wifianalytics

wifianalytics_meta_url="jdbc:mysql://172.23.5.110:3306/wifianalytics_meta?useUnicode=true&characterEncoding=UTF-8"
wifianalytics_meta_user=wifianalytics
wifianalytics_meta_passwd=wifianalytics

echo "azkaban"
liquibase --driver=$driver --classpath=$classpath --changeLogFile=$changelog_path/azkaban/azkaban_init.xml --url=$azkaban_url --username=$azkaban_user --password=$azkaban_passwd migrate
echo "dmp_console"
liquibase --driver=$driver --classpath=$classpath --changeLogFile=$changelog_path/dmp_console/dmp_console_init.xml --url=$dmp_console_url --username=$dmp_console_user --password=$dmp_console_passwd	 migrate
echo "um_init"
liquibase  --driver=$driver --classpath=$classpath --changeLogFile=$changelog_path/um/um_init.xml --url=$um_url --username=$um_user --password=$um_passwd migrate
echo "wifianalytics_bitmap"
liquibase --driver=$driver --classpath=$classpath --changeLogFile=$changelog_path/wifianalytics_bitmap/wifianalytics_bitmap_init.xml --url=$wifianalytics_bitmap_url --username=$wifianalytics_bitmap_user --password=$wifianalytics_bitmap_passwd migrate
echo "wifianalytics_counter"
liquibase --driver=$driver --classpath=$classpath --changeLogFile=$changelog_path/wifianalytics_counter/wifianalytics_counter_init.xml --url=$wifianalytics_counter_url --username=$wifianalytics_counter_user --password=$wifianalytics_counter_passwd migrate
echo "wifianalytics"
liquibase --driver=$driver --classpath=$classpath --changeLogFile=$changelog_path/wifianalytics/wifianalytics_init.xml --url=$wifianalytics_url --username=$wifianalytics_user --password=$wifianalytics_passwd migrate
echo "wifianalytics_meta"
liquibase --driver=$driver --classpath=$classpath --changeLogFile=$changelog_path/wifianalytics_meta/wifianalytics_meta_init.xml --url=$wifianalytics_meta_url --username=$wifianalytics_meta_user --password=$wifianalytics_meta_passwd migrate


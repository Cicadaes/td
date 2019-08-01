#!/bin/bash
export_host=172.23.4.54
export_port=3306
export_database=visual
export_userName=datacloud
export_fileName=visual.sql
export_password=datacloud@talkingdata
#/Users/yangruobin/myapp/mysql-5.7.13-osx10.11-x86_64/bin/mysqldump -h $export_host -P $export_port -u$export_userName -p$export_password $export_database > $export_fileName
#./mysqldump_expect_command.sh  $export_host $export_port $export_database $export_userName $export_fileName $export_password


import_host=10.150.33.124
import_port=3306
import_userName=root
import_password=root
import_sql=test.sql
./mysql_expect_command.sh $import_host $import_port $import_userName $import_password $import_sql
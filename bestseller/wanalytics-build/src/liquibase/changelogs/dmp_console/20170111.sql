--liquibase formatted sql

--changeset e.nan:1484099912000-1
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tdidGetWay','fe','调用TDID接口的方法dmk/dmp/ftp/fe','wreport','WifiAnalytics','enanq');
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tagsGetWay','fe','调用Tags接口的方法dmk/dmp/ftp/fe','wreport','WifiAnalytics','enanq');
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tdidDownloadpath','dmp/datafile/download/wanalytics/','Tdid-download路径','wreport','WifiAnalytics','enanq');
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tdidUploadpath','dmp/datafile/upload/wanalytics/','Tdid-upload路径','wreport','WifiAnalytics','enanq');

insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tdidFtpIp','unknow','调用TDID接口ftpIP','wreport','WifiAnalytics','enanq');
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tdidFtpPort','unknow','调用TDID接口ftp端口','wreport','WifiAnalytics','enanq');
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tdidFtpUsername','unknow','调用TDID接口ftp用户名','wreport','WifiAnalytics','enanq');
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('tdidFtpPassword','unknow','调用TDID接口ftp密码','wreport','WifiAnalytics','enanq');

--rollback delete from TD_PARAM where creator='enanq';
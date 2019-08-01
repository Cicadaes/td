--liquibase formatted sql

--changeset junmin.li:1487038394359-1
insert into TD_PARAM (param_key,param_value,description,system_code,create_by,creator) values('positionGetWay','fe','调用POSITION接口的方法dmk/fe','wreport','WifiAnalytics','junmin.li');
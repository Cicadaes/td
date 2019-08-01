
-- Drop database wifianalytics;
use wifianalytics;

---用户标签表
CREATE TABLE `tenant_tag_table_template`(
  `tenant_id` String,
  `offset` String,
  `mac` String,
  `tdid` String,
  `sex` String,
  `age` String,
  `profession` String,
  `marriage` String,
  `car` String,
  `child` String,
  `mobile_price` String,
  `mobile_brand` String,
  `app_shopping` String,
  `app_education` String,
  `app_reading` String,
  `app_news` String,
  `app_social` String,
  `app_communication` String,
  `app_video` String,
  `app_travel` String,
  `app_home` String,
  `app_health` String,
  `app_life` String,
  `app_work` String,
  `app_tool` String,
  `app_finance` String,
  `app_estates` String,
  `app_mom` String,
  `app_entertainment` String,
  `app_car` String,
  `app_beautify` String,
  `update_date` String)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n'
STORED AS INPUTFORMAT
  'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat';

---用户标签表
drop table new_mac_template;
CREATE TABLE `new_mac_template`(
  `offset` String,
  `mac` String,
  `date` String)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n'
STORED AS INPUTFORMAT
  'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat';


---offset_mac表
drop table offset_mac_template;
CREATE TABLE `offset_mac_template`(
  `offset` String,
  `mac` String)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n'
STORED AS INPUTFORMAT
  'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat';

---mac-tdid表
drop table mac_tdid_template;
CREATE TABLE `mac_tdid_template`(
  `mac` String,
  `tdid` String)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n'
STORED AS INPUTFORMAT
  'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat';


drop TABLE `tmp_sensor_log_template`;
  CREATE TABLE `tmp_sensor_log_template`(
  `tenant_id` string,
  `ts_receive` bigint,
  `ap_mac` string,
  `ts_send` string,
  `rssi` string,
  `mac` string,
  `discard` string,
  `fail_code` string,
  `project_id` int,
  `sensor_id` int,
  `project_type` string,
  `project_name` string,
  `tenant_offset` bigint,
  `project_new_flag` string,
  `session_id` string,
  `session_duration` int,
  `discard_message` string,
  `front_user_flag` string,
  `project_num` string,
  `active_sign` string,
  `stay_sign` string,
  `visit_interval` int
  )
ROW FORMAT SERDE
  'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
WITH SERDEPROPERTIES (
  'field.delim'='\,',
  'line.delim'='\n')
STORED AS INPUTFORMAT
  'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat';

drop TABLE `tmp_log_es_hive_template`;
CREATE  TABLE tmp_log_es_hive_template(
  tenant_id int,
  ts_receive bigint,
  project_id int,
  tenant_offset int,
  session_id bigint,
  session_duration int,
  new_flag tinyint,
  active_sign string
)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n';


  drop TABLE `tmp_project_position_template`;
  CREATE TABLE `tmp_project_position_template`(
  `tdid` string,
  `mac` string,
  `longtitude` string,
  `latitude` string,
  `day_type` int,
  `hour` int,
  `hour_type` int,
  `metric_value` int,
  `region_name` string,
  `region_type` string,
  `bd09_longtitude` string,
  `bd09_latitude` string,
  `business_name` string
  )
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n';

  drop TABLE `tmp_project_position_surrouding_template`;
  CREATE TABLE `tmp_project_position_surrouding_template`(
  `bd09longtitude` string,
  `bd09latitude` string,
  `poi_wid` string,
  `day_type` string,
  `metric_value` string,
  `area_name` string,
  `poi_type` string)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n' ;

   drop TABLE `tmp_project_area_template`;
    CREATE TABLE `tmp_project_area_template`(
    `area_name` string,
    `area_type` string,
    `latitude` string,
    `longtitude` string)
  ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n' ;

    drop TABLE `tmp_tdid_template`;
  CREATE TABLE `tmp_tdid_template`(
    `tdid` string
   )
  ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n' ;

  drop table tmp_project_distance_template;
  CREATE TABLE `tmp_project_distance_template`(
    `longtitude` string,
    `latitude` string,
    `hour_type` int,
    `distance` int
    )
  ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n';


 drop TABLE `temp_project_offset_template`;
 CREATE TABLE `temp_project_offset_template`(
  `tenant_id` string,
  `project_id` string,
  `date` string,
  `offset` int)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n';

drop TABLE `tmp_log_es_hive_template`;
CREATE  TABLE tmp_log_es_hive_template(
  tenant_id int,
  ts_receive bigint,
  project_id int,
  tenant_offset int,
  session_id bigint,
  session_duration int,
  new_flag tinyint
)
ROW FORMAT DELIMITED
  FIELDS TERMINATED BY '\t'
  LINES TERMINATED BY '\n';

drop table tmp_user_top_template;
  CREATE TABLE `tmp_user_top_template`(
    `mac` string,
    `district` String,
    `residence` string)
  ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n';

drop table tmp_crowd_user_top_area_template;
  CREATE TABLE `tmp_crowd_user_top_area_template`(
    `mac` string)
  ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n';

-- project-mac-date    
drop TABLE `project_mac_date_template`;
CREATE TABLE `project_mac_date_template`(
  `project_id` int,
  `tenant_id` string,
  `mac` string,
  `ts_receive` bigint
  )
ROW FORMAT SERDE
  'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
WITH SERDEPROPERTIES (
  'field.delim'='\,',
  'line.delim'='\n')
STORED AS INPUTFORMAT
  'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat';
  
drop TABLE `tmp_sensor_front_log_template`;
  CREATE TABLE `tmp_sensor_front_log_template`(
  `tenant_id` string,
  `ts_receive` bigint,
  `ap_mac` string,
  `ts_send` string,
  `rssi` string,
  `mac` string,
  `discard` string,
  `fail_code` string,
  `project_id` int,
  `sensor_id` int,
  `project_type` string,
  `project_name` string,
  `tenant_offset` bigint,
  `project_new_flag` string,
  `session_id` string,
  `session_duration` int,
  `discard_message` string,
  `front_user_flag` string,
  `project_num` string,
  `active_sign` string,
  `stay_sign` string,
  `visit_interval` int
  )
ROW FORMAT SERDE
  'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
WITH SERDEPROPERTIES (
  'field.delim'='\,',
  'line.delim'='\n')
STORED AS INPUTFORMAT
  'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat';
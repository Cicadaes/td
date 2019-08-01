--liquibase formatted sql

--changeset ran.li:1495800476000-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`)
VALUES
	(null, 'CustomerGroup', '构建客群功能自定义客群的定时离线计算脚本', '/home/hadoop/wanalytics/etl/bin/job/CustomerGroup.job', 'CustomerGroup', '00,00,am,CST', '01/01/2017', '', '', 1),
	(null, 'WifiAnalyticsLookAlikeMasterTask', '潜客扩大，调用lookalike算法，获取扩大后的职住来源数据', '/home/hadoop/wanalytics/etl/bin/job/WifiAnalyticsLookAlikeMasterTask.job', 'WifiAnalyticsLookAlikeMasterTask', '00,00,am,CST', '01/01/2017', '', '', 1),
	(null, 'KmeansCluster', '构建聚类任务', '/home/hadoop/wanalytics/etl/bin/job/KmeansCluster.job', 'KmeansCluster', '00,00,am,CST', '01/01/2017', '', '', 1),
	(null, 'FilterBlackMacTask', '根据规则过滤单个项目黑名单', '/home/hadoop/wanalytics/etl/bin/job/FilterBlackMacTask.job', 'FilterBlackMacTask', '00,00,am,CST', '01/01/2017', '', '', 1),
	(null, 'LoadProjectDataFromDB', '从数据库里导入竞品项目客流等', '/home/hadoop/wanalytics/etl/bin/job/LoadProjectDataFromDB.job', 'LoadProjectDataFromDB', '00,00,am,CST', '01/01/2017', '', '', 1),
	(null, 'OfflineComputeTask', '计算离线指标任务', '/home/hadoop/wanalytics/etl/bin/job/OfflineComputeTask.job', 'OfflineComputeTask', '00,00,am,CST', '01/01/2017', 'on', '10m', 1),
	(null, 'DownloadDataTask', '数据下载任务', '/home/hadoop/wanalytics/etl/bin/job/DownloadDataTask.job', 'DownloadDataTask', '01,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'ComputeTimesAndDurationTask', '计算到访次数，停留次数和停留时长，驻留时长分布', '/home/hadoop/wanalytics/etl/bin/job/ComputeTimesAndDurationTask.job', 'ComputeTimesAndDurationTask', '01,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'DegreeCounterTask', '计算店组进店数量', '/home/hadoop/wanalytics/etl/bin/job/DegreeCounterTask.job', 'DegreeCounterTask', '01,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'CopyLogToESJob', '每天把日志过滤后导入到ES中', '/home/hadoop/wanalytics/etl/bin/job/CopyLogToESJob.job', 'CopyLogToESJob', '01,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'BatchFilterBlackMacTask', ' 批量过滤项目黑名单', '/home/hadoop/wanalytics/etl/bin/job/BatchFilterBlackMacTask.job', 'BatchFilterBlackMacTask', '00,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'MBOTask', '目标管理', '/home/hadoop/wanalytics/etl/bin/job/MBOTask.job', 'MBOTask', '00,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'CleanDBDataTask', '清理过期数据任务', '/home/hadoop/wanalytics/etl/bin/job/CleanDBDataTask.job', 'CleanDBDataTask', '00,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'PeopleGroupSumTask', '店组画像汇总任务', '/home/hadoop/wanalytics/etl/bin/job/PeopleGroupSumTask.job', 'PeopleGroupSumTask', '00,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'ProjectIndexTask', '项目指标任务', '/home/hadoop/wanalytics/etl/bin/job/ProjectIndexTask.job', 'ProjectIndexTask', '00,30,am,CST', '01/01/2017', 'on', '1d', 1),
	(null, 'CopyFileToHDFSJob', '拷贝storm日志到hdfs上，为导入到ES表使用', '/home/hadoop/wanalytics/etl/bin/job/CopyFileToHDFSJob.job', 'CopyFileToHDFSJob', '00,00,am,CST', '01/01/2017', 'on', '1h', 1),
	(null, 'BlackListSync', '同步黑名单到redis中', '/home/hadoop/wanalytics/etl/bin/job/BlackListSync.job', 'BlackListSync', '00,00,am,CST', '01/01/2017', 'on', '1h', 1),
	(null, 'SensorIndexTask', '探针指标任务', '/home/hadoop/wanalytics/etl/bin/job/SensorIndexTask.job', 'SensorIndexTask', '00,00,am,CST', '01/01/2017', 'on', '1h', 1),
	(null, 'WifiAnalyticsTagTask', '客群画像人口属性，应用偏好，手机品牌价格', '/home/hadoop/wanalytics/etl/bin/job/WifiAnalyticsTagTask.job', 'WifiAnalyticsTagTask', '01,00,am,CST', '01/01/2017', 'on', '1M', 1),
	(null, 'PositionTask', '职住来源，区域来源，TOP20小区', '/home/hadoop/wanalytics/etl/bin/job/PositionTask.job', 'PositionTask', '01,00,am,CST', '01/01/2017', 'on', '1M', 1);
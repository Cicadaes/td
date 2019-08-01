package com.talkingdata.datacloud.constant;

/**
 * @description: 通用常量
 * @author: cmh 2015年8月5日
 * @version: 1.0
 * @modify: <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CommonConstants {
	public static final String CONFIG_KEY_HIVE_DBS_NAME = "hive.dbs.name";

	public static class BaseCalcRecordStatusConstants {
		/**
		 * 任务计算状态：0，未计算
		 */
		public static final int CALC_STATUS_PENDING = 0;

		/**
		 * 任务计算状态：1，计算中
		 */
		public static final int CALC_STATUS_RUNNING = 1;

		/**
		 * 任务计算状态：2,计算完成
		 */
		public static final int CALC_STATUS_FINISHED = 2;

		/**
		 * 任务计算状态：3,终止中
		 */
		public static final int CALC_STATUS_STOPING = 3;

		/**
		 * 任务计算状态：4,被终止
		 */
		public static final int CALC_STATUS_STOPED = 4;

		/**
		 * 任务计算状态：5,无需执行
		 */
		public static final int CALC_STATUS_SKIPPED = 5;

		/**
		 * 任务计算状态：6,重试中
		 */
		public static final int CALC_STATUS_RETRING = 6;

		/**
		 * 任务计算状态：-1,计算异常
		 */
		public static final int CALC_STATUS_EXCEPTION = -1;

		/**
		 * 任务计算状态：-2，计算超时
		 */
		public static final int CALC_STATUS_TIMEOUT = -2;

		/**
		 * 任务计算状态：-3，待计算
		 */
		public static final int CALC_STATUS_TORELAUNCH = -3;

		/**
		 * 任务计算状态：-4，重新计算
		 */
		public static final int CALC_STATUS_RELAUNCH = -4;
	}

	public final static class AttachmentType {

		/**
		 * 用户导出
		 */
		public static final int ATTACHMENT_TYPE_EXPORT_USER = 1;

		/**
		 * 用户导入
		 */
		public static final int ATTACHMENT_TYPE_IMPORT_USER = 2;

		/**
		 * 人群导出
		 */
		public static final int ATTACHMENT_TYPE_EXPORT_CROWD = 3;

		/**
		 * 人群导入
		 */
		public static final int ATTACHMENT_TYPE_IMPORT_CROWD = 4;

		/**
		 * ETL单表模拟数据导入
		 */
		public static final int ATTACHMENT_TYPE_IMPORT_ETL_SIMULATED_DATA = 5;

	}

	public static class AttachmentConstants {

		/**
		 * 附件常量：1、用户导出
		 */
		public static final int ATTACHMENT_TYPE_USER_EXPORT = 1;

		/**
		 * 附件常量：2、用户导入
		 */
		public static final int ATTACHMENT_TYPE_USER_IMPORT = 2;

		/**
		 * 附件常量：3、人群导出
		 */
		public static final int ATTACHMENT_TYPE_CROWD_EXPORT = 3;

		/**
		 * 附件常量：4、人群导入
		 */
		public static final int ATTACHMENT_TYPE_CROWD_IMPORT = 4;

		/**
		 * 附件常量：5、etl单表导入
		 */
		public static final int ATTACHMENT_TYPE_ETL_IMPORT = 5;

		/**
		 * 附件常量：6、第三方标签导入
		 */
		public static final int ATTACHMENT_TYPE_EXTERN_TAG_IMPORT = 6;
		
		/**
		 * 附件常量：7、元数据模型导入
		 */
		public static final int ATTACHMENT_TYPE_META_DATA_MODEL_IMPORT = 7;
		
		/**
		 * 附件常量：8、元数据模型导出
		 */
		public static final int ATTACHMENT_TYPE_META_DATA_MODEL_EXPORT = 8;
	}

	public static class ObjectStatusConstants {
		/**
		 * 状态：1：未生效
		 */
		public static final int OBJECT_STATUS_NOT_EFFECT = 1;

		/**
		 * 状态：2，已生效
		 */
		public static final int OBJECT_STATUS_EFFECT = 2;

		/**
		 * 状态：-1,已删除
		 */
		public static final int OBJECT_STATUS_DEL = -1;
	}

	public static class QueryEngineResultKeyConstants {
		/**
		 * 类别
		 */
		public static final String RESULT_CATEGORIES = "categories";

		/**
		 * metaData code
		 */
		public static final String RESULT_KEYS = "keys";

		/**
		 * metaData other code
		 */
		public static final String RESULT_OTHER_KEYS = "otherKeys";

		/**
		 * series
		 */
		public static final String RESULT_SERIES = "series";

		/**
		 * name
		 */
		public static final String RESULT_SERY_NAME = "name";

		/**
		 * type
		 */
		public static final String RESULT_SERY_TYPE = "type";

		/**
		 * pie
		 */
		public static final String RESULT_SERY_TYPE_PIE = "pie";

		/**
		 * pie
		 */
		public static final String RESULT_SERY_DATA = "data";

		/**
		 * pie
		 */
		public static final String RESULT_ECHART_MAP_KEY = "key";

		/**
		 * pie
		 */
		public static final String RESULT_ECHART_MAP_VALUE = "value";

		/**
		 * pie
		 */
		public static final String RESULT_ECHART_MAP_RATE = "rate";
	}

	/**
	 * @deprecated use {@link AzkabanBizObjectTypeEnum} see also {@link AzkabanBizObjectTypeEnum}.
	 */
	public static class CalcObjectCodeConstants {
		/**
		 * 计算对象code:人群导出
		 */
		public static final String CROWD_EXPORT = "crowdExport";
		
		/**
		 * 计算对象code:元数据模型导入
		 */
		public static final String META_DATA_MODEL_IMPORT = "metaDataModelImport";
		
		/**
		 * 计算对象code:元数据模型导出
		 */
		public static final String META_DATA_MODEL_EXPORT = "metaDataModelExport";
		
		/**
		 * 计算对象code:元数据模型备份
		 */
		public static final String META_DATA_MODEL_BACKUP = "metaDataModelBackUp";
		
		/**
		 * 计算对象code:元数据模型清除
		 */
		public static final String META_DATA_MODEL_CLEARUP = "metaDataModelClearUp";
		
		/**
		 * 计算对象code:元数据模型还原
		 */
		public static final String META_DATA_MODEL_RESTORE = "metaDataModelRestore";
	}

	/**
	 * ETL 单表数据模板
	 */
	public static final String ETL_TEMPLATE_FILE_PATH = "hive.table.simulated.data.template.file.path";
	
	/**
	 * 元数据 对象映射
	 */
	public static final String META_OBJECT_MAPPING = "dmp.metadata.meta.object.mapping";
	

	public static final String TENANT_ID_GLOBAL = "global";

	/**
	 * 元数据属性code映射为业务属性code默认值
	 */
	public static final String ATRRIBUTE_CODE_MAPPING_BIZ_CODE_DEFAULT = "未知";

	/**
	 * Hbase rowkey长度
	 */
	public static final int HBASE_ROWKEY_LENGTH = 128;

	/**
	 * Hbase rowkey最小值占位符
	 */
	public static final String HBASE_ROWKEY_MIN_PLACEHOLDER = " ";

	/**
	 * Hbase rowkey最大值占位符
	 */
	public static final String HBASE_ROWKEY_MAX_PLACEHOLDER = "z";

	/**
	 * 参数缓存
	 */
	public static final String CACHE_PARAM = "param";

	/**
	 * 参数缓存
	 */
	public static final String CACHE_DIC = "dic";

	public static class DataBaseTypeConstants {
		public static final int SPARK_DATABASE = 1;
		public static final int HIVE_DATABASE = 2;
		public static final int HDFS_DATABASE = 3;
		public static final int HBASE_DATABASE = 4;
		public static final int ELASTICSEARCH_DATABASE = 5;
		public static final int MYSQL_DATABASE = 6;
	}
	
	public static final String LAST_UPDATE_KEY = "lastUpdateTime";
	
	/**
	 * 报表模型表前缀名
	 */
	public static final String REPORT_MODEL_TABLE_PREFIX = "DMP_MODEL_";
	
	/**
	 * dmp系统默认账户
	 */
	public static final String DMP_ADMIN_ACCOUNT = "dmpadmin";
	
	/**
	 * dmp系统默认账户
	 */
	public static final String DMP_ADMIN_ACCOUNT_NAME = "DMP系统管理员";
	
	/**
	 * 用户管家查询限制 1: 打开查询只能查询到本人创建的数据
	 */
	public static final String DMP_DATASECURITY_OWNERPRIVACY_ENABLE = "1";
	
	/**
	 * 用户管家查询限制 0: 关闭查询所有人创建的数据
	 */
	public static final String DMP_DATASECURITY_OWNERPRIVACY_DISABLE = "0";
}

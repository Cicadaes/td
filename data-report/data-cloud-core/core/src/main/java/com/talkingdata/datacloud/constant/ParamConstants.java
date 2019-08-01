package com.talkingdata.datacloud.constant;

/** 
 * @description: 参数常量对应 TD_PARAM.param_key
 * @author: cmh  2015年12月15日
 * @version: 1.0
 * @modify: 
 * @Copyright: 2015, Beijing TendCloud Science & Technology Co., Ltd.
 */
public class ParamConstants {
	
	public static class DataFileSystemConstants{
		/**
		 * 系统文件类型 ：ldfs
		 */
		public static final String LOCAL_DATA_FILE_SYSTEM = "ldfs";
		
		/**
		 * 系统文件类型 ：hdfs
		 */
		public static final String HADOOP_DATA_FILE_SYSTEM = "hdfs";
	}
	
	/**
	 * 分析系统hive中间表数据导入
	 */
	public static final String ANALYTICS_PROFILE_DATA_UPDATE = "analytics.profile.data.update";
	
	public static final String ANALYTICS_PROFILE_DATA_BACKUPPATH = "analytics.profile.data.backuppath";
	
	/**
	 * dmp中各种类型id关联表(域名.表名)
	 * biz.DMP_ID_REALATION_MERCHANT_CODE
	 */
	public static final String DMP_ID_REL_TABLE = "dmp.id.rel.table";
	
	/**
	 * id级别比较
	 */
	public static final String DMP_ID_PRIORITY = "dmp.id.priority";
	
	/**
	 * 通过字典id导出并上传到hdfs的字典项
	 */
	public static final String UPLOAD_HDFS_DIC_IDS = "upload.hdfs.dic.ids";
	
	/**
	 * 通过字典id导出并上传到hdfs的字典项
	 */
	public static final String UPLOAD_HDFS_DIC_TWO_LEVEL_IDS = "upload.hdfs.dic.two.level.ids";
	
	/**
	 * 通过字典项父id导出并上传到hdfs的字典项
	 */
	public static final String UPLOAD_HDFS_DICITEM_PARENTIDS = "upload.hdfs.dicItem.parentids";
	
	/**
	 * 从其他表同步数据到字典表
	 */
	public static final String SYNC_DATA_TO_DIC_TABLE = "sync.data.to.dic.table";
	
	/**
	 * 字典hdfs同步，在本地生成文件路径
	 */
	public static final String SYNC_DATA_DIC_LOCAL_PATH = "sync.data.dic.local.path";
	
	/**
	 * 字典hdfs同步，hdfs路径
	 */
	public static final String SYNC_DATA_DIC_HDFS_PATH = "sync.data.dic.hdfs.path";
	
	public static final String HIVE_QUEUE_NAME = "hive.queue.name";
	
	/**
	 * 同步数据的时间区间
	 */
	public static final String ANALYTICS_PROFILE_DATA_UPDATE_DAY_RANGE = "analytics.profile.data.update.day.range";
	
	/**
	 * 跨域转换原offset导出文件hdfs路径
	 */
	public static final String ID_CONVERT_ID_EXPORT_SOURCE_OFFSET_HDFS = "id.convert.id.export.source.offset.hdfs";
	
	/**
	 * 跨域转换导出转换后的文件hdfs路径
	 */
	public static final String ID_CONVERT_ID_EXPORT_TARGET_FILE_HDFS = "id.convert.id.export.target.file.hdfs";
	
	/**
	 * 跨域转换idmapping文件输出hdfs路径
	 */
	public static final String ID_CONVERT_ID_MAPPING_FILE_HDFS = "id.convert.id.mapping.file.hdfs";
	
	/**
	 * 人群画像计算，导出人群数据hdfs路径
	 */
	public static final String CROWD_PORTRAIT_PRE_CALC_OUTPUT_PATH = "crowd.portrait.pre.calc.output.path";
	
	/**
	 * 人群画像计算结果hdfs路径
	 */
	public static final String CROWD_PORTRAIT_CALC_RESULT_PATH = "crowd.portrait.calc.result.path";
	
	/**
	 * 应用集群与租户对应关系
	 */
	public static final String SET_TENANT_RELATION = "set.tenant.relation";
	
	/**
	 * 应用集群与应用对应关系
	 */
	public static final String SET_APPLICATION_RELATION = "set.application.relation";
	
	/**
	 * 租户与用户对应关系
	 */
	public static final String TENANT_USER_RELATION = "tenant.user.relation";
	
	public static final String DMP_METADATA_MODEL_CROWD_ID = "dmp.metadata.model.crowd.saas";
	
	public static final String DMP_METADATA_MODEL_CROWD_OPERATOR_MODEL = "dmp.metadata.model.crowd.operator.model";
	
	public static final String DMP_METADATA_MODEL_CROWD_TAG_MODEL = "dmp.metadata.model.crowd.tag.model";
	
	public static final String DMP_METADATA_MODEL_CROWD_CROWD_MODEL = "dmp.metadata.meta.crowd.crowd.model";
	
	public static final String BITMAP_DOMAIN_DEFAULT_KEY = "bitmap.domain.default";
	
	/**
	 * dmpETL azkaban项目名称
	 */
	public static final String AZKABAN_ETL_PROJECT = "azkaban.etl.project";
	
	/**
	 * 数据源：jdbc
	 */
	public static final String DMP_METADATA_MODEL_CROWD_SERVICE = "dmp.metadata.model.crowd.service";
	
	/**
	 * MetaEtlJob同步字典租户配置信息（talking131,talking330）
	 */
	public static final String DMP_METADATA_META_ETL_JOB_TENANT_ID = "dmp.metadata.meta.etl.job.tenant.id";
	
	/**
	 * 是否允许静态标签转换tag_rule,value:off,on
	 */
	public static final String RUN_STATIC_ATTRIBUTE_TAG_TRANSFER_KEY = "run.static.attribute.tag.transfer";
	
	/**
	 * hdfs临时目录
	 */
	public static final String HDFS_DATEFILE_TMP_DIR = "datefile.tmp.dir";
	
	/**
	 * DMP 主题样式
	 * @description: 
	 * @author: cmh  2016年9月18日
	 * @version: 1.0
	 * @modify: 
	 * @Copyright: 2016, Beijing TendCloud Science & Technology Co., Ltd.
	 */
	public enum DmpThemeEnum {
		RESOURCE_PATH("dmp.theme.resource.path"),
		LOGIN_LOGO("dmp.theme.login.logo"),
		LOGIN_TEXT("dmp.theme.login.text"),
		COPY_RIGHT_TEXT("dmp.theme.copy.right.text"),
		LOGIN_BACKGROUND("dmp.theme.login.background"),
		PRODUCT_LOGO("dmp.theme.product.logo"),
		NAV_LOGO("dmp.theme.app.nav.logo"),
		MENU_LOGO("dmp.theme.app.menu.logo"),
		THEME_TYPE_IMG("1"),
		THEME_TYPE_TEXT("2");
		
		private String themeCode;

		DmpThemeEnum(String themeCode) {
			this.themeCode = themeCode;
		}

		public String themeCode() {
			return themeCode;
		}
		
	}
	
	/**
	 * 元数据字典表名称
	 */
	public static final String DMP_META_BIZ_ATTRIBUTE_VALUE_TABLE = "dmp.meta.biz.attribute.value.table";
	
	/**
	 * 同步物理表，spark元数据库编码
	 */
	public static final String DMP_META_DATA_SOURCE_CODE = "dmp.metadata.source.code";
	
	/**
	 * 元数据创建帐户时默认生成维度参数
	 */
	public static final String DMP_META_DATA_ACCOUNT_DEFAULT_DIMENSIONS = "dmp.metadata.account.default.dimensions";
	
	/**
	 * 控制DMP是否开启租户功能,0代表不开启， 1代表开启
	 */
	public static final String DMP_TENANT_ENABLE = "dmp.tenant.enable";
	
	/**
	 * 用户管家查询限制0=关闭查询所有人创建的数据，1=打开查询只能查询到本人创建的数据
	 */
	public static final String DMP_DATA_SECURITY_OWNER_PRIVACY = "dmp.dataSecurity.ownerPrivacy";
	
	/**
	 * DMP租户功能未开启时，使用的默认租户
	 */
	public static final String DMP_TENANT_DEFAULT_TENANTID = "dmp.tenant.defaultTenantId";
	
}

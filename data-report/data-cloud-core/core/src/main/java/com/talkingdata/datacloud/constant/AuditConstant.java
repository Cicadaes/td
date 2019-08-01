package com.talkingdata.datacloud.constant;

public class AuditConstant {
	public static final String SYSTEM_CODE_DMP = "DMP";
	
	/**
	 * 审计日志记录操作执行结果：success，成功,2失败
	 */
	public static final String EXEC_SUCCESS = "success";
	public static final String EXEC_ERROR = "error";
	
	/**
	 * 操作类型
	 * @description: 
	 * @author: cmh  2016年9月26日
	 * @version: 1.0
	 * @modify: 
	 * @Copyright: 2016, Beijing TendCloud Science & Technology Co., Ltd.
	 */
	public enum OperationTypeEnum {
		OPER_CREATE("create"),
		OPER_DELETE("delete"),
		OPER_QUERY("query"),
		OPER_FIND("find"),
		OPER_OTHER("other");
		
		private String type;
		
		OperationTypeEnum(String type) {
			this.type = type;
		}
		
		public String type() {
			return type;
		}
	}
	
	/**
	 * 
	 * @description: 操作目标
	 * @author: cmh  2016年9月26日
	 * @version: 1.0
	 * @modify: 
	 * @Copyright: 2015, Beijing TendCloud Science & Technology Co., Ltd.
	 */
	public enum TargetTypeEnum {
		TARGET_TAG("tag"),
		TARGET_CROWD("crowd");
		
		private String type;
		
		TargetTypeEnum(String type) {
			this.type = type;
		}
		
		public String type() {
			return type;
		}
	}
	
	public enum TargetType {
		tag,
		crowd,
		lookalikeCrowd,
		userProfile,
		crowdPortrait,
		systemTag,
		tagCategory,
		attachment,
		params,
		cacheinfo,
		dic,
		dicItem,
		ftpServerConfig,
		emailServerConfig,
		emailTemplate,
		scriptInfo,
		algorithm,
		etlErrorRecord,
//		etlErrorDetail,
		phyTable,
		phyTableColumn,
		dataSource,
		metaAccountIdType,
		metaObject,
		metaAttribute,
		metaAttributeGroup,
		cube,
//		metaIndicatorRelationship,
//		metaBackupRestores,
//		metaDataModel,
		metaData,
		schedulerTask,
		schedulerTaskLog,
		calcObjectLog,
		calcObject,
		pageConfig,
		crowdAnalysis;
	}
	
	public enum OperationType {
		create,
		update,
		delete,
		restart,
		query,
		find,
		export,
		other,
		backup,
		cleanup,
		restore,
		load,
		download,
		sync,
		stop;
	}
	
}

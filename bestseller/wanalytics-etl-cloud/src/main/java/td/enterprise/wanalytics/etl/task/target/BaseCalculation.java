package td.enterprise.wanalytics.etl.task.target;


import td.enterprise.wanalytics.etl.util.HttpUtil;

public abstract class BaseCalculation implements MBOsubtaskInterface{

	protected static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
	protected String tenantId =null;
	protected Integer projectId = null;
	protected String tableName = null;
}

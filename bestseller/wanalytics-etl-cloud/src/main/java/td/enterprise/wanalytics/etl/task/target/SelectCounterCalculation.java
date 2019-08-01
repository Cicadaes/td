package td.enterprise.wanalytics.etl.task.target;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

public class SelectCounterCalculation extends BaseCalculation{
	
	public SelectCounterCalculation(String tenantIdz, Integer projectIdz,String tableNamez) {
		this.tenantId=tenantIdz;
		this.projectId=projectIdz;
		this.tableName=tableNamez;
	}

	@Override
	public double result(String startday,String today) {
		String attendsql ="r30223=select * from enterprise."+tableName+" where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";";
		QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, attendsql);
		double result = QueryEngineResultUtil.getDefaultValue(invoke).doubleValue();
		return result;
	}

}

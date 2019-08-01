package td.enterprise.wanalytics.etl.task.target;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

public class SelectBitmapCalculation extends BaseCalculation{

	public SelectBitmapCalculation(String tenantId, Integer projectId, String string) {
		this.tenantId=tenantId;
		this.projectId=projectId;
		this.tableName=string;
	}

	@Override
	public double result(String startday, String today) {
		String attendsql ="r30223=select * from bitmap."+tableName+" where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";";
		QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, attendsql);
		double result = QueryEngineResultUtil.getDefaultValue(invoke).doubleValue();
		return result;
	}

}

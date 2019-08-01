package td.enterprise.wanalytics.etl.task.target;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.math.BigDecimal;

public class StayTimesCalculation extends BaseCalculation {

	public StayTimesCalculation(String tenantId, Integer projectId) {
		this.tenantId=tenantId;
		this.projectId=projectId;
	}

	@Override
	public double result(String startday, String today) {
		
		String sqla ="r30223=select * from enterprise.offline_stay_user_day_counter where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";";
		QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, sqla);
		double peopnumb = QueryEngineResultUtil.getDefaultValue(invoke).doubleValue();
		
		String sqlb ="r30223=select * from enterprise.offline_stay_user_duration_day_counter where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";";
		QueryEngineResult invokeb = QueryServiceUtils.invoke("post", queryUrl, sqlb);
		double times = QueryEngineResultUtil.getDefaultValue(invokeb).doubleValue();
		
		if (peopnumb==0d) {
			return 0d;
		}else{
			BigDecimal b=new BigDecimal(times/peopnumb);  
			double f1=b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
			return f1;
		}
	}

}

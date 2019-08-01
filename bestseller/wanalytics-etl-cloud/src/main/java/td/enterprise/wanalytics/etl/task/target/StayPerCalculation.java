package td.enterprise.wanalytics.etl.task.target;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.math.BigDecimal;

public class StayPerCalculation extends BaseCalculation{

	public StayPerCalculation(String tenantId, Integer projectId) {
		this.tenantId=tenantId;
		this.projectId=projectId;
	}

	@Override
	public double result(String startday, String today) {
//		String sqla ="r30223=select * from bitmap.new_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   + "r30224=select * from bitmap.stay_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   		+ "union(r30223,r30224);";
//		QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, sqla);
//		double peopnumb = QueryEngineResultUtil.getDefaultValue(invoke).doubleValue();
//
//		
//		
//		String sqlb ="r30223=select * from bitmap.old_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   + "r30224=select * from bitmap.stay_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   		+ "union(r30223,r30224);";
//		QueryEngineResult invokeb = QueryServiceUtils.invoke("post", queryUrl, sqlb);
//		double times = QueryEngineResultUtil.getDefaultValue(invokeb).doubleValue();
//
//		double fenzi = peopnumb+times;
//		
//		
//		String sqlc ="r30223=select * from bitmap.new_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   + "r30224=select * from bitmap.enter_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   		+ "union(r30223,r30224);";
//		QueryEngineResult invokec = QueryServiceUtils.invoke("post", queryUrl, sqlc);
//		double peopnumc = QueryEngineResultUtil.getDefaultValue(invokec).doubleValue();
//
//		String sqld ="r30223=select * from bitmap.old_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   + "r30224=select * from bitmap.enter_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
//				   		+ "union(r30223,r30224);";
//		QueryEngineResult invoked = QueryServiceUtils.invoke("post", queryUrl, sqld);
//		double timed = QueryEngineResultUtil.getDefaultValue(invoked).doubleValue();

		String sqld ="r30223=select * from enterprise.offline_active_user_day_counter where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";";
		QueryEngineResult invoked = QueryServiceUtils.invoke("post", queryUrl, sqld);
		double allnumb = QueryEngineResultUtil.getDefaultValue(invoked).doubleValue();
		
		String sqla ="r30223=select * from enterprise.offline_stay_user_day_counter where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";";
		QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, sqla);
		double staynumb = QueryEngineResultUtil.getDefaultValue(invoke).doubleValue();
		
		if (allnumb==0d) {
			return 0d;
		}else{
			BigDecimal b=new BigDecimal((staynumb/allnumb)*100);  
			double f1=b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
			return f1;
		}
	}

}

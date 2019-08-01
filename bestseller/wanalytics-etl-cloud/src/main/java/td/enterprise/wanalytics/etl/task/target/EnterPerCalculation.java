package td.enterprise.wanalytics.etl.task.target;

import lombok.extern.slf4j.Slf4j;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.math.BigDecimal;
@Slf4j
public class EnterPerCalculation extends BaseCalculation {

	
	public EnterPerCalculation(String tenantId, Integer projectId) {
		this.tenantId=tenantId;
		this.projectId=projectId;
	}
	@Override
	public double result(String startday, String today) {
		String sqla ="r30223=select * from bitmap.new_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
				   + "r30224=select * from bitmap.enter_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
				   		+ "union(r30223,r30224);";
		QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, sqla);
		double peopnumb = QueryEngineResultUtil.getDefaultValue(invoke).doubleValue();
		log.info(""+peopnumb);
		
		
		
		String sqlb ="r30223=select * from bitmap.old_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
				   + "r30224=select * from bitmap.enter_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
				   		+ "union(r30223,r30224);";
		QueryEngineResult invokeb = QueryServiceUtils.invoke("post", queryUrl, sqlb);
		double times = QueryEngineResultUtil.getDefaultValue(invokeb).doubleValue();
		log.info(""+times);
		
		double fenzi = peopnumb+times;
		
		
		String sqlc ="r30223=select * from bitmap.new_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today +";";
		QueryEngineResult invokec = QueryServiceUtils.invoke("post", queryUrl, sqlc);
		double peopnumc = QueryEngineResultUtil.getDefaultValue(invokec).doubleValue();
		log.info(""+peopnumc);
		
		String sqld ="r30223=select * from bitmap.old_user_day_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";";
		QueryEngineResult invoked = QueryServiceUtils.invoke("post", queryUrl, sqld);
		double timed = QueryEngineResultUtil.getDefaultValue(invoked).doubleValue();
		log.info(""+timed);
		
		double fenmu = peopnumc+timed;
		
		if (fenmu==0d) {
			return 0d;
		}else{
			BigDecimal b=new BigDecimal((fenzi/fenmu)*100);  
			double f1=b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
			return f1;
		}
	}

}

package td.enterprise.wanalytics.etl.task.target;

import lombok.extern.slf4j.Slf4j;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.math.BigDecimal;
@Slf4j
public class NewToOldCalculation extends BaseCalculation {

	public NewToOldCalculation(String tenantId, Integer projectId) {
		this.tenantId=tenantId;
		this.projectId=projectId;
	}
	

	@Override
	public double result(String startday, String today) {
		String sqla ="r30223=select * from bitmap.offline_old_user_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date < "+startday +";"
				   + "r30224=select * from bitmap.offline_old_user_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
				   		+ "rejectUnite(r30224,r30223);";
		QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, sqla);
		double fenzi = QueryEngineResultUtil.getDefaultValue(invoke).doubleValue();
		log.info(""+fenzi);
		
		
		
		String sqlb ="r30223=select * from bitmap.offline_active_user_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date between "+startday +" and "+today+";"
				   + "r30224=select * from bitmap.offline_old_user_cube where tenant_id="+tenantId+" and project_id="+projectId+" and date < "+startday +";"
				   		+ "rejectUnite(r30223,r30224);";
		QueryEngineResult invokeb = QueryServiceUtils.invoke("post", queryUrl, sqlb);
		double fenmu = QueryEngineResultUtil.getDefaultValue(invokeb).doubleValue();
		log.info(""+fenmu);
		
		
		if (fenmu==0d) {
			return 0d;
		}else{
			BigDecimal b=new BigDecimal((fenzi/fenmu)*100);  
			double f1=b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
			return f1;
		}
	}
	
}

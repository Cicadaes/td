package td.enterprise.wanalytics.etl.task.custom;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.BaseTask;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedReader;
import java.io.FileReader;

/**
 * 应用兴趣统计
 *
 */
public class TagsAppIntrestCountForCustomerGroup extends BaseTask{

	public static Logger logger = Logger.getLogger(TagsAppIntrestCountForCustomerGroup.class);

	/**
	 * demo参数：--tenantId 2000152 --projectId 1 --crowdId 1 --runDate 20160423 --cycle_statistics 30
	 * @throws Exception 
	 * @throws NumberFormatException 
	 */
	public static void main(String[] args) {
		try{

			Options options = new Options();
			options.addOption("t", "tenantId", true, "租户ID");
			options.addOption("p", "projectId", true, "项目ID");
			options.addOption("c", "crowdId", true, "客群ID");
			options.addOption("r", "runDate", true, "执行日期");
			options.addOption("c", "cycle_statistics", true, "时间间隔");
			options.addOption("s", "schedulerTaskLogId", true, "定时任务执行id");
			options.addOption("i", "inputFile", true, "输入文件");
			options.addOption("e", "execId", true, "执行id");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			tenantId = line.getOptionValue("tenantId");
			projectId = Integer.parseInt(line.getOptionValue("projectId"));
			crowdId = Integer.parseInt(line.getOptionValue("crowdId") );
			runDate = line.getOptionValue("runDate");
			cycle_statistics = line.getOptionValue("cycle_statistics");
			startDate = DateUtil.getStartDateBynum(runDate, Integer.parseInt(cycle_statistics));
			endDate = DateUtil.getEndDateBynum(runDate);
			azkabanExecId = line.getOptionValue("schedulerTaskLogId");
			String intputfilePath = line.getOptionValue("inputFile");
			logger.info("intputfilePath is " + intputfilePath);
			String execId = line.getOptionValue("execId");
			Boolean execute = execute (intputfilePath,tenantId,projectId,crowdId,startDate,endDate,runDate,cycle_statistics,execId);
			if (execute) {
				System.exit(0);
			}else{
				System.exit(1);
			}
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}

	}
	

    public static Boolean execute(String inputFilePath,String tenantId, Integer projectId, Integer crowdId, String startDate, String endDate, String runDate , String cycle_statistics, String execId) {
    	logger.info("TagsAppIntrestCountForCustomerGroup start ...");
    	
	    BufferedReader br = null;
		FileReader fr = null;
        try {
			fr = new FileReader(inputFilePath);
        	br = new BufferedReader(fr);
             String line = br.readLine();
             while ((line = br.readLine()) != null && line.length() > 0){
	        	String[] params = line.split(",");
	        	String tagCode =  params[0];   //被
	        	String metricValue = params[1];
         		String sql="insert into TD_BEHAVIOR_CROWD_RESULT "
         				+ "(tenant_id,project_id,crowd_id,run_date,tag_code,tag_name,metric_value,cycle_statistics,start_date,end_date,exec_id)"
         				+ " values('"+tenantId+"',"+projectId+","+crowdId+",'"+runDate+"','"+tagCode+"','"+tagCode+"','"+metricValue+"','"+cycle_statistics+"','"+startDate+"','"+endDate+"',"+ execId +")";

				 QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
         		
             }

        } catch (Exception e){
            logger.error("task failed !",e);
            return false;
        } finally {
           FileUtil.close(br,fr);
        }
        logger.info("TagsAppIntrestCountForCustomerGroup end ...");
        return true;
    }
    
  

    
}

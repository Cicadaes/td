package td.enterprise.wanalytics.etl.task.custom;


import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.QueryUtils;

/**
 * 更新lookalike 任务表状态
 * @author lijunmin
 *
 */
public class UpdateLookalikeCrowdStatusTask {
	
	public static Logger logger = Logger.getLogger(UpdateLookalikeCrowdStatusTask.class);
	
	public static void main(String[] args)  {
		try{
			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("taskId", "taskId", true, "任务Id");
			options.addOption("calcStatus", "calcStatus", true, "计算状态");//参考ReportConstants.LookalikeCrowd
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			int taskId = Integer.parseInt(line.getOptionValue("taskId"));
			int calcStatus = Integer.parseInt(line.getOptionValue("calcStatus"));
			Boolean r = execute(taskId,calcStatus);
			long end = System.currentTimeMillis();
			logger.info("UpdateLookalikeCrowdStatusTask Used times :" + (end - begin)/1000 + " seconds");
		 }catch(Exception e){
			 System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
		 }
		 System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	
	/**
	 * 
	 * @param taskId
	 * @param calcStatus
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public static Boolean execute(int taskId,int calcStatus) throws Exception {
		String sql = "update TD_LOOKALIKE_CROWD set calc_status=" + calcStatus + " where id=" + taskId;
		QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
	    return false;
	}

}

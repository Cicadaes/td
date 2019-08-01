package td.enterprise.wanalytics.etl.task.azkaban;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.QueryUtils;

public class DeleteAzkabScheduleTask {
	
	public static Logger logger = Logger.getLogger(DeleteAzkabScheduleTask.class);
	
	public static void main(String[] args) {
		try{

			Options options = new Options();
			options.addOption("df", "deleteFile", true, "写有删除表名的文件名");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);

			String configFileName = line.getOptionValue("deleteFile");

			//test data
			configFileName = "active_executing_flows,active_sla,execution_flows,execution_jobs,execution_logs,project_events,project_files,project_flows,project_permissions,project_properties,project_versions,projects,properties,schedules,triggers";

			execute(configFileName);
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
	}
	
	public static void execute(String configFileName) throws Exception{
//		List<String> tableNames = readFileByLines(configFileName);
		String[] tableNames = configFileName.split(",");
		for(String tableName:tableNames){
			getDeleteAzkabanTables(tableName);
		}
	}

	private static void getDeleteAzkabanTables(String tableName){
		String sql = "delete from "+ tableName;
		logger.info(sql);
		QueryUtils.execute(sql, QueryUtils.AZKABAN_DB);
	}

}

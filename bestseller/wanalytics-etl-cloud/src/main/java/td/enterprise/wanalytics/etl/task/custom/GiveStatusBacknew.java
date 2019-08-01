package td.enterprise.wanalytics.etl.task.custom;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.util.QueryUtils;

public class GiveStatusBacknew {
	
	public static Logger logger = Logger.getLogger(GiveStatusBacknew.class);


	public static void main(String[] args) {
		String taskId = null;
		String status = null;
		//==============================================读取参数
		Options options = new Options();
		options.addOption("t", "taskId", true, "taskId");
		options.addOption("s", "status", true, "status");

		CommandLineParser parser = new PosixParser();
		CommandLine lines = null;
		try {
			lines = parser.parse(options, args);
			taskId = lines.getOptionValue("taskId");
			status = lines.getOptionValue("status");

		} catch (ParseException e1) {
			logger.error("参数异常 " );
			System.exit(1);
		}
		
		execute(taskId,status);
	}

	private static void execute(String exec_id, String status) {
		String sql = "update TD_CUSTOM_CROWD set calc_status="+ status + " where exec_id=" + exec_id;
		QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
	}
}

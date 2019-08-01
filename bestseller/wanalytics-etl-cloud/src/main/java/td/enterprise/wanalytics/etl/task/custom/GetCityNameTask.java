package td.enterprise.wanalytics.etl.task.custom;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.util.Map;

public class GetCityNameTask {
	
	public static Logger logger = Logger.getLogger(GetCityNameTask.class);


	public static void main(String[] args){
		try{
			int projectId = 0;
			Options options = new Options();
			options.addOption("t", "projectId", true, "projectId");

			CommandLineParser parser = new PosixParser();
			CommandLine lines = null;
			lines = parser.parse(options, args);
			projectId = Integer.parseInt(lines.getOptionValue("projectId"));
			execute(projectId);
		}catch (Exception e){
			logger.error("SendCollectorDataTask",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
	}

	private static void execute(int projectId) throws  Exception{
		String sql = "select city from TD_PROJECT where id=" + projectId;
		Map<String,Object> map = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);
		if(map != null && !map.isEmpty()){
			System.out.print(map.get("city").toString());
		}else{
          throw new  Exception("projectId=" + projectId + " 城市为空！");
		}
	}
}

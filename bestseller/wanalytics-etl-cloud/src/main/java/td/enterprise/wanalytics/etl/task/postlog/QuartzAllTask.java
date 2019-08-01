package td.enterprise.wanalytics.etl.task.postlog;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.QuartzUtil;

public class QuartzAllTask {
	
	private static final Logger logger = Logger.getLogger(QuartzAllTask.class);
	
	public static void main(String[] args) {
		try{
			Options options = new Options();
			options.addOption("c", "configInterval", true, "内部接收配置更新数据间隔");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			int configInterval = Integer.parseInt(line.getOptionValue("configInterval")==null?"600":line.getOptionValue("configInterval"));


			String quartzTime = QuartzUtil.getQuartzTime(configInterval);
			int days = configInterval / (60 * 60 * 24);

			try {
				//更新配置
				String configName = "receiveConfig";
				QuartzConfigJob configJob = new QuartzConfigJob();

				if(days<=31){
					QuartzUtil.addConfigJob(configName, configJob, quartzTime, false);
					logger.info("---------------------addConfigJob:" + quartzTime);
				}else{
					QuartzUtil.addConfigJob(configName, configJob, "0 0 0 31 * ?", false);
					logger.info("---------------------addConfigJob:" + "0 0 0 31 * ?");
				}

			}  catch (Exception e) {
				e.printStackTrace();
			}
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}

	}
}

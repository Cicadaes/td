package td.enterprise.wanalytics.etl.task.postlog;

import org.apache.log4j.Logger;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;

public class QuartzSendJob implements StatefulJob {  
	
	public static Logger logger = Logger.getLogger(QuartzConfigJob.class);

    public void execute(JobExecutionContext context) throws JobExecutionException {
    	
    	JobDataMap data = context.getJobDetail().getJobDataMap();
    	ReceiveConfig tenantConfig = (ReceiveConfig) data.get("tenantConfig");
    	String groupId = (String) data.get("groupId");
    	
    	logger.info(tenantConfig.getKafkaTopic() + " ： start......");
    	new SendFilterLogTask().execute(tenantConfig, groupId);
    }
  
}  
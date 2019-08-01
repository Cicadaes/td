package td.enterprise.wanalytics.etl.task.postlog;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;
import td.enterprise.wanalytics.etl.task.postlog.bean.BaseReceiveConfigTask;
import td.enterprise.wanalytics.etl.util.MD5Util;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.QuartzUtil;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

public class QuartzConfigJob extends BaseReceiveConfigTask implements StatefulJob {
	
	public static Logger logger = Logger.getLogger(QuartzConfigJob.class);
	private static Map<String, ReceiveConfig> tenantConfigs = new ConcurrentHashMap<String, ReceiveConfig>();

	static SqlSession sqlSession = null;

    public void execute(JobExecutionContext context) throws JobExecutionException {
    	
    	JobDataMap data = context.getJobDetail().getJobDataMap();
    	boolean isTenant = (boolean) data.get("isTenant");
    	
    	//得到最新配置
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		sqlSession = sqlSessionFactory.openSession();
    	List<ReceiveConfig> tenantList = new CreateReceiveConfigFileTask().execute(sqlSession, isTenant);

    	//按照配置增删改所有任务
		for(ReceiveConfig tenantConfig : tenantList){
			if(tenantConfig.getId()==null || tenantConfig.getId().equals("") || tenantConfig.getUniqueId()==null || tenantConfig.getUniqueId().equals("")){
				return;
			}
			String id = tenantConfig.getUniqueId() + tenantConfig.getId();
			
			String urls = tenantConfig.getUrls()==null?"":tenantConfig.getUrls();
			String[] urlArr = urls.split(",");
			for(String url : urlArr){
				if(url!=null && !url.equals("") && id.indexOf(".")<0 && id.indexOf("_")<0 && id.indexOf("-")<0){
					//do not contains a character other than ASCII alphanumerics, '.', '_' and '-'
					String groupId = id + MD5Util.MD5(url);
					
					ReceiveConfig newTenantConfig = new ReceiveConfig();
					newTenantConfig.setId(tenantConfig.getId());
					newTenantConfig.setUniqueId(tenantConfig.getUniqueId());
					newTenantConfig.setUrls("");//排除顺序影响
					newTenantConfig.setReceiveMode(tenantConfig.getReceiveMode());
					newTenantConfig.setReceiveInterval(tenantConfig.getReceiveInterval());
					newTenantConfig.setRetryTimes(tenantConfig.getRetryTimes());
					newTenantConfig.setRetryInterval(tenantConfig.getRetryInterval());
					newTenantConfig.setTimeUnit(tenantConfig.getTimeUnit());
					newTenantConfig.setFilterMac(tenantConfig.getFilterMac());
					newTenantConfig.setFilterSignal(tenantConfig.getFilterSignal());
					newTenantConfig.setStatus(tenantConfig.getStatus());
					newTenantConfig.setAlarmThreshold(tenantConfig.getAlarmThreshold());
					newTenantConfig.setLocalThreshold(tenantConfig.getLocalThreshold());
					newTenantConfig.setMessageNumber(tenantConfig.getMessageNumber());
					newTenantConfig.setKafkaTopic(tenantConfig.getKafkaTopic());
					newTenantConfig.setSftpPwd(tenantConfig.getSftpPwd());
					newTenantConfig.setIsTenant((tenantConfig.getIsTenant()));
					newTenantConfig.setLabel(tenantConfig.getLabel());
					newTenantConfig.setUrl(url);
		
					String sendName = groupId + "-sendFilterLog";
					
					ReceiveConfig oldTenantConfig = tenantConfigs.get(sendName);
					if(oldTenantConfig==null || !newTenantConfig.compareTo(oldTenantConfig)){
						try {
							//移除原任务
		    				QuartzUtil.removeJob(sendName);
		    				logger.info("---------------------removeSendJob:" + sendName);
		    			} catch (Exception e) {
		    				e.printStackTrace();
		    			}
						tenantConfigs.put(sendName, newTenantConfig);
						
						//添加新或更新任务
						try {
							QuartzSendJob sendJob = new QuartzSendJob();
							
							Integer receiveMode = newTenantConfig.getReceiveMode();
							if(receiveMode==0){//实时
								//格式: [秒] [分] [小时] [日] [月] [周] ([年])
								QuartzUtil.addTenantJob(sendName, sendJob, "0/1 * * * * ?", isTenant, newTenantConfig, groupId);
			    				logger.info("---------------------addSendJob:"+"0/1 * * * * ?");
		
							}else{
								int receiveInterval = newTenantConfig.getReceiveInterval();
								String quartzTime = QuartzUtil.getQuartzTime(receiveInterval);
								int days = receiveInterval / (60 * 60 * 24);
								//最多支持一个月
								if(days<=31){
									QuartzUtil.addTenantJob(sendName, sendJob, quartzTime, isTenant, newTenantConfig, groupId);
				    				logger.info("---------------------addSendJob:" + quartzTime);
								}else{
									QuartzUtil.addTenantJob(sendName, sendJob, "0 0 0 31 * ?", isTenant, newTenantConfig, groupId);
				    				logger.info("---------------------addSendJob:" + "0 0 0 31 * ?");
								}
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
		
		//移除数据库中被删除的任务
		Iterator<Entry<String, ReceiveConfig>> tenantConfigIterator = tenantConfigs.entrySet().iterator();
		while (tenantConfigIterator.hasNext()) {
			@SuppressWarnings("rawtypes")
			Entry entry = tenantConfigIterator.next();
			String oldSendName = (String) entry.getKey();
			boolean delFlag = true;
			for(ReceiveConfig tenantConfig : tenantList){
				String id = tenantConfig.getId() + "";
				String urls = tenantConfig.getUrls()==null?"":tenantConfig.getUrls();
				String[] urlArr = urls.split(",");
				for(String url : urlArr){
					String groupId = id + MD5Util.MD5(url);
					String sendName = groupId + "-sendFilterLog";
					if(sendName.equals(oldSendName)){
						delFlag = false;
					}
				}
			}
			if (delFlag) {
				try {
					//删除任务
    				QuartzUtil.removeJob(oldSendName);
    				logger.info("---------------------removeSendJob:" + oldSendName);
    			} catch (Exception e) {
    				e.printStackTrace();
    			}
				tenantConfigs.remove(oldSendName);
			}
		}
    }

}
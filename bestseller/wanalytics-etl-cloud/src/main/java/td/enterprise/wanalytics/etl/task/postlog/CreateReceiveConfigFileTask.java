package td.enterprise.wanalytics.etl.task.postlog;

import org.apache.commons.cli.ParseException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.service.ReceiveConfigService;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.postlog.bean.BaseReceiveConfigTask;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.ArrayList;
import java.util.List;

public class CreateReceiveConfigFileTask extends BaseReceiveConfigTask {
	public static Logger logger = Logger.getLogger(CreateReceiveConfigFileTask.class);
	static SqlSession sqlSession = null;

	public static void main(String[] args) {
		try{
			SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
			sqlSession = sqlSessionFactory.openSession();

			CreateReceiveConfigFileTask cr = new CreateReceiveConfigFileTask();
			cr.execute(sqlSession, true);

			logger.info("CreateReceiveConfigFileTask.. 生成租户接受配置文件完毕");
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
	}

	public List<ReceiveConfig> execute(SqlSession sqlSession, boolean isTenant) {
		ReceiveConfig receiveConfigPage = new ReceiveConfig();
		receiveConfigPage.setStatus(1);
		List<ReceiveConfig> queryByAllList = ReceiveConfigService.queryByAllList(sqlSession, receiveConfigPage);
		List<ReceiveConfig> receiveConfigList = new ArrayList<ReceiveConfig>();
		try {
			for(ReceiveConfig receiveConfig:queryByAllList){
				if(receiveConfig!=null){
					if((receiveConfig.getIsTenant()!=null && receiveConfig.getIsTenant()==1)==isTenant){
						Integer timeUnit = receiveConfig.getTimeUnit();
						if (timeUnit!=null) {
							Integer receiveInterval = receiveConfig.getReceiveInterval();
							Integer retryInterval = receiveConfig.getRetryInterval();
							long unit = 1;
							//0=秒，1=分钟，2=小时，3=天
							switch(timeUnit){
								case 1:
									unit=60l;
									break;
								case 2:
									unit=60*60l;
									break;
								case 3:
									unit=60*60*24l;
									break;
							}
							if (receiveInterval!=null) {
								receiveInterval=(int) (receiveInterval*unit);
							}
							if (retryInterval!=null) {
								retryInterval=(int) (retryInterval*unit);
							}
							receiveConfig.setReceiveInterval(receiveInterval);
							receiveConfig.setRetryInterval(retryInterval);
						}
						receiveConfigList.add(receiveConfig);
					}
				}
			}
		} catch (Exception e) {
			logger.error("CreateReceiveConfigFileTask查询异常",e);
		} 
		return receiveConfigList;
	}

}

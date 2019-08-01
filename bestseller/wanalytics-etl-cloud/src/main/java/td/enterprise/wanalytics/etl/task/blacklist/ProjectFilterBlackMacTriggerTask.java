package td.enterprise.wanalytics.etl.task.blacklist;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.lang.StringUtils;
import org.apache.http.impl.client.HttpClients;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import td.enterprise.entity.ProjectParam;
import td.enterprise.service.ProjectParamService;
import td.enterprise.wanalytics.etl.bean.FilterMacConfig;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.JsonUtils;


/**
 * 每天调用项目过滤黑名单功能
 * @author junmin.li
 *
 */
public class ProjectFilterBlackMacTriggerTask {
	
	private static final Logger logger = Logger.getLogger(ProjectFilterBlackMacTriggerTask.class);
	
	//全局配置
	private static FilterMacConfig filterMacConfig = null ;

    public static FilterMacConfig getProjectConfig(SqlSession sqlSession, int projectId) throws Exception {
    	FilterMacConfig  config = null;
    	if( null == filterMacConfig){
    		//读取配置
        	String configStr = HttpUtil.getParamFromConfigServer("filter.mac.config");
    		filterMacConfig = JsonUtils.jsonToObject(configStr,FilterMacConfig.class);
    	}
    	
    	ProjectParam page = new ProjectParam();
    	page.setProjectId(projectId);
		page.setKey(WifipixTaskConstant.ProjectParamKey.FILTER_MAC_CONFIG);
		ProjectParam param = ProjectParamService.queryBySingle(sqlSession, page);
        if(null != param && StringUtils.isNotBlank(param.getValue())){
        	config = JsonUtils.jsonToObject(param.getValue(),FilterMacConfig.class);
        }
        if(config != null){
        	return config;
        }
    	return filterMacConfig;
    }
}

package td.enterprise.wanalytics.processor.cache;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.CacheDaoImpl;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.common.QueryBean;
import td.enterprise.wanalytics.common.QueryResult;
import td.enterprise.wanalytics.processor.bean.InstallInfo;
import td.enterprise.wanalytics.processor.bean.MacCompany;
import td.enterprise.wanalytics.processor.bean.Project;
import td.enterprise.wanalytics.processor.utils.DateTimeUtil;
import td.enterprise.wanalytics.processor.utils.RedisClient;

@SuppressWarnings("unchecked")
public class CacheFactory {

	public static final Logger logger = LoggerFactory.getLogger(CacheFactory.class);

	private static HashMap<String, Cache> mappingCache;

	public static Integer RSSI = null; //全局探针信号强度
	
	public static Integer VISIT_MINUTES = null; //全局项目有效停留时长

	public static Integer PROJECT_STAY_MINUTES = null; //案场全局停留时长

	public static Integer PROJECT_SESSION_TIMEOUT_SECONDS = null; //房间停留时长

	public static Integer PROJECT_MAX_DURATION = null ; //项目最长停留时长，默认90分钟
	
	public static Integer FRONT_RSSI = null; //全局店前信号强度

	static {
		ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("datafilter-cache-spring-beans.xml");
		mappingCache = applicationContext.getBean("mappingCache", HashMap.class);
		applicationContext.close();
	}

	public static HashMap<String, Cache> getMappingCache() {
		return mappingCache;
	}

	public static void setMappingCache(HashMap<String, Cache> mappingCache) {
		CacheFactory.mappingCache = mappingCache;
	}

	/**
	 * 项目缓存
	 * @return
	 */
	public static Cache getProjectCache() {
		return mappingCache.get("ProjectCache");
	}


	/**
	 * 传感器缓存
	 * @return
	 */
	public static Cache getSensorCache() {
		return mappingCache.get("SensorCache");
	}


	/**
	 * 租户用户缓存
	 * @return
	 */
	public static Cache getTenantUserCache() {
		return mappingCache.get("TenantUserCache");
	}
	
	/**
	 * 店前用户缓存
	 * @return
	 */
	public static Cache getFrontUserCache() {
		return mappingCache.get("FrontUserCache");
	}

	/**
	 * 项目用户缓存
	 * @return
	 */
	public static Cache getProjectUserCache() {
		return mappingCache.get("ProjectUserCache");
	}

	/**
	 * Session缓存
	 * @return
	 */
	public static Cache getSessionCache() {
		return mappingCache.get("SessionCache");
	}

	/**
	 * Cube缓存
	 * @return
	 */
	public static Cache getCubeCache() {
		return mappingCache.get("CubeCache");
	}

	/**
	 * BlackListMac缓存
	 * @return
	 */
	public static Cache getBlackListMacCache() {
		return mappingCache.get("BlackListMacCache");
	}
	
	/**
	 * 非BlackListMac缓存
	 * @return
	 */
	public static Cache getNonBlackListMacCache() {
		return mappingCache.get("NonBlackListMacCache");
	}

	/**
	 * 所有探针缓存
	 * @return
	 */
	public static Cache getAllSensorCache() {
		return mappingCache.get("AllSensorCache");
	}

	/**
	 * 需要计算店组的缓存
	 * @return
	 */
	public static Cache getProjectGroupComputeCache() {
		return mappingCache.get("ProjectGroupComputeCache");
	}
	
	public static Cache getProjectMacDateCache() {
        return mappingCache.get("ProjectMacDateCache");
    }


	/**
	 * @param dao
	 * @param sensorMac
	 * @return
	 */
	public static Element createSensorCahce(CacheDaoImpl dao, Cache cache, String sensorMac) {
		QueryResult qr = dao.getSomeThings(createSensorQueryBean(sensorMac));
		if (Utils.isNotEmpty(qr)) {
			Object[] objects = qr.get(0);
			InstallInfo sensorInstallInfo = new InstallInfo();
			sensorInstallInfo.setRelatedAttribute((String) objects[0]);
			sensorInstallInfo.setProjectId((Long) objects[1]);
			sensorInstallInfo.setProjectPlaceId((Long) objects[2]);
			sensorInstallInfo.setTenantId((String) objects[3]);
			sensorInstallInfo.setRelatedId((Long)objects[4]);
			sensorInstallInfo.setStatus((Integer)objects[5]);

			Long sensorId = (Long)objects[4];
			Long projectId = (Long) objects[1];
			
			String shopSize = objects[6] == null ? "" : (String)objects[6];

			//先查询全局信号强度
			if(null == RSSI){
				RSSI = getDefaultRSSI();
				logger.info("全局默认信号强度:" + RSSI);
			}
			sensorInstallInfo.setRssi(RSSI);
			
			if (StringUtils.isNotBlank(shopSize) && !"null".equalsIgnoreCase(shopSize)) {
				if ("L".equals(shopSize)) {
					sensorInstallInfo.setRssi(getDefaultLargeRSSI());
				} else if ("M".equals(shopSize)) {
					sensorInstallInfo.setRssi(getDefaultMiddleRSSI());
				} else if ("S".equals(shopSize)) {
					sensorInstallInfo.setRssi(getDefaultSmallRSSI());
				}
			}

			//查询项目信号强度
			String projectRssi = getProjectRSSI(projectId);
			if (StringUtils.isNotBlank(projectRssi) && !"null".equalsIgnoreCase(projectRssi)) {
				try{
					sensorInstallInfo.setRssi(Integer.parseInt(projectRssi.trim()));
				}catch(Exception e){
					e.printStackTrace();
				}
			}

			//查询探针信号强度
			Map<String,Object> map = createSenorParamQueryBean(sensorId);
			if (map != null) {
				String minRSSI  = (String)map.get("min_rssi");
				if(StringUtils.isNotBlank(minRSSI)){
					try{
						sensorInstallInfo.setRssi(Integer.parseInt(minRSSI.trim()));
					}catch(Exception e){
						e.printStackTrace();
					}
				}
			}
			
			//先查询全局信号强度
			if(null == FRONT_RSSI){
				FRONT_RSSI = getDefaultBeforeRSSI();
				logger.info("全局默认店前信号强度:" + FRONT_RSSI);
			}

			sensorInstallInfo.setFrontRSSI(FRONT_RSSI);
			
			//查询项目信号强度
			String projectFrontRssi = getProjectFrontRSSI(projectId);
			if (StringUtils.isNotBlank(projectFrontRssi) && !"null".equalsIgnoreCase(projectFrontRssi)) {
				try{
					sensorInstallInfo.setFrontRSSI(Integer.parseInt(projectFrontRssi.trim()));
				}catch(Exception e){
					e.printStackTrace();
				}
			}

			Element e = new Element(sensorMac, sensorInstallInfo);
			cache.put(e);
			return e;
		}
		return null;
	}

	private static QueryBean createSensorQueryBean(String sensorMac) {
		QueryBean queryBean = new QueryBean();
		queryBean.setDbName(QueryBean.DBName.tenddata.getDBName());
		queryBean.setTableName("TD_INSTALL_INFO");
		queryBean.setResultColumn(new String[] {  "related_attribute", "project_id", "project_place_id", "tenant_id", "related_id","status","shop_size" });
		queryBean.setWhereColumns(new String[] {"related_attribute","status","related_type"});
		//查询有效的探针
		Object [] values = new Object [] {sensorMac,1,1};
		queryBean.setWhereValues(values);
		return queryBean;
	}

	/**
	 *
	 * @param dao
	 * @param cache
	 * @param projectId
	 * @return
	 */
	public static  Element createProjectCache(CacheDaoImpl dao, Cache cache, Long projectId) {
		QueryResult qr = dao.getSomeThings(createProjectQueryBean(projectId));
		if (Utils.isNotEmpty(qr)) {
			Object[] objects = qr.get(0);
			Project project = new Project();
			project.setId((Long) objects[0]);
			project.setProjectType((Integer) objects[1]);
			project.setOpeningTime((String) objects[2]);
			project.setClosingTime((String) objects[3]);
			project.setTenantId((String) objects[4]);
			project.setProjectName((String) objects[5]);
			project.setStatus((Integer)objects[6]);
			project.setProjectNum((String) objects[7]);

			//处理营业开始时间和结束时间前2个小时
			String openingTime = project.getOpeningTime();
			String closingTime = project.getClosingTime();
			try{
				String filterOpeningTime = null ;
				if(openingTime != null && openingTime.compareTo("02:00") > 0 && !openingTime.equals("undefined")){
					String [] openingTimeArray = openingTime.split(":");
					filterOpeningTime = DateTimeUtil.getHourTime(Integer.parseInt(openingTimeArray[0]), Integer.parseInt(openingTimeArray[1]), -2);
				}

				String filterClosingTime = null ;
				if(closingTime != null && closingTime.compareTo("22:00") < 0 && !openingTime.equals("undefined")){
					String [] closingTimeArray = closingTime.split(":");
					filterClosingTime = DateTimeUtil.getHourTime(Integer.parseInt(closingTimeArray[0]), Integer.parseInt(closingTimeArray[1]), 2);
				}

				logger.info("项目Id：" + projectId + " 过滤营业开始时间为00:00到" + filterOpeningTime + "和" + filterClosingTime + "到23:59点");
				project.setFilterOpeningTime(filterOpeningTime);
				project.setFilterClosingTime(filterClosingTime);
			}catch(Exception e){
				e.printStackTrace();
			}

			//项目有效停留
			if(null == VISIT_MINUTES){
				VISIT_MINUTES = getDefaultVisitMinutes();
				logger.info("全局默认到访时长：" + VISIT_MINUTES);
			}

			//获取项目参观时间
			if(null != VISIT_MINUTES ){
				project.setVisitMinutes(VISIT_MINUTES);
			}

			String visitMinutes = createProjectVisitMinutesBean(projectId);
			if (StringUtils.isNotEmpty(visitMinutes) && !"null".equalsIgnoreCase(visitMinutes)) {
				try{
					project.setVisitMinutes(Integer.parseInt(visitMinutes));
				}catch(Exception e){
					e.printStackTrace();
				}
			}

			logger.info("项目Id：" + projectId + " 有效到访时间：" + project.getVisitMinutes());
			//项目停留
			if(null == PROJECT_STAY_MINUTES){
				PROJECT_STAY_MINUTES = getProjectDefaultStayMinutes();
				logger.info("全局默认案场停留时长：" + PROJECT_STAY_MINUTES);
			}

			//获取项目停留时间
			if(null != PROJECT_STAY_MINUTES ){
				project.setStayMinutes(PROJECT_STAY_MINUTES);
			}

			String stayMinutes = createProjectStayMinutesBean(projectId);
			if (StringUtils.isNotEmpty(stayMinutes) && !"null".equalsIgnoreCase(stayMinutes)) {
				try{
					project.setStayMinutes(Integer.parseInt(stayMinutes));
				}catch(Exception e){
					e.printStackTrace();
				}
			}
			
			logger.info("项目Id：" + projectId + " 停留时间：" + project.getStayMinutes());
			//获取全局项目停留时长
			if(null == PROJECT_MAX_DURATION){
				PROJECT_MAX_DURATION = getDefaultMaxDuration();
			}

			//获取要过滤的项目用户最长停留时长
			if(null != PROJECT_MAX_DURATION){
				project.setMaxDuration(PROJECT_MAX_DURATION);
			}

			//获取项目配置的最长停留时长
			String maxDuration = createProjectMaxDurationBean(projectId);
			if (StringUtils.isNotEmpty(maxDuration) && !"null".equalsIgnoreCase(maxDuration)) {
				try{
					project.setMaxDuration(Integer.parseInt(maxDuration));
				}catch(Exception e){
					e.printStackTrace();
				}
			}

			logger.info("项目Id：" + projectId + " 过滤超过最长停留时长：" + project.getMaxDuration());


			//项目停留间隔
			//全局默认TD_PARAM
			Integer projectSessionTimeoutSeconds = null;

			if(null == PROJECT_SESSION_TIMEOUT_SECONDS){
				PROJECT_SESSION_TIMEOUT_SECONDS = getProjectSessionTimeoutSeconds();
				logger.info("全局默认项目停留间隔:" + PROJECT_SESSION_TIMEOUT_SECONDS);
			}
			if(null != PROJECT_SESSION_TIMEOUT_SECONDS ){
				projectSessionTimeoutSeconds = PROJECT_SESSION_TIMEOUT_SECONDS;
			}

			//查询TD_PROJECT_PARAM
			String projectSessionTimeoutStr = createProjectSessionTimeoutSeconds(projectId);
			if(projectSessionTimeoutStr !=null && StringUtils.isNotBlank(projectSessionTimeoutStr) && !"null".equalsIgnoreCase(projectSessionTimeoutStr)){
				projectSessionTimeoutSeconds = Integer.parseInt(projectSessionTimeoutStr);
			}

			//设置项目Timeout
			if(null != projectSessionTimeoutSeconds){
				try{
					project.setSessionTimeoutSeconds(projectSessionTimeoutSeconds * 1000 * 60);
				}catch(Exception e){
					e.printStackTrace();
				}
			}

			logger.info("项目ID:" + projectId + " session时间间隔是:" +projectSessionTimeoutSeconds + "分钟" );
			
			// 高活跃客流时间开始
			String activeHighBegin = createProjectActiveHighBegin(projectId);
			if (StringUtils.isNotEmpty(activeHighBegin) && !"null".equalsIgnoreCase(activeHighBegin)) {
				try{
					project.setActiveHighBegin(Integer.parseInt(activeHighBegin));
				}catch(Exception e){
					e.printStackTrace();
				}
			} else {
				project.setActiveHighBegin(getDefaultActiveHighBegin());
			}
			
			// 高活跃客流时间结束
			String activeHighEnd = createProjectActiveHighEnd(projectId);
			if (StringUtils.isNotEmpty(activeHighEnd) && !"null".equalsIgnoreCase(activeHighEnd)) {
				try{
					project.setActiveHighEnd(Integer.parseInt(activeHighEnd));
				}catch(Exception e){
					e.printStackTrace();
				}
			} else {
				project.setActiveHighEnd(getDefaultActiveHighEnd());
			}
			
			// 中活跃客流时间开始
			String activeMediumBegin = createProjectActiveMediumBegin(projectId);
			if (StringUtils.isNotEmpty(activeMediumBegin) && !"null".equalsIgnoreCase(activeMediumBegin)) {
				try{
					project.setActiveMediumBegin(Integer.parseInt(activeMediumBegin));
				}catch(Exception e){
					e.printStackTrace();
				}
			} else {
				project.setActiveMediumBegin(getDefaultActiveMediumBegin());
			}
			
			// 中活跃客流时间结束
			String activeMediumEnd = createProjectActiveMediumEnd(projectId);
			if (StringUtils.isNotEmpty(activeMediumEnd) && !"null".equalsIgnoreCase(activeMediumEnd)) {
				try{
					project.setActiveMediumEnd(Integer.parseInt(activeMediumEnd));
				}catch(Exception e){
					e.printStackTrace();
				}
			} else {
				project.setActiveMediumEnd(getDefaultActiveMediumEnd());
			}
			
			// 低活跃客流时间开始
			String activeLowBegin = createProjectActiveLowBegin(projectId);
			if (StringUtils.isNotEmpty(activeLowBegin) && !"null".equalsIgnoreCase(activeLowBegin)) {
				try{
					project.setActiveLowBegin(Integer.parseInt(activeLowBegin));
				}catch(Exception e){
					e.printStackTrace();
				}
			} else {
				project.setActiveLowBegin(getDefaultActiveLowBegin());
			}
			
			// 低活跃客流时间结束
			String activeLowEnd = createProjectActiveLowEnd(projectId);
			if (StringUtils.isNotEmpty(activeLowEnd) && !"null".equalsIgnoreCase(activeLowEnd)) {
				try{
					project.setActiveLowEnd(Integer.parseInt(activeLowEnd));
				}catch(Exception e){
					e.printStackTrace();
				}
			} else {
				project.setActiveLowEnd(getDefaultActiveLowEnd());
			}
			
			// 沉睡客流时间
			String activeSleep = createProjectActiveSleep(projectId);
			if (StringUtils.isNotEmpty(activeSleep) && !"null".equalsIgnoreCase(activeSleep)) {
				try{
					project.setActiveSleep(Integer.parseInt(activeSleep));
				}catch(Exception e){
					e.printStackTrace();
				}
			} else {
				project.setActiveSleep(getDefaultActiveSleep());
			}

			Element e = new Element(projectId, project);
			cache.put(e);
			return e;
		}
		return null;
	}

	private static Map<String,Object> createSenorParamQueryBean(Long sensorId) {
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select min_rssi  from TD_SENSOR where id = " + sensorId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			return list.get(0);
		}
		return null;
	}

	/**
	 * 获取店铺默认信号强度
	 * @param projectId
	 * @return
	 */
	private static String getProjectRSSI(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select strength_crowd_come from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("strength_crowd_come") + "";
		}
		return value;
	}
	
	/**
	 * 获取店铺店前客流设置
	 * @param projectId
	 * @return
	 */
	private static String getProjectFrontRSSI(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select strength_crowd_before from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("strength_crowd_before") + "";
		}
		return value;
	}

	/**
	 * 获取店铺到访时长
	 * @param projectId
	 * @return
	 */
	private static String createProjectVisitMinutesBean(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_come from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_come") + "";
		}
		return value;
	}

	/**
	 * 获取店铺停留时长
	 * @param projectId
	 * @return
	 */
	private static String createProjectStayMinutesBean(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_stay from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_stay") + "";
		}
		return value;
	}
	
	/**
	 * 获取高活跃客流区间开始时间
	 * @param projectId
	 * @return
	 */
	private static String createProjectActiveHighBegin(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_active_high_begin from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_active_high_begin") + "";
		}
		return value;
	}
	
	/**
	 * 获取高活跃客流区间结束时间
	 * @param projectId
	 * @return
	 */
	private static String createProjectActiveHighEnd(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_active_high_end from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_active_high_end") + "";
		}
		return value;
	}
	
	/**
	 * 获取中活跃客流区间开始
	 * @param projectId
	 * @return
	 */
	private static String createProjectActiveMediumBegin(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_active_medium_begin from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_active_medium_begin") + "";
		}
		return value;
	}
	
	/**
	 * 获取中活跃客流区间结束
	 * @param projectId
	 * @return
	 */
	private static String createProjectActiveMediumEnd(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_active_medium_end from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_active_medium_end") + "";
		}
		return value;
	}
	
	/**
	 * 获取低活跃客流区间开始
	 * @param projectId
	 * @return
	 */
	private static String createProjectActiveLowBegin(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_active_low_begin from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_active_low_begin") + "";
		}
		return value;
	}
	
	/**
	 * 获取低活跃客流区间结束
	 * @param projectId
	 * @return
	 */
	private static String createProjectActiveLowEnd(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_active_low_end from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_active_low_end") + "";
		}
		return value;
	}
	
	/**
	 * 获取沉睡客流时间阈值
	 * @param projectId
	 * @return
	 */
	private static String createProjectActiveSleep(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select crowd_sleep from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("crowd_sleep") + "";
		}
		return value;
	}

	/**
	 * 获取超时时长
	 * @param projectId
	 * @return
	 */
	private static String createProjectSessionTimeoutSeconds(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select frequency_interval_time from TD_THRESHOLD where project_id = " + projectId ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("frequency_interval_time") + "";
		}
		return value;
	}

	public static Element createAllSensorCache(CacheDaoImpl dao, Cache cache, String sensorMac) {
		QueryResult qr = dao.getSomeThings(createTDSensorQueryBean(sensorMac));
		if (Utils.isNotEmpty(qr)) {
			Element e = new Element(sensorMac, sensorMac);
			cache.put(e);
			return e;
		}else{
			Element e = new Element(sensorMac, null);
			cache.put(e);
			return e;
		}
	}

	private static QueryBean createProjectQueryBean(Long projectId) {
		QueryBean queryBean = new QueryBean();
		queryBean.setDbName(QueryBean.DBName.tenddata.getDBName());
		queryBean.setTableName("TD_PROJECT");
		queryBean.setResultColumn(new String[] { "id", "project_type",  "opening_time", "closing_time", "tenant_id","project_name","status" ,"project_num", "shop_size"});
		queryBean.setWhereColumns("id");
		queryBean.setWhereValues(projectId);
		return queryBean;
	}

	private static QueryBean createTDSensorQueryBean(String sensorMac) {
		QueryBean queryBean = new QueryBean();
		queryBean.setDbName(QueryBean.DBName.tenddata.getDBName());
		queryBean.setTableName("TD_SENSOR");
		queryBean.setResultColumn(new String[] { "sensor_mac" });
		queryBean.setWhereColumns("sensor_mac");
		queryBean.setWhereValues(sensorMac);
		return queryBean;
	}

	/**
	 * 获取标签
	 *
	 * @return
	 */
	public static List <Map <String, Object>> createTagSourceBean() {
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "SELECT MAX(match_data.update_time), MIN(match_data._source) AS _source, install_info.related_attribute AS related_attribute, match_data.valid_start_time,match_data.valid_end_time "
				+ "FROM TD_CUSTOMIZED_MATCH_DATA match_data "
				+ "JOIN TD_INSTALL_INFO install_info "
				+ "ON install_info.customized_info = match_data.customized_info "
				+ "WHERE match_data.status = '1' "
				+ "GROUP BY install_info.related_attribute, match_data.valid_start_time,match_data.valid_end_time";
		List <Map <String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
	}

	//查询全局  默认信号强度rssi
	private static Integer getDefaultRSSI() {

		String value = RedisClient.paramsMap.get("default.rssi");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局 默认店前客流
	private static Integer getDefaultBeforeRSSI() {

		String value = RedisClient.paramsMap.get("default.before.rssi");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  默认信号强度rssi-大店
	private static Integer getDefaultLargeRSSI() {

		String value = RedisClient.paramsMap.get("default.large.rssi");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  默认信号强度rssi-中店
	private static Integer getDefaultMiddleRSSI() {

		String value = RedisClient.paramsMap.get("default.middle.rssi");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  默认信号强度rssi-小店
	private static Integer getDefaultSmallRSSI() {

		String value = RedisClient.paramsMap.get("default.small.rssi");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}

	/**
	 * 获取项目默认到访时间
	 * @return
	 */
	private static Integer getDefaultVisitMinutes() {
		String value = RedisClient.paramsMap.get("active.user.visit.minutes");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}

	/**
	 * 获取项目默认最大停留时长
	 * @return
	 */
	private static Integer getDefaultMaxDuration() {
		String value = RedisClient.paramsMap.get(RedisClient.PROJECT_MAX_DURATION);
		if(null == value){
			return 90;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  距上次到访高活跃区间开始天数，单位是天，全局默认
	private static Integer getDefaultActiveHighBegin() {

		String value = RedisClient.paramsMap.get("high.active.begin.user.days");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  距上次到访高活跃区间结束天数，单位是天，全局默认
	private static Integer getDefaultActiveHighEnd() {

		String value = RedisClient.paramsMap.get("high.active.end.user.days");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  距上次到访中活跃区间开始天数，单位是天，全局默认
	private static Integer getDefaultActiveMediumBegin() {

		String value = RedisClient.paramsMap.get("medium.active.begin.user.days");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  距上次到访中活跃区间结束天数，单位是天，全局默认
	private static Integer getDefaultActiveMediumEnd() {

		String value = RedisClient.paramsMap.get("medium.active.end.user.days");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  距上次到访低活跃区间开始天数，单位是天，全局默认
	private static Integer getDefaultActiveLowBegin() {

		String value = RedisClient.paramsMap.get("low.active.begin.user.days");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  距上次到访低活跃区间结束天数，单位是天，全局默认
	private static Integer getDefaultActiveLowEnd() {

		String value = RedisClient.paramsMap.get("low.active.end.user.days");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}
	
	//查询全局  距上次到访沉睡客流阀值，单位是天，全局默认
	private static Integer getDefaultActiveSleep() {

		String value = RedisClient.paramsMap.get("sleep.user.days");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}

	private static String createProjectMaxDurationBean(Long projectId) {
		String value = null;
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select `value` as param_value from TD_PROJECT_PARAM where project_id = " + projectId + " and `key` = 'PROJECT.MAX.DURATION'";
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(list != null && list.size() == 1){
			value = list.get(0).get("param_value") + "";
		}
		return value;
	}
	/**
	 * 项目默认停留时间
	 * @return
	 */
	private static Integer getProjectDefaultStayMinutes() {
		String value = RedisClient.paramsMap.get("project.stay.user.minutes");
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}

	/**
	 * 项目默认停留间隔
	 * @return
	 */
	private static Integer getProjectSessionTimeoutSeconds() {
		String value = RedisClient.paramsMap.get(RedisClient.PROJECT_STAY_TIMEOUT_MINUTES);
		if(null == value){
			return null;
		}
		return Integer.parseInt(value);
	}


	/**
	 * 获取移动Mac对应的公司名称
	 * @return
	 */
	public static Cache getMacCompanyCache() {
		return mappingCache.get("MacCompanyCache");
	}

	/**
	 * 扩展标签缓存
	 *
	 * @return
	 */
	public static Cache getTagSourceCache() {
		return mappingCache.get("TagSourceCache");
	}

	/**
	 * 探针每日用户去重总计缓存
	 *
	 * @return
	 */
	public static Cache getSensorAllMacCache() {
		return mappingCache.get("SensorAllMacCache");
	}
	
	/**
	 * Meta缓存
	 * @return
	 */
	public static Cache getMetaCache() {
		return mappingCache.get("MetaCache");
	}

	/**
	 * 读取IEEE 规范标准规范的mac地址前8位
	 * @param dao
	 * @param cahce
	 * @return
	 */
	public static synchronized   void  createMacCompanyCache(CacheDaoImpl dao, Cache cahce) {
		  if(cahce.get(Constants.MAC_COMPANY_CACHE) == null ) {
		  	logger.info( "重新开始初始化了========");
		  	String sql = "select mac,company,is_mobile from TD_MAC_COMPANY";
			  JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
			  List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
			  if (Utils.isNotEmpty(list)) {
				  for(Map<String,Object> map :  list){
					  String mac = map.get("mac") + "";
					  String company = map.get("company") + "" ;
					  int is_mobile = map.get("is_mobile") == null ?  -1 : Integer.parseInt(map.get("is_mobile") + "");
					  mac = mac.replaceAll("-", ":").toLowerCase();
					  MacCompany macCompany = new MacCompany();
					  macCompany.setCompany(company);
					  macCompany.setIs_moblile(is_mobile);
					  macCompany.setMac(mac.toLowerCase());
					  Element e = new Element(mac, macCompany);
					  cahce.put(e);
				  }
				  Element e = new Element(Constants.MAC_COMPANY_CACHE, "1");
				  cahce.put(e);
				  logger.info( "重新开始初始化了========大小是："  + cahce.getSize());
		  }
		}
	}

	private static QueryBean createMacCompanyQueryBean() {
		QueryBean queryBean = new QueryBean();
		queryBean.setDbName(QueryBean.DBName.tenddata.getDBName());
		queryBean.setTableName("TD_MAC_COMPANY");
		queryBean.setResultColumn(new String[] { "mac","company","is_mobile" });
//		queryBean.setWhereColumns("mac");
//		queryBean.setWhereValues(mac.replaceAll(":", "-").toUpperCase()); //TODO 数据库中是带分号，大写字母，待统一
		return queryBean;
	}


	/**
	 * 需要排除重复的店组计算
	 * @param dao
	 * @param cahce
	 * @return
	 */
	public static synchronized Element  createProjectGroupComputeCache(CacheDaoImpl dao, Cache cahce,int projectId) {
		QueryResult qr = dao.getSomeThings(createProjectGroupComputeQueryBean(projectId));
		if (Utils.isNotEmpty(qr)) {
			Iterator<Object []> iter = qr.iterator();
			List<Integer> list = new ArrayList<Integer>();
			while(iter.hasNext()){
				Object[] objects = iter.next();
				list.add((Integer) objects[0]);
			}
			Element e = new Element(projectId + "", list);
			logger.info("店铺ID=" + projectId + " 对应店组信息列表为：" + Arrays.toString( list.toArray()));
			cahce.put(e);
			return e;
		}else {
			List<Integer> list = new ArrayList<Integer>();
			Element e = new Element(projectId + "", list);
			logger.info("店铺ID=" + projectId + " 对应店组信息列表为：" + Arrays.toString( list.toArray()));
			cahce.put(e);
			return e;
		}
	}


	/**
	 * 查询需要计算的店组列表
	 * @return
	 */
	private static synchronized QueryBean createProjectGroupComputeQueryBean(int projectId) {
		QueryBean queryBean = new QueryBean();
		queryBean.setDbName(QueryBean.DBName.tenddata.getDBName());
		queryBean.setTableName("TD_PROJECT_GROUP_COMPUTE");
		queryBean.setResultColumn(new String[] { "group_id" });
		queryBean.setWhereColumns( new String [] {"project_id","compute_type" });
		queryBean.setWhereValues(new String [] { projectId + "", "2" });//仅仅查询配置了的项目
		return queryBean;
	}

}

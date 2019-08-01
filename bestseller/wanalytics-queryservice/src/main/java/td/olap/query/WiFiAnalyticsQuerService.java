package td.olap.query;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import td.enterprise.dmp.common.config.Configuration;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

public class WiFiAnalyticsQuerService {

	private static final String ACTIVE_USER_HOUR_CUBE = "active_user_hour_cube";// 使用少
	private static final String ACTIVE_USER_SENSOR_HOUR_CUBE = "active_user_sensor_hour_cube";// 使用少

	private static final String NEW_USER_DAY_CUBE = "new_user_day_cube";
	private static final String OLD_USER_DAY_CUBE = "old_user_day_cube";

	private static final String NEW_USER_SENSOR_DAY_CUBE = "new_user_sensor_day_cube";
	private static final String OLD_USER_SENSOR_DAY_CUBE = "old_user_sensor_day_cube";

	private static final String ENTER_USER_DAY_CUBE = "enter_user_day_cube";
	private static final String STAY_USER_DAY_CUBE = "stay_user_day_cube";

	private static final String ACTIVE_USER_ROOM_DAY_CUBE = "active_user_room_day_cube";
	private static final String ENTER_USER_ROOM_DAY_CUBE = "enter_user_room_day_cube";
	private static final String STAY_USER_ROOM_DAY_CUBE = "stay_user_room_day_cube";

	private static final String OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER = "offline_active_user_room_day_counter";
	private static final String OFFLINE_ENTER_USER_ROOM_DAY_COUNTER = "offline_enter_user_room_day_counter";
	private static final String OFFLINE_STAY_USER_ROOM_DAY_COUNTER = "offline_stay_user_room_day_counter";
	
	private static final String OFFLINE_NEW_USER_DAY_COUNTER = "offline_new_user_day_counter";
	private static final String OFFLINE_OLD_USER_DAY_COUNTER = "offline_old_user_day_counter";
	
	private static final String OFFLINE_STAY_USER_DURATION_DAY_COUNTER = "offline_stay_user_duration_day_counter";
	
	private static final String OFFLINE_ENTER_USER_DAY_COUNTER = "offline_enter_user_day_counter";
	private static final String OFFLINE_STAY_USER_DAY_COUNTER = "offline_stay_user_day_counter";
	
	private static final String OFFLINE_ACTIVE_USER_SENSOR_HOUR_COUNTER = "offline_active_user_sensor_hour_counter";
	private static final String OFFLINE_NEW_USER_SENSOR_DAY_COUNTER = "offline_new_user_sensor_day_counter";
	private static final String OFFLINE_OLD_USER_SENSOR_DAY_COUNTER = "offline_old_user_sensor_day_counter";
	
	private static final String OFFLINE_ACTIVE_USER_HOUR_COUNTER = "offline_active_user_hour_counter";
	
	private static final String OFFLINE_ENTER_NEW_USER_DAY_COUNTER = "offline_enter_new_user_day_counter";
	private static final String OFFLINE_ENTER_OLD_USER_DAY_COUNTER = "offline_enter_old_user_day_counter";
	
	private static final String OFFLINE_ACTIVE_USER_DAY_COUNTER = "offline_active_user_day_counter";
	
	private static final String OFFLINE_STAY_NEW_USER_DAY_COUNTER = "offline_stay_new_user_day_counter";
	
	private static final String OFFLINE_STAY_OLD_USER_DAY_COUNTER = "offline_stay_old_user_day_counter";
	
	//项目驻留时长 
	private static final String OFFLINE_PROJECT_ENTER_DURATION_DISTRIBUTE_COUNTER = "offline_project_enter_duration_distribute_counter";
	
	
	private static final String OFFLINE_SENSOR_EFFECTIVE_HOUR_COUNTER = "offline_sensor_effective_hour_counter";
	private static final String OFFLINE_SENSOR_HEART_HOUR_COUNTER = "offline_sensor_heart_hour_counter";
	
	private static String bit_map = "bitmap";
	private static String enter_prise = "enterprise";

	private static WiFiAnalyticsQuerService instance;

	private final static Logger logger = Logger.getLogger(WiFiAnalyticsQuerService.class);

	private static String queryUrl = Configuration.getInstance().getConfig("query.engine.url") + "/api/query";

	public static WiFiAnalyticsQuerService getInstance() {
		if (instance == null) {
			instance = new WiFiAnalyticsQuerService();
		}
		return instance;
	}

	
	public static Long querySensorOneHourDateNum(String apmac,String datetime,String hour, boolean wasBefor) {
		String table = "";
		if(wasBefor){
			table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		}else{
			table = enter_prise + "." + OFFLINE_SENSOR_EFFECTIVE_HOUR_COUNTER;
		}
		
		String tql = "r0452=select * from " + table + " where sensor_mac=" + apmac + " and date=" + datetime + " and hour=" + hour +";";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Long count = 0l;
		List<ResultBean> results = new ArrayList<>();
		if (result != null) {
			results = result.getResults();
		}
		for (ResultBean resultBean : results) {
			if (resultBean.getValue() != null)
				count = count + Integer.valueOf((String) resultBean.getValue());
		}
		return count;
	}	
	
	
	public static void main(String[] args) {
		queryUrl = "http://172.23.5.108/wifianalytics-queryengine//api/query";
		Long querySensorOneHourDateNum = querySensorOneHourDateNum("e4956e4e53d9","","", true);
		System.out.println(querySensorOneHourDateNum);
	}
	
	//bitmap
	/**
	 * 根据sensorids 、projectId、tenantId、placeId、hour、date 查询探针3个小时的数据量
	 * 
	 */
	public static Long querySensorDataByHour(int sensorId, int placeId, int projectId, String tenantId, String date, String hoursStr, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ACTIVE_USER_SENSOR_HOUR_COUNTER;
		}else{
			table = bit_map + "." + ACTIVE_USER_SENSOR_HOUR_CUBE;
		}
		String tql = "r0452=select * from " + table + " where sensor_id=" + sensorId + " and place_id=" + placeId + " and project_id=" + projectId
				+ " and tenant_id=" + tenantId + " and date=" + date + " and hour in(" + hoursStr + ");";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql.toString());
		Long count = 0l;
		List<ResultBean> results = new ArrayList<>();
		if (result != null) {
			results = result.getResults();
		}
		for (ResultBean resultBean : results) {
			if (resultBean.getValue() != null)
				count = count + Integer.valueOf((String) resultBean.getValue());
		}
		return count;
	}

	// =========================adapter start============================
	/**
	 * 按日统计客流新客总数
	 */
	public static Long queryNewUserGroupCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCount(tenantId, projectId, start, end, table, isOffline);
		return count;
	}

	public static Long queryNewUserGroupCount(String tenantId, Integer projectId, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCountAllDate(tenantId, projectId, table, isOffline);
		return count;
	}

	/**
	 * 按日统计客流老客总数
	 */
	public static Long queryOldUserGroupCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCount(tenantId, projectId, start, end, table, isOffline);

		return count;
	}

	public static Long queryOldUserGroupCount(String tenantId, Integer projectId, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCountAllDate(tenantId, projectId, table, isOffline);

		return count;
	}

	/**
	 * 客流趋势-按日统计新增客群数据
	 */
	public static Map<String, Integer> queryNewUserGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupMap(tenantId, projectId, start, end, table, isOffline);
		return resultMap;
	}

	/**
	 * 客流趋势-按日统计老客数量
	 */
	public static Map<String, Integer> queryOldUserGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupMap(tenantId, projectId, start, end, table, isOffline);
		return resultMap;
	}

	public static Map<String, Integer> querySensorNew(String tenantId, Integer projectId, Integer placeId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupSensorMap(tenantId, projectId, placeId, start, end, table, isOffline);
		return resultMap;
	}

	public static Map<String, Integer> querySensorOld(String tenantId, Integer projectId, Integer placeId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupSensorMap(tenantId, projectId, placeId, start, end, table, isOffline);
		return resultMap;
	}

	public static Map<String, Integer> querySensorNewById(String tenantId, Integer projectId, Integer placeId, String start, String end, Integer id, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapSensorByIdMap(tenantId, projectId, placeId, start, end, id, table, isOffline);
		return resultMap;
	}

	public static Map<String, Integer> querySensorOldById(String tenantId, Integer projectId, Integer placeId, String start, String end, Integer id, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapSensorByIdMap(tenantId, projectId, placeId, start, end, id, table, isOffline);
		return resultMap;
	}
	// =========================adapter end============================

	private static Long queryBitmapGroupCount(String tenantId, Integer projectId, String start, String end, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and (date between " + start + " and " + end
				+ ") group by date order by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Long count = getSumCountValue1(qer, script);

		return count;
	}

	private static Long queryBitmapGroupCountAllDate(String tenantId, Integer projectId, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " group by date order by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Long count = getSumCountValue1(qer, script);

		return count;
	}

	private static Map<String, Integer> queryBitmapGroupMap(String tenantId, Integer projectId, String start, String end, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and (date between " + start + " and " + end
				+ ") group by date order by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	private static Map<String, Integer> queryBitmapGroupSensorMap(String tenantId, Integer projectId, Integer placeId, String start, String end, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and place_id=" + placeId + " and date between " + start
				+ " and " + end + " group by sensor_id;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	private static Map<String, Integer> queryBitmapSensorByIdMap(String tenantId, Integer projectId, Integer placeId, String start, String end, Integer id, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and place_id=" + placeId + " and date between " + start
				+ " and " + end + " and sensor_id=" + id + ";";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	public static Map<String, Integer> queryActiveUserHour2(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ACTIVE_USER_HOUR_COUNTER;
		}else{
			table = bit_map + "." + ACTIVE_USER_HOUR_CUBE;
		}
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by hour order by hour;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);

		return resultList;
	}

	// ===========================room start============================

	public static Map<String, Integer> queryEnterUserRoomCubeMap(String tenantId, Integer projectId, String start, String end, String chartType, long timestamp, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
			if ("active".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
			} else if ("stay".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
			}
		}else{
			table = bit_map + "." + ENTER_USER_ROOM_DAY_CUBE;
			if ("active".equals(chartType)) {
				table = bit_map + "." + ACTIVE_USER_ROOM_DAY_CUBE;
			} else if ("stay".equals(chartType)) {
				table = bit_map + "." + STAY_USER_ROOM_DAY_CUBE;
			}
		}
		
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id!=-100 group by date,room_id order by value desc;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		logger.info("queryEnterUserRoomCubeMap end timestamp: " + timestamp);

		return resultList;
	}

	public static Map<String, Integer> queryEnterUserRoom_me_limit_roomId(String tenantId, Integer projectId, String start, String end, String chartType, int id, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
			if ("active".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
			} else if ("stay".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
			}
		}else{
			table = bit_map + "." + ENTER_USER_ROOM_DAY_CUBE;
			if ("active".equals(chartType)) {
				table = bit_map + "." + ACTIVE_USER_ROOM_DAY_CUBE;
			} else if ("stay".equals(chartType)) {
				table = bit_map + "." + STAY_USER_ROOM_DAY_CUBE;
			}
		}
		
		// 指定房间
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id=" + id + " group by date,room_id order by value desc;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);

		return resultList;
	}

	public static Map<String, Integer> queryEnterUserRoomCube(String tenantId, Integer projectId, String start, String end, String chartType, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
			if ("active".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
			} else if ("stay".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
			}
		}else{
			table = bit_map + "." + ENTER_USER_ROOM_DAY_CUBE;
			if ("active".equals(chartType)) {
				table = bit_map + "." + ACTIVE_USER_ROOM_DAY_CUBE;
			} else if ("stay".equals(chartType)) {
				table = bit_map + "." + STAY_USER_ROOM_DAY_CUBE;
			}
		}
		
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id!=-100 group by room_id order by value desc;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);

		return resultList;
	}

	public static List<Map<String, Object>> queryUserRoomCountFromCube(String tenantId, Integer projectId, String start, String end, String chartType, boolean isGroupByDate, int roomId, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
			if ("active".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
			} else if ("stay".equals(chartType)) {
				table = enter_prise + "." + OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
			}
		}else{
			table = bit_map + "." + ENTER_USER_ROOM_DAY_CUBE;
			if ("active".equals(chartType)) {
				table = bit_map + "." + ACTIVE_USER_ROOM_DAY_CUBE;
			} else if ("stay".equals(chartType)) {
				table = bit_map + "." + STAY_USER_ROOM_DAY_CUBE;
			}
		}

		String script = "";

		if (!isGroupByDate) {
			if (0 == roomId) {
				script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
						+ " and room_id!=-100 group by room_id;";
			} else {
				script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
						+ " and room_id!=-100 and room_id=" + roomId + " group by room_id;";
			}

		} else {
			if (0 == roomId) {
				script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
						+ " and room_id!=-100 group by date,room_id;";
			} else {
				script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
						+ " and room_id!=-100 and room_id=" + roomId + " group by date,room_id;";
			}
		}

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				Map tmpMap = new HashMap<>();
				tmpMap.put("key", resultBean.getKey());
				tmpMap.put("value", Integer.valueOf(resultBean.getValue().toString()));
				resultList.add(tmpMap);
			}
		}
		logger.info("queryEngine-result:" + resultList);
		return resultList;
	}

	// ===========================room start============================

	/**
	 * 返回 某时间段内，进店老客人数
	 */
	public static Long getOldEnterUserRoomCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String tableOld = "";
		tableOld = enter_prise + "." + OFFLINE_ENTER_OLD_USER_DAY_COUNTER;
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + tableOld + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());
		return count;
	}

	/**
	 * 返回某时间段内停留人数中老客。
	 */
	public static Long getOldStayUserCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String tableOld = "";
		String tableEnter = "";
		if(isOffline){
			tableOld = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
			tableEnter = enter_prise + "." + OFFLINE_STAY_USER_DAY_COUNTER;
		}else{
			tableOld = bit_map + "." + OLD_USER_DAY_CUBE;
			tableEnter = bit_map + "." + STAY_USER_DAY_CUBE;
		}
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + tableOld + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		sb.append("r0721=select * from " + tableEnter + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		sb.append("users=unite(r0721, r30223,'keybykey');");
		sb.append("users.subkey(0);");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());
		return count;
	}

	/**
	 * 获取某时间段内停留人数中新客。
	 */
	public static Long getNewStayUserCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		// String newCube = bit_map + "." + "new_user_day_cube";
		String stayUserCube = bit_map + "." + "stay_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			dateSql = " and date between " + start + " and " + end;
			stayUserCube = enter_prise + "." + "offline_stay_user_day_counter";
		}
		StringBuffer sb = new StringBuffer();
		// sb.append("r30223=select * from " + bit_map + "."+newCube+" where
		// tenant_id="+tenantId+" and project_id="+projectId+ " and date between
		// " + start + " and " + end +" group by date;");
		sb.append("r0721=select * from " + stayUserCube + " where tenant_id=" + tenantId + " and project_id=" + projectId + dateSql + " group by date;");
		// sb.append("users=unite(r0721, r30223,'keybykey');");
		// sb.append("users.subkey(0);");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());

		return count;
	}

	/**
	 * 返回每日停留的新客 数据Map
	 * 
	 * 查询当天的停留-offline_stay_user_cube 查询往日的停留-
	 * 
	 * @param tenantId
	 * @param projectId
	 * @param start
	 * @param end
	 * @return
	 */
	public static Map<String, Integer> getNewStayUserDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String stayUserCube = bit_map + "." + "stay_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			stayUserCube = enter_prise + "." + OFFLINE_STAY_NEW_USER_DAY_COUNTER;
			dateSql = " and date between " + start + " and " + end;
		}
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + stayUserCube + " where tenant_id=" + tenantId + " and project_id=" + projectId + dateSql + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	/**
	 * 返回 某时间段内，进店新客人数
	 */
	public static Long getNewEnterUserRoomCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String tableNew = "";
		tableNew = enter_prise + "." + OFFLINE_ENTER_NEW_USER_DAY_COUNTER;
		
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + tableNew + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());

		return count;
	}

	/**
	 * 返回 某时间段内，进店新客人数
	 */
	public static Long getNewStayUserRoomCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String tableNew = "";
		String tableStay = "";
		if(isOffline){
			tableNew = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
			tableStay = enter_prise + "." + OFFLINE_STAY_USER_DAY_COUNTER;
		}else{
			tableNew = bit_map + "." + NEW_USER_DAY_CUBE;
			tableStay = bit_map + "." + STAY_USER_DAY_CUBE;
		}
		
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + tableNew + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		sb.append("r0721=select * from " + tableStay + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		sb.append("users=unite(r0721, r30223,'keybykey');");
		sb.append("users.subkey(0);");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());

		return count;
	}

	/**
	 * 返回每日进店老客Map
	 */
	public static Map<String, Integer> getOldEnterUserRoomDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String tableOld = "";
		tableOld = enter_prise + "." + OFFLINE_ENTER_OLD_USER_DAY_COUNTER;
		
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + tableOld + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	public static Map<String, Integer> getOldStayUserRoomDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String tableOld = "";
		String tableStay = "";
		if(isOffline){
			tableOld = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
			tableStay = enter_prise + "." + OFFLINE_STAY_USER_DAY_COUNTER;
		}else{
			tableOld = bit_map + "." + OLD_USER_DAY_CUBE;
			tableStay = bit_map + "." + STAY_USER_DAY_CUBE;
		}
		
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + tableOld + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		sb.append("r0721=select * from " + tableStay + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		sb.append("users=unite(r0721, r30223,'keybykey');");
		sb.append("users.subkey(0);");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	/**
	 * 返回每日停留的老客
	 * 
	 * @param tenantId
	 * @param projectId
	 * @param start
	 * @param end
	 * @return
	 */
	public static Map<String, Integer> getOldStayUserDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String stayUserCube = bit_map + "." + "stay_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			stayUserCube = enter_prise + "." + OFFLINE_STAY_OLD_USER_DAY_COUNTER;
			dateSql = " and date between " + start + " and " + end;
		}
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + stayUserCube + " where tenant_id=" + tenantId + " and project_id=" + projectId + dateSql + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	/**
	 * 返回每日进店新客Map
	 * 
	 * @param tenantId
	 * @param projectId
	 * @param start
	 * @param end
	 * @return
	 */
	public static Map<String, Integer> getNewEnterUserRoomDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String enterNewUserCounter = "";
		enterNewUserCounter = enter_prise + "." + OFFLINE_ENTER_NEW_USER_DAY_COUNTER;
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + enterNewUserCounter + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	public static Map<String, Integer> getNewStayUserRoomDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String newCube = "";
		String enterRoomCube = "";
		if(isOffline){
			newCube = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
			enterRoomCube = enter_prise + "." + OFFLINE_STAY_USER_DAY_COUNTER;
		}else{
			newCube = bit_map + "." + NEW_USER_DAY_CUBE;
			enterRoomCube = bit_map + "." + STAY_USER_DAY_CUBE;
		}
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + newCube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		sb.append("r0721=select * from " + enterRoomCube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		sb.append("users=unite(r0721, r30223,'keybykey');");
		sb.append("users.subkey(0);");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}
	
	public static Map<String, Integer> getStayUserDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String stayCounter = "";
		if(isOffline){
			stayCounter = enter_prise + "." + OFFLINE_STAY_USER_DAY_COUNTER;
		}
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + stayCounter + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}
	
	public static  Map<String, Long> queryNewUser(String tenantId,  String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and (date between " + start + " and " + end
				+ ") group by project_id order by date;";
		QueryEngineResult results = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Long> resultMap = new HashMap<String, Long>();
		for (ResultBean resultBean : results.getResults()) {
			resultMap.put(resultBean.getKey().toString(),
					Long.parseLong(resultBean.getValue().toString()));
		}
		return resultMap;
	}
	
	public static  Map<String, Long> queryOldUser(String tenantId,  String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and (date between " + start + " and " + end
				+ ") group by project_id order by date;";
		QueryEngineResult results = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Long> resultMap = new HashMap<String, Long>();
		for (ResultBean resultBean : results.getResults()) {
			resultMap.put(resultBean.getKey().toString(),
					Long.parseLong(resultBean.getValue().toString()));
		}
		return resultMap;
	}

	
	
	
	//enter_prise
	/**
	 * 查询某时间段内房间的停留次数 offline_stay_user_room_day_counter stay_user_room_day_cube
	 * 
	 * @return
	 */
	public static Map<String, Integer> queryStayUserRoomDayData(String tenantId, String projectId, String start, String end, String roomId) throws ParseException {
		String cube = "offline_stay_user_room_times_day_counter";
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id=" + roomId + " group by date order by date asc;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> map = getMapValue1(result, script);
		return map;
	}

	/**
	 * 查询某时间段内某房间的用户停留时长
	 */
	public static Map<String, Integer> queryStayUserDurationDayData(String tenantId, String projectId, String start, String end, String roomId) throws ParseException {
		String cube = "offline_stay_user_room_duration_day_counter";
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id=" + roomId + " group by date;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> map = getMapValue1(result, script);
		return map;
	}

	/**
	 * 进店停留时长（不同时间间隔数据） offline_enter_times_distribution_counter
	 */
	public static Map<String, Integer> queryStayUserTimeLongByRoom(String tenantId, String projectId, String placeId, String start, String end, String roomId) throws ParseException {
		String cube = "offline_enter_times_distribution_counter";
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and place_id=" + placeId + " and project_id=" + projectId + " and date between " + start
				+ " and " + end + " and room_id=" + roomId + " group by duration order by duration asc;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> map = getMapValue1(result, script);
		return map;
	}

	/**
	 * 月到访数 frequency 到访次数 metric_value 人数
	 */
	public static Map<String, Object> queryActiveUserFrequecyByRoom(String tenantId, String projectId, String placeId, String end, String roomId) throws ParseException {
		String cube = "offline_active_frequency_distribution_counter";

		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and place_id=" + placeId + " and project_id=" + projectId + " and date<" + end
				+ " and room_id=" + roomId + " group by date order by date desc limit 1;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Object> resultMap = new HashMap<>();
		if (result != null) {
			List<ResultBean> list = result.getResults();
			if (list.size() > 0) {
				String date = list.get(0).getKey();
				String sql = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and place_id=" + placeId + " and project_id=" + projectId + " and date=" + date
						+ " and room_id=" + roomId + " group by frequency;";
				QueryEngineResult result1 = QueryServiceUtils.invoke("post", queryUrl, sql);
				List<ResultBean> list1 = result1.getResults();
				for (ResultBean bean : list1) {
					resultMap.put(bean.getKey(), bean.getValue());
				}
			}
		}
		logger.info("queryEngine-result:" + resultMap);
		return resultMap;
	}

	public static Map<String, Integer> queryActiveUserTracksByRoom(String tenantId, String projectId, String placeId, String roomId, String start, String end, int trackType) throws ParseException {
		String counter = enter_prise + "." + "offline_stay_user_room_tracks_counter";
		StringBuffer sb = new StringBuffer("r30223=select * from " + counter + " where tenant_id=" + tenantId + " and place_id=" + placeId + " and project_id=" + projectId + " and date between '"
				+ start + "' and '" + end + "' and room_id=" + roomId);
		switch (trackType) {
		case 0:
			sb.append(" and track_type in (2,3) group by track_room_id order by metric_value desc;");
			break;
		default:
			sb.append(" and track_type=" + trackType + " group by track_room_id order by metric_value desc;");
			break;
		}
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(result, sb.toString());
		return resultMap;
	}

	// =================================================================================

	private static Long getSumCountValue1(QueryEngineResult qer, String sql) {
		Long count = 0l;
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null) {
					count = count + Long.valueOf(resultBean.getValue().toString());
				}
			}
		}
		logger.info("queryEngine-params: " + queryUrl + " sql: " + sql);
		logger.info("queryEngine-result: " + count);
		return count;
	}

	// =================================================================================

	private static Map<String, Integer> getMapValue1(QueryEngineResult qer, String sql) {
		Map<String, Integer> resultMap = new LinkedHashMap<>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				resultMap.put(resultBean.getKey(), Integer.valueOf(resultBean.getValue().toString()));
			}
		}
		logger.info("queryEngine-params: " + queryUrl + " sql: " + sql);
		logger.info("queryEngine-result:" + resultMap);
		return resultMap;
	}	

	public static Map<String, Integer> queryCounterGroupByDate(String tenantId, Integer projectId, String start, String end, String counter) {
		String script = "r30223=select * from " + enter_prise + "." + counter + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and (date between " + start + " and " + end
				+ ") group by date order by date;";
		
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}
	

	public static List<Map<String, Object>> queryUserRoomCount(String tenantId, Integer projectId, String start, String end, String chartType, int roomId) {
		String cube = OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
		}

		String script = null;

		if (roomId == 0) {
			script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
					+ " and room_id!=-100 group by room_id order by value desc;";
		} else {
			script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
					+ " and room_id!=-100 and room_id=" + roomId + " group by room_id order by value desc;";
		}

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				Map tmpMap = new HashMap<>();
				tmpMap.put("key", resultBean.getKey());
				tmpMap.put("value", Integer.valueOf(resultBean.getValue().toString()));
				resultList.add(tmpMap);
			}
		}
		logger.info("queryEngine-result:" + resultList);
		return resultList;
	}

	public static List<Map<String, Object>> queryUserRoomCount_groupByDate(String tenantId, Integer projectId, String start, String end, String chartType, int roomId) {
		String cube = OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
		}

		String script = null;

		if (roomId == 0) {
			script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
					+ " and room_id!=-100 group by date,room_id order by value desc;";
		} else {
			script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
					+ " and room_id!=-100 and room_id=" + roomId + " group by date,room_id order by value desc;";
		}

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				Map tmpMap = new HashMap<>();
				tmpMap.put("key", resultBean.getKey());
				tmpMap.put("value", Integer.valueOf(resultBean.getValue().toString()));
				resultList.add(tmpMap);
			}
		}
		logger.info("queryEngine-result:" + resultList);
		return resultList;
	}
	
	public static Map<String, Integer> queryEnterUserRoom_me_2_count_roomId(String tenantId, Integer projectId, String start, String end) {
		String cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;

		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id != -100 group by room_id order by value desc limit 10;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);

		return resultList;
	}

	public static String findLastData(String tenantId, Integer projectId) {
		String cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and room_id != -100 group by date order by date desc;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			if (results.size() > 0) {
				ResultBean resultBean = results.get(0);
				return resultBean.getKey();
			}
		}
		return null;
	}

	public static Map<String, Integer> queryEnterUserRoom_me_2(String tenantId, Integer projectId, String start, String end, String chartType, String ids) {
		String cube = OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
		}
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id in (" + ids + ") group by date,room_id;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);

		return resultList;
	}
	
	//查询连锁项目 top 10
	public static Map<String, Integer> queryCounter(String tenantId, String projectIds, String start, String end, String chartType, boolean isTop10) {
		String cube = OFFLINE_ENTER_USER_DAY_COUNTER;
	    if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_DAY_COUNTER;
		} else if ("duration".equals(chartType)) {
			cube = OFFLINE_STAY_USER_DURATION_DAY_COUNTER;
		} else if ("new".equals(chartType)) {
			cube = OFFLINE_ENTER_NEW_USER_DAY_COUNTER;
		} else if ("old".equals(chartType)) {
			cube = OFFLINE_ENTER_OLD_USER_DAY_COUNTER;
		}
		
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id in (" + projectIds + ") and date between " + start + " and " + end
				+ "  group by project_id order by value desc limit 10;";
		if(isTop10 == false ){
			script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id in (" + projectIds + ") and date between " + start + " and " + end
					+ "  group by project_id order by value desc;";
		}
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		return resultList;
	}
	
	/**
	 * 查询子项目每天数据
	 * @param tenantId
	 * @param projectId
	 * @param start
	 * @param end
	 * @param chartType
	 * @return
	 */
	public static Map<String, Integer> queryCounterDayMap(String tenantId, String  projectIds, String start, String end, String chartType) {
		String cube = OFFLINE_ENTER_USER_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_DAY_COUNTER;
		} else if ("duration".equals(chartType)){
			cube = OFFLINE_STAY_USER_DURATION_DAY_COUNTER;
		} else if ("new".equals(chartType)) {
			cube = OFFLINE_ENTER_NEW_USER_DAY_COUNTER;
		} else if ("old".equals(chartType)) {
			cube = OFFLINE_ENTER_OLD_USER_DAY_COUNTER;
		}
		
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id in (" + projectIds + ") and date between " + start + " and " + end
				+ " group by date,project_id;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		return resultList;
	}

	public static Map<String, Integer> queryEnterUserRoomCounterMap(String tenantId, Integer projectId, String start, String end, String chartType, long timestamp) {
		String cube = OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
		} 
		
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date,room_id;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		logger.info("queryEnterUserRoomCounterMap end timestamp: " + timestamp);

		return resultList;
	}

	public static Map<String, Integer> queryEnterUserRoomCounter(String tenantId, Integer projectId, String start, String end, String chartType) {
		String cube = OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
		}

		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id!=-100 group by room_id order by value desc;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);

		return resultList;
	}
	
	public static Map<String, Integer> queryUserCounter(String tenantId, String projectIds, String start, String end, String chartType) {
        String cube = OFFLINE_ENTER_USER_DAY_COUNTER;
        if ("active".equals(chartType)) {
            cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
        } else if ("stay".equals(chartType)) {
            cube = OFFLINE_STAY_USER_DAY_COUNTER;
        }

        String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id in (" + projectIds + ") and date between " + start + " and " + end
                + "  group by project_id order by value desc;";

        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Map<String, Integer> resultList = getMapValue1(qer, script);

        return resultList;
    }

	public static Map<String, Integer> queryEnterUserRoomSumByRoomIdLimit10(String tenantId, Integer projectId, String start, String end, String chartType, long timestamp) {
		String cube = OFFLINE_ENTER_USER_ROOM_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_ROOM_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_ROOM_DAY_COUNTER;
		}
		
		String script = "r30223=select * from " + enter_prise + "." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " and room_id!=-100 group by room_id order by value desc limit 10;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		logger.info("queryEnterUserRoomSumByRoomIdLimit10 end timestamp: " + timestamp);

		return resultList;
	}
	
	//驻留时长
	public static Map<String, Integer> queryEnterDurationDistributeCounter(String tenantId, Integer projectId, String start, String end) {
		String counter = OFFLINE_PROJECT_ENTER_DURATION_DISTRIBUTE_COUNTER;

		String script = "r30223=select * from " + enter_prise + "." + counter + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by duration;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> map = getMapValue1(qer, script);
		return map;
	}
	
	
	
}

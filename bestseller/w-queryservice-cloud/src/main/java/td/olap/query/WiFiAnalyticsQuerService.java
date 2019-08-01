package td.olap.query;

import org.apache.log4j.Logger;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

import java.text.ParseException;
import java.util.*;

public class WiFiAnalyticsQuerService {

	public static final String ACTIVE_USER_HOUR_CUBE = "active_user_hour_cube";// 使用少
	public static final String ACTIVE_USER_SENSOR_HOUR_CUBE = "active_user_sensor_hour_cube";// 使用少

	public static final String NEW_USER_DAY_CUBE = "new_user_day_cube"; //到访新客
	public static final String OLD_USER_DAY_CUBE = "old_user_day_cube"; //到访老客

	public static final String NEW_USER_SENSOR_DAY_CUBE = "new_user_sensor_day_cube"; //探针到访新客
	public static final String OLD_USER_SENSOR_DAY_CUBE = "old_user_sensor_day_cube"; //探针到访老客

	public static final String STAY_USER_DAY_CUBE = "stay_user_day_cube";  //停留人数

	public static final String OFFLINE_NEW_USER_DAY_COUNTER = "offline_new_user_day_counter";
	public static final String OFFLINE_OLD_USER_DAY_COUNTER = "offline_old_user_day_counter";

	public static final String OFFLINE_STAY_USER_DURATION_DAY_COUNTER = "offline_stay_user_duration_day_counter";//停留总时长

	public static final String OFFLINE_STAY_USER_TIMES_DAY_COUNTER = "offline_stay_user_times_day_counter";//停留次数

	public static final String OFFLINE_STAY_USER_DAY_COUNTER = "offline_stay_user_day_counter";

	public static final String OFFLINE_ACTIVE_USER_SENSOR_HOUR_COUNTER = "offline_active_user_sensor_hour_counter";
	public static final String OFFLINE_NEW_USER_SENSOR_DAY_COUNTER = "offline_new_user_sensor_day_counter";
	public static final String OFFLINE_OLD_USER_SENSOR_DAY_COUNTER = "offline_old_user_sensor_day_counter";

	public static final String OFFLINE_ACTIVE_USER_HOUR_COUNTER = "offline_active_user_hour_counter";

	public static final String OFFLINE_ACTIVE_USER_DAY_COUNTER = "offline_active_user_day_counter"; //到访人数

	public static final String OFFLINE_STAY_NEW_USER_DAY_COUNTER = "offline_stay_new_user_day_counter";  //停留新客

	public static final String OFFLINE_STAY_OLD_USER_DAY_COUNTER = "offline_stay_old_user_day_counter";  //停留老客

	public static final String OFFLINE_ACTIVE_USER_TIMES_DAY_COUNTER = "offline_active_user_times_day_counter"; //到访次数

	public static final String OFFLINE_ACTIVE_USER_DURATION_DAY_COUNTER = "offline_active_user_duration_day_counter"; //到访总时间

	public static final String OFFLINE_FRONT_USER_DAY_COUNTER = "offline_front_user_day_counter"; //店前客流

	public static final String OFFLINE_MONTH_METRIC_COUNTER = "offline_month_metric_counter"; //月度指标， 月均光顾日数，月均光顾次数指标

	//项目驻留时长
	public static final String OFFLINE_PROJECT_ENTER_DURATION_DISTRIBUTE_COUNTER = "offline_project_enter_duration_distribute_counter";


	public static final String OFFLINE_SENSOR_EFFECTIVE_HOUR_COUNTER = "offline_sensor_effective_hour_counter";
	public static final String OFFLINE_SENSOR_HEART_HOUR_COUNTER = "offline_sensor_heart_hour_counter";
	public static final String OFFLINE_SENSOR_ALL_MAC_DAY_COUNTER = "offline_sensor_all_mac_day_counter";


	public static String bit_map = "bitmap";
	public static String enter_prise = "enterprise";

	public static WiFiAnalyticsQuerService instance = null ;


	/**
	 * 指标查询常量
	 */
	public  final  static String FRONT =  "front"; //店前客流
	public  final  static String STAY =  "stay"; //停留人数
	public  final  static String ACTIVE =  "active"; //到访人数
	public  final  static String NEW =  "new"; //到访新客
	public  final  static String OLD =  "old"; //到访老客
	public  final  static String ENTER =  "enter"; //到访人数
	public  final  static String STAY_NEW =  "stayNEW"; //停留新客
	public  final  static String STAY_OLD =  "stayOLD"; //停留老客
	public  final  static String STAY_DURATION =  "stayDuration"; //停留时长 默认
	public  final  static String STAY_TIMES =  "stayTimes"; //停留次数
	public  final  static String VISIT_TIMES =  "visitTimes"; //到访次数
	public  final  static String VISIT_DURATION =  "visitDuration"; //到访时长

	public final static String MONTH_DAYS = "days"; //月均光顾日数
	public final static String MONTH_TIMES = "times" ; //月均光顾次数

	public final static String TOTAL = "total";
	public final static String EFFECTIVE = "effective";

	private final static Logger logger = Logger.getLogger(WiFiAnalyticsQuerService.class);

	private static String queryUrl = null;

	/**
	 * 添加指定url
	 * @param url
	 * @return
	 */
	public static  WiFiAnalyticsQuerService getInstance(String url) {
        if (instance == null) {
            instance = new WiFiAnalyticsQuerService();
            queryUrl = url + "/api/query";
        }
        return instance;
    }

	public Long querySensorOneHourDateNum(String apmac,String hourStr, boolean wasBefore) {
		String table = "";
		if(wasBefore){
			table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		}else{
			table = enter_prise + "." + OFFLINE_SENSOR_EFFECTIVE_HOUR_COUNTER;
		}

		String tql = "r0452=select * from " + table + " where sensor_mac='" + apmac + "' and "+ hourStr +";";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Long count = Long.valueOf(0L);
		if (result != null) {
			List<ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					count = count + Integer.valueOf((String) resultBean.getValue());
			}
		}
		return count;
	}

	//bitmap
	/**
	 * 根据sensorids 、projectId、tenantId、placeId、hour、date 查询探针3个小时的数据量
	 *
	 */
	public Long querySensorDataByHour(int sensorId, int projectId, String tenantId, String hoursStr, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ACTIVE_USER_SENSOR_HOUR_COUNTER;
		}else{
			table = bit_map + "." + ACTIVE_USER_SENSOR_HOUR_CUBE;
		}
		String tql = "r0452=select * from " + table + " where sensor_id=" + sensorId + " and project_id=" + projectId
				+ " and tenant_id=" + tenantId + " and " + hoursStr + ";";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Long count = 0l;
		if (result != null) {
			List<ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					count = count + Integer.valueOf((String) resultBean.getValue());
			}
		}
		return count;
	}

	/**
	 * 查询对应小时内的所有日志数
	 * @param sensorMac
	 * @param hoursStr
	 * @param b
	 * @return
	 */
	public Long queryAllLogByHour(String sensorMac, String hoursStr, boolean b) {
		String table = enter_prise + "." + "offline_sensor_heart_hour_counter";

		String tql = "r0452=select * from " + table + " where sensor_mac= '" + sensorMac +  "' and " + hoursStr + ";";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Long count = Long.valueOf(0L);
		if(result != null) {
			List<ResultBean> results = result.getResults();
			Iterator var11 = results.iterator();

			while(var11.hasNext()) {
				ResultBean resultBean = (ResultBean)var11.next();
				if(resultBean.getValue() != null) {
					count = Long.valueOf(count.longValue() + (long)Integer.valueOf((String)resultBean.getValue()).intValue());
				}
			}
		}

		return count;
	}

	public Map<String, Integer> querySensorsDataByHour(String sensorIds, int projectId, String tenantId, String date, String hoursStr) {

		String table = bit_map + "." + ACTIVE_USER_SENSOR_HOUR_CUBE;

		String tql = "r0452=select * from " + table + " where sensor_id in (" + sensorIds + ") and project_id=" + projectId
				+ " and tenant_id=" + tenantId + " and date=" + date + " and hour in(" + hoursStr + ") group by sensor_mac;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map<String, Integer> counts = new HashMap<>();
		if (result != null) {
			List<ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					counts.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return counts;
	}

	// =========================adapter start============================
	/**
	 * 按日统计客流新客总数
	 */
	public  Long queryNewUserGroupCount( Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCount( projectId, start, end, table, isOffline);
		return count;
	}

	public  Long queryNewUserGroupCount(Integer projectId, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCountAllDate( projectId, table, isOffline);
		return count;
	}

	/**
	 * 按日统计客流老客总数
	 */
	public  Long queryOldUserGroupCount(Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCount( projectId, start, end, table, isOffline);

		return count;
	}

	public  Long queryOldUserGroupCount( Integer projectId, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Long count = queryBitmapGroupCountAllDate( projectId, table, isOffline);

		return count;
	}

	/**
	 * 客流趋势-按日统计新增客群数据
	 */
	public  Map<String, Integer> queryNewUserGroupByDate( Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupMap( projectId, start, end, table, isOffline);
		return resultMap;
	}

	/**
	 * 客流趋势-按日统计老客数量
	 */
	public  Map<String, Integer> queryOldUserGroupByDate( Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupMap( projectId, start, end, table, isOffline);
		return resultMap;
	}

	public  Map<String, Integer> querySensorNew( Integer projectId, Integer placeId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupSensorMap( projectId, placeId, start, end, table);
		return resultMap;
	}

	public  Map<String, Integer> queryProjectNew( String tenantId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupProjectMap( tenantId, start, end, table);
		return resultMap;
	}

	public  Map<String, Integer> querySensorOld(Integer projectId, Integer placeId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupSensorMap( projectId, placeId, start, end, table);
		return resultMap;
	}

	public  Map<String, Integer> queryProjectOld(String tenantId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapGroupProjectMap(tenantId, start, end, table);
		return resultMap;
	}

	public  Map<String, Integer> querySensorNewById( Integer projectId, Integer placeId, String start, String end, Integer id, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapSensorByIdMap( projectId, placeId, start, end, id, table);
		return resultMap;
	}

	public  Map<String, Integer> queryProjectNewById( String start, String end, Integer id, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + NEW_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapProjectByIdMap(start, end, id, table);
		return resultMap;
	}

	public  Map<String, Integer> querySensorOldById( Integer projectId, Integer placeId, String start, String end, Integer id, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_SENSOR_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_SENSOR_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapSensorByIdMap( projectId, placeId, start, end, id, table);
		return resultMap;
	}

	public  Map<String, Integer> queryProjectOldById(String start, String end, Integer id, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		}else{
			table = bit_map + "." + OLD_USER_DAY_CUBE;
		}
		Map<String, Integer> resultMap = queryBitmapProjectByIdMap(start, end, id, table);
		return resultMap;
	}
	// =========================adapter end============================

	private static Long queryBitmapGroupCount( Integer projectId, String start, String end, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where  project_id=" + projectId + " and (date between " + start + " and " + end
				+ ") group by date order by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Long count = getSumCountValue1(qer, script);

		return count;
	}

	private static Long queryBitmapGroupCountAllDate( Integer projectId, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where  project_id=" + projectId + " group by date order by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Long count = getSumCountValue1(qer, script);

		return count;
	}

	private static Map<String, Integer> queryBitmapGroupMap( Integer projectId, String start, String end, String table, boolean isOffline) {
		String script = "r30223=select * from " + table + " where  project_id=" + projectId + " and (date between " + start + " and " + end
				+ ") group by date order by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	private static Map<String, Integer> queryBitmapGroupSensorMap(Integer projectId, Integer placeId, String start, String end, String table) {
		String script = "r30223=select * from " + table + " where project_id=" + projectId + " and place_id=" + placeId + " and date between " + start
					+ " and " + end + " group by sensor_id;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	private static Map<String, Integer> queryBitmapGroupProjectMap(String tenantId, String start, String end, String table) {
		String script = "r30223=select * from " + table + " where tenant_id=" + tenantId + " and date between " + start
					+ " and " + end + " group by project_id;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	private static Map<String, Integer> queryBitmapSensorByIdMap( Integer projectId, Integer placeId, String start, String end, Integer id, String table) {
		String script = "r30223=select * from " + table + " where project_id=" + projectId + " and place_id=" + placeId + " and date between " + start
				+ " and " + end + " and sensor_id=" + id + ";";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	private static Map<String, Integer> queryBitmapProjectByIdMap(String start, String end, Integer id, String table) {
		String script = "r30223=select * from " + table + " where date between " + start
				+ " and " + end + " and project_id=" + id + ";";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	public  Map<String, Integer> queryActiveUserHour2(Integer projectId, String start, String end, boolean isOffline) {
		String table = "";
		if(isOffline){
			table = enter_prise + "." + OFFLINE_ACTIVE_USER_HOUR_COUNTER;
		}else{
			table = bit_map + "." + ACTIVE_USER_HOUR_CUBE;
		}
		String script = "r30223=select * from " + table + " where  project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by hour order by hour;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);

		return resultList;
	}

	/**
	 * 返回 某时间段内，进店老客人数
	 */
	public  Long getOldEnterUserCount( Integer projectId, String start, String end, boolean isOffline) {
		String tableOld = "";
		tableOld = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + tableOld + " where  project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());
		return count;
	}

	/**
	 * 返回某时间段内停留人数中老客
	 */
	public  Long getOldStayUserCount( Integer projectId, String start, String end, boolean isOffline) {
		String stayUserCube = bit_map + "." + "stay_old_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			dateSql = " and date between " + start + " and " + end;
			stayUserCube = enter_prise + "." + "offline_stay_old_user_day_counter";
		}
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + stayUserCube + " where project_id=" + projectId + dateSql + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());
		return count;
	}

	/**
	 * 获取某时间段内停留人数中新客。
	 */
	public  Long getNewStayUserCount(Integer projectId, String start, String end, boolean isOffline) {
		String stayUserCube = bit_map + "." + "stay_new_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			dateSql = " and date between " + start + " and " + end;
			stayUserCube = enter_prise + "." + "offline_stay_new_user_day_counter";
		}
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + stayUserCube + " where project_id=" + projectId + dateSql + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());

		return count;
	}

	/**
	 * 获取某时间段内停留人数
	 */
	public static Long getStayUserCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
		String stayUserCube = bit_map + "." + "stay_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			dateSql = " and date between " + start + " and " + end;
			stayUserCube = enter_prise + "." + "offline_stay_user_day_counter";
		}
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + stayUserCube + " where tenant_id=" + tenantId + " and project_id=" + projectId + dateSql + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());

		return count;
	}

	/**
	 * 返回每日停留的新客 数据Map
	 *
	 * 查询当天的停留-offline_stay_user_cube 查询往日的停留-
	 *
	 * @param projectId
	 * @param start
	 * @param end
	 * @return
	 */
	public  Map<String, Integer> getNewStayUserDataGroupByDate(Integer projectId, String start, String end, boolean isOffline) {
		String stayUserCube = bit_map + "." + "stay_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			stayUserCube = enter_prise + "." + OFFLINE_STAY_NEW_USER_DAY_COUNTER;
			dateSql = " and date between " + start + " and " + end;
		}
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + stayUserCube + " where  project_id=" + projectId + dateSql + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	/**
	 * 返回 某时间段内，进店新客人数
	 */
	public  Long getNewEnterUserCount( Integer projectId, String start, String end, boolean isOffline) {
		String tableNew = "";
		tableNew = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;

		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + tableNew + " where  project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Long count = getSumCountValue1(qer, sb.toString());

		return count;
	}

	/**
	 * 返回 某时间段内，进店新客人数
	 */
	public  Long getNewStayUserRoomCount(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
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
	public  Map<String, Integer> getOldEnterUserDataGroupByDate(Integer projectId, String start, String end, boolean isOffline) {
		String tableOld = "";
		tableOld = enter_prise + "." + OFFLINE_OLD_USER_DAY_COUNTER;

		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + tableOld + " where  project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	public  Map<String, Integer> getOldStayUserRoomDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
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
	 * @param projectId
	 * @param start
	 * @param end
	 * @return
	 */
	public  Map<String, Integer> getOldStayUserDataGroupByDate( Integer projectId, String start, String end, boolean isOffline) {
		String stayUserCube = bit_map + "." + "stay_user_day_cube";
		String dateSql = " and date=" + end;
		if (isOffline) {
			stayUserCube = enter_prise + "." + OFFLINE_STAY_OLD_USER_DAY_COUNTER;
			dateSql = " and date between " + start + " and " + end;
		}
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + stayUserCube + " where project_id=" + projectId + dateSql + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	/**
	 * 返回每日进店新客Map
	 *
	 * @param projectId
	 * @param start
	 * @param end
	 * @return
	 */
	public  Map<String, Integer> getNewEnterUserDataGroupByDate(Integer projectId, String start, String end, boolean isOffline) {
		String enterNewUserCounter = "";
		enterNewUserCounter = enter_prise + "." + OFFLINE_NEW_USER_DAY_COUNTER;
		StringBuffer sb = new StringBuffer();
		sb.append("r0721=select * from " + enterNewUserCounter + " where  project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	public  Map<String, Integer> getNewStayUserRoomDataGroupByDate(String tenantId, Integer projectId, String start, String end, boolean isOffline) {
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

	public  Map<String, Integer> getStayUserDataGroupByDate(Integer projectId, String start, String end, boolean isOffline) {
		String stayCounter = "";
		if(isOffline){
			stayCounter = enter_prise + "." + OFFLINE_STAY_USER_DAY_COUNTER;
		}
		StringBuffer sb = new StringBuffer();
		sb.append(
				"r30223=select * from " + stayCounter + " where  project_id=" + projectId + " and date between " + start + " and " + end + " group by date;");
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		Map<String, Integer> resultMap = getMapValue1(qer, sb.toString());
		return resultMap;
	}

	public   Map<String, Long> queryNewUser(String tenantId,  String start, String end, boolean isOffline) {
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
		if (results != null && results.getResults() != null) {
            for (ResultBean resultBean : results.getResults()) {
                resultMap.put(resultBean.getKey().toString(), Long.parseLong(resultBean.getValue().toString()));
            }
        }
		return resultMap;
	}

	public   Map<String, Long> queryOldUser(String tenantId,  String start, String end, boolean isOffline) {
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
        if (results != null && results.getResults() != null) {
            for (ResultBean resultBean : results.getResults()) {
                resultMap.put(resultBean.getKey().toString(), Long.parseLong(resultBean.getValue().toString()));
            }
        }
		return resultMap;
	}




	//enter_prise
	/**
	 * 查询某时间段内房间的停留次数 offline_stay_user_room_day_counter stay_user_room_day_cube
	 *
	 * @return
	 */
	public  Map<String, Integer> queryStayUserRoomDayData(String tenantId, String projectId, String start, String end, String roomId) throws ParseException {
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
	public  Map<String, Integer> queryStayUserDurationDayData(String tenantId, String projectId, String start, String end, String roomId) throws ParseException {
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
	public  Map<String, Integer> queryStayUserTimeLongByRoom(String tenantId, String projectId, String placeId, String start, String end, String roomId) throws ParseException {
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
	public  Map<String, Object> queryActiveUserFrequecyByRoom(String tenantId, String projectId, String placeId, String end, String roomId) throws ParseException {
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

	public  Map<String, Integer> queryActiveUserTracksByRoom(String tenantId, String projectId, String placeId, String roomId, String start, String end, int trackType) throws ParseException {
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

	public  Map<String,Integer> queryProjectTracks(String analysissId,String tenantId,String projectId,String type){
		String counter = enter_prise + "." + "offline_stay_user_project_tracks_counter";
		StringBuffer sb = new StringBuffer();
		if("up".equals(type)){
			sb.append("r30223=select * from " + counter + " where analysiss_id="+analysissId+" and tenant_id=" + tenantId + " and down_project_id ="+projectId+" group by up_project_id;");
		}else{
			sb.append("r30223=select * from " + counter + " where analysiss_id="+analysissId+" and tenant_id=" + tenantId + " and up_project_id ="+projectId+" group by down_project_id;");
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
			if(null != results){
				for (ResultBean resultBean : results) {
					resultMap.put(resultBean.getKey(),resultBean.getValue() != null ? Integer.valueOf(resultBean.getValue().toString()) : 0);
				}
			}
		}
		logger.info("queryEngine-params: " + queryUrl + " sql: " + sql);
		logger.info("queryEngine-result:" + resultMap);
		return resultMap;
	}

	public  Map<String, Integer> queryCounterGroupByDate(Integer projectId, String start, String end, String counter) {
		String script = "r30223=select * from " + enter_prise + "." + counter + " where project_id=" + projectId + " and (date between " + start + " and " + end
				+ ") group by date order by date;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultMap = getMapValue1(qer, script);

		return resultMap;
	}

	//查询连锁项目 top 10
	public  Map<String, Integer> queryCounter( String projectIds, String start, String end, String chartType, boolean isTop10) {
		String cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
	    if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_DAY_COUNTER;
		} else if ("duration".equals(chartType)) {
			cube = OFFLINE_STAY_USER_DURATION_DAY_COUNTER;
		}else if ("stay_times".equals(chartType)) {
			cube = OFFLINE_STAY_USER_TIMES_DAY_COUNTER;
		} else if ("new".equals(chartType)) {
			cube = OFFLINE_NEW_USER_DAY_COUNTER;
		} else if ("old".equals(chartType)) {
			cube = OFFLINE_OLD_USER_DAY_COUNTER;
		}  else if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
		}else if (FRONT.equals(chartType)) {
			cube = OFFLINE_FRONT_USER_DAY_COUNTER; //店前客流
		}

		String script = "r30223=select * from " + enter_prise + "." + cube + " where  project_id in (" + projectIds + ") and date between " + start + " and " + end
				+ "  group by project_id order by value desc limit 10;";
		if(isTop10 == false ){
			script = "r30223=select * from " + enter_prise + "." + cube + " where  project_id in (" + projectIds + ") and date between " + start + " and " + end
					+ "  group by project_id order by value desc;";
		}
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		return resultList;
	}

	/**
	 * 查询子项目每天数据
	 * @param projectIds
	 * @param start
	 * @param end
	 * @param chartType
	 * @return
	 */
	public  Map<String, Integer> queryCounterDayMap( String  projectIds, String start, String end, String chartType) {
		String cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_DAY_COUNTER;
		} else if ("duration".equals(chartType)){
			cube = OFFLINE_STAY_USER_DURATION_DAY_COUNTER;
		} else if ("new".equals(chartType)) {
			cube = OFFLINE_NEW_USER_DAY_COUNTER;
		} else if ("old".equals(chartType)) {
			cube = OFFLINE_OLD_USER_DAY_COUNTER;
		} else if ("stay_times".equals(chartType)) {
			cube = OFFLINE_STAY_USER_TIMES_DAY_COUNTER;
		}else if (FRONT.equals(chartType)) {
			cube = OFFLINE_FRONT_USER_DAY_COUNTER;
		}

		String script = "r30223=select * from " + enter_prise + "." + cube + " where  project_id in (" + projectIds + ") and date between " + start + " and " + end
				+ " group by date,project_id;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		return resultList;
	}

	/**
	 * 查询子项目一段时间汇总数据
	 * @param projectId
	 * @param start
	 * @param end
	 * @param chartType
	 * @return
	 */
	public  Map<String, Integer> queryCounterTotalMap(int projectId, String start, String end, String chartType) {
		String cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
		if ("active".equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
		} else if ("stay".equals(chartType)) {
			cube = OFFLINE_STAY_USER_DAY_COUNTER;
		} else if ("duration".equals(chartType)){
			cube = OFFLINE_STAY_USER_DURATION_DAY_COUNTER;
		} else if ("activeNew".equals(chartType)) {
			cube = OFFLINE_NEW_USER_DAY_COUNTER;
		} else if ("stayNew".equals(chartType)) {
			cube = OFFLINE_STAY_NEW_USER_DAY_COUNTER;
		} else if ("enterNew".equals(chartType)) {
			cube = OFFLINE_NEW_USER_DAY_COUNTER;
		}

		String script = "r30223=select * from " + enter_prise + "." + cube + " where  project_id = " + projectId + " and date between " + start + " and " + end	+ ";";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> resultList = getMapValue1(qer, script);
		return resultList;
	}

	public  Map<String, Integer> queryUserCounter( String projectIds, String start, String end, String chartType) {
        String cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
        if ("active".equals(chartType)) {
            cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
        } else if ("stay".equals(chartType)) {
            cube = OFFLINE_STAY_USER_DAY_COUNTER;
        }else if ("duration".equals(chartType) || WiFiAnalyticsQuerService.STAY_DURATION.equals(chartType)){
			cube = OFFLINE_STAY_USER_DURATION_DAY_COUNTER;
		} else if ("new".equals(chartType)) {
			cube = OFFLINE_NEW_USER_DAY_COUNTER;
		} else if ("stayNew".equals(chartType)) {
			cube = OFFLINE_STAY_NEW_USER_DAY_COUNTER;
		}else if ("old".equals(chartType)) {
			cube = OFFLINE_OLD_USER_DAY_COUNTER;
		}else if (VISIT_TIMES.equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_TIMES_DAY_COUNTER;
		}else if (STAY_TIMES.equals(chartType)) {
			cube = OFFLINE_STAY_USER_TIMES_DAY_COUNTER;
		}else if (VISIT_DURATION.equals(chartType)) {
			cube = OFFLINE_ACTIVE_USER_DURATION_DAY_COUNTER;
		}

        String script = "r30223=select * from " + enter_prise + "." + cube + " where  project_id in (" + projectIds + ") and date between " + start + " and " + end
                + "  group by project_id order by value desc;";

        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Map<String, Integer> resultList = getMapValue1(qer, script);

        return resultList;
    }

	public static String findLastData( Integer projectId) {
		String cube = OFFLINE_ACTIVE_USER_DAY_COUNTER;
		String script = "r30223=select * from " + enter_prise + "." + cube + " where  project_id=" + projectId + " group by date order by date desc limit 1;";
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


	//驻留时长
	public  Map<String, Integer> queryEnterDurationDistributeCounter( Integer projectId, String start, String end) {
		String counter = OFFLINE_PROJECT_ENTER_DURATION_DISTRIBUTE_COUNTER;

		String script = "r30223=select * from " + enter_prise + "." + counter + " where project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by duration;";

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String, Integer> map = getMapValue1(qer, script);
		return map;
	}

	//查询月度指标
	public static String queryMonthCounter( Integer projectId,String month,String type) {
		String counter = OFFLINE_MONTH_METRIC_COUNTER;
		String script = "r30223=select * from " + enter_prise + "." + counter + " where  project_id=" + projectId + " and month='" + month +"' and type='" + type + "';";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			if (results.size() > 0) {
				ResultBean resultBean = results.get(0);
				return resultBean.getValue() != null ? resultBean.getValue() + "" : "0";
			}
		}
		return null;
	}


	public Map <String, Integer> queryNoDataSensor(String apmacs, String date, String hour) {
		String table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		String tql = "r0452=select * from " + table + " where sensor_mac in (" + apmacs + ") and date=" + date + " and hour>=" + hour + " group by sensor_mac;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map <String, Integer> maps = new HashMap <>();
		if (result != null) {
			List <ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					maps.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return maps;
	}

	/**
	 * 当前时间之前多少小时内的数据（支持跨天）
	 * @param apmacs
	 * @param date
	 * @param hour
	 * @param hourStr
	 * @param dateStr
	 * @return
	 */
	public static Map <String, Integer> queryNoDataForHourSensor(String apmacs, String date, String hour, String dateStr, String hourStr) {
		String table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		String tql = "r0452=select * from " + table + " where sensor_mac = '" + apmacs + "' and (( date >= '" + date + "' and hour>=" + hour + " ) and ( date <= '"+dateStr+"'  and hour <= "+hourStr+" ))"
				+ " group by sensor_mac;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map <String, Integer> maps = new HashMap <>();
		if (result != null) {
			List <ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					maps.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return maps;
	}

	public Map <String, Integer> queryLastDataDate(String apmacs) {
		String table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		String tql = "r0452=select * from " + table + " where sensor_mac in (" + apmacs + ") and metric_value >0 group by date order by date desc limit 1;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map <String, Integer> maps = new HashMap <>();
		if (result != null) {
			List <ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					maps.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return maps;
	}

	public Map <String, Integer> queryLastDataHour(String apmacs, String date) {
		String table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		String tql = "r0452=select * from " + table + " where sensor_mac in (" + apmacs + ") and date=" + date + " metric_value >0 group by hour order by hour desc limit 1;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map <String, Integer> maps = new HashMap <>();
		if (result != null) {
			List <ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					maps.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return maps;
	}

	public Map <String, Integer> querySensorEffectiveMac(String projectId, String apmacs, String startDate, String endDate, String type) {
		String table = "";
		if (type.equals(NEW)) {
			table = enter_prise + "." + OFFLINE_NEW_USER_SENSOR_DAY_COUNTER;
		} else if (type.equals(OLD)) {
			table = enter_prise + "." + OFFLINE_OLD_USER_SENSOR_DAY_COUNTER;
		}
		String tql = "r0452=select * from " + table + " where project_id = " + projectId + " and sensor_id in (" + apmacs + ") and date between " + startDate + " and " + endDate + " group by date;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map <String, Integer> maps = new HashMap <>();
		if (result != null) {
			List <ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					maps.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return maps;
	}

	public Map <String, Integer> querySensorAllMac(String apmacs, String startDate, String endDate) {
		String table = enter_prise + "." + OFFLINE_SENSOR_ALL_MAC_DAY_COUNTER;
		String tql = "r0452=select * from " + table + " where sensor_id in (" + apmacs + ") and date between " + startDate + " and " + endDate + " group by date;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map <String, Integer> maps = new HashMap <>();
		if (result != null) {
			List <ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					maps.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return maps;
	}

	public Map <String, Integer> querySensorLog(String apmacs, String startDate, String endDate, String type) {
		String table = "";
		if (type.equals(TOTAL)) {
			table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		} else if (type.equals(EFFECTIVE)) {
			table = enter_prise + "." + OFFLINE_SENSOR_EFFECTIVE_HOUR_COUNTER;
		}
		String tql = "r0452=select * from " + table + " where sensor_mac in (" + apmacs + ") and date between " + startDate + " and " + endDate + " group by date;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		Map <String, Integer> maps = new HashMap <>();
		if (result != null) {
			List <ResultBean> results = result.getResults();
			for (ResultBean resultBean : results) {
				if (resultBean.getValue() != null)
					maps.put(resultBean.getKey(), Integer.valueOf((String) resultBean.getValue()));
			}
		}
		return maps;
	}

	/**
	 * 查询7天时间内有的日志数据小时数
	 * @param sevenDaysAgoTime
	 * @param openingTime
	 * @param closingTime
	 * @param apmac
	 * @param nowDate
	 * @return
	 */
	public  int querySevenDaysData(String sevenDaysAgoTime, String openingTime,
										 String closingTime, String apmac, String nowDate) {
		String table = enter_prise + "." + OFFLINE_SENSOR_HEART_HOUR_COUNTER;
		String tql = "r0452=select * from " + table + " where sensor_mac = '" + apmac + "' and ( date >= '" + sevenDaysAgoTime + "' and date <= '"+nowDate+"' ) and ( hour >= " + openingTime + "  and hour < "+closingTime+" )"
				+ "  and metric_value > 0 group by sensor_mac,hour,date;";
		QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl, tql);
		int count  = 0;
		if (result != null) {
			List<ResultBean> results = result.getResults();
			count = results.size();
		}
		return count;
	}


}

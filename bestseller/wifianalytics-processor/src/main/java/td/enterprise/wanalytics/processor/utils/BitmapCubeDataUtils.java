package td.enterprise.wanalytics.processor.utils;

import org.apache.storm.tuple.Values;
import td.enterprise.framework.commons.plugin.line.Line;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

// active_user_day_cube
// active_user_hour_cube
// new_user_day_cube
// new_user_sensor_day_cube
// old_user_day_cube
// old_user_sensor_day_cube
// active_user_sensor_hour_cube
public class BitmapCubeDataUtils {

	public static Map<String, Values> createBitmapCubeData(Line line) {
		Map<String, Values> returnMap = new HashMap<String, Values>();
		Values cubeDataValues = createActiveUserDayCube(line);
		if (cubeDataValues != null) {
			returnMap.put("active_user_day_cube", cubeDataValues);
		}
		cubeDataValues = createActiveUserHourCube(line);
		if (cubeDataValues != null) {
			returnMap.put("active_user_hour_cube", cubeDataValues);
		}
		cubeDataValues = createNewUserDayCube(line);
		if (cubeDataValues != null) {
			returnMap.put("new_user_day_cube", cubeDataValues);
		}
		cubeDataValues = createNewUserSensorDayCube(line);
		if (cubeDataValues != null) {
			returnMap.put("new_user_sensor_day_cube", cubeDataValues);
		}
		cubeDataValues = createOldUserDayCube(line);
		if (cubeDataValues != null) {
			returnMap.put("old_user_day_cube", cubeDataValues);
		}
		cubeDataValues = createOldUserSensorDayCube(line);
		if (cubeDataValues != null) {
			returnMap.put("old_user_sensor_day_cube", cubeDataValues);
		}
		
		cubeDataValues = createActiveUserSensorHourCube(line);
		if (cubeDataValues != null) {
			returnMap.put("active_user_sensor_hour_cube", cubeDataValues);
		}
		
		cubeDataValues = createEnterUserCube(line);
		if (cubeDataValues != null) {
			returnMap.put("enter_user_day_cube", cubeDataValues);
		}

		return returnMap;
	}

	/**
	 * 当日活跃用户
	 * @param line
	 * @return
	 */
	private static Values createActiveUserDayCube(Line line) {

		long offset = (long) line.get(LineKeyConstants.projectoffset);

		// tenant_id project_id date
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		return new Values(tenantid, projectid, date, offset);
	}

	/**
	 * 当日小时活跃用户
	 * @param line
	 * @return
	 */
	private static Values createActiveUserHourCube(Line line) {

		long offset = (long) line.get(LineKeyConstants.projectoffset);

		//	tenant_id project_id date hour
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));

		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		int hour = DateTimeUtil.getHours(calendar.getTime());
		return new Values(tenantid, projectid, date, hour, offset);
	}

	/**
	 * 当日新增用户
	 * @param line
	 * @return
	 */
	private static Values createNewUserDayCube(Line line) {
		boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
		if (!newUser) { // TODO 不是新用户
			return null;
		}
		long offset = (long) line.get(LineKeyConstants.projectoffset);
		// tenant_id project_id date
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		return new Values(tenantid, projectid, date, offset);
	}

	/**
	 * 当日探针新增用户
	 * @param line
	 * @return
	 */
	private static Values createNewUserSensorDayCube(Line line) {

		boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
		if (!newUser) { // TODO 不是新用户
			return null;
		}
		long offset = (long) line.get(LineKeyConstants.projectoffset);

		//	tenant_id project_id place_id sensor_id date
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		int placeid = ((Long) line.get(LineKeyConstants.projectplaceid)).intValue();
		int sensorid = ((Long) line.get(LineKeyConstants.sensorid)).intValue();
		String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));

		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		return new Values(tenantid, projectid, placeid, sensorid, date, offset);
	}

	/**
	 * 当日老客
	 * @param line
	 * @return
	 */
	private static Values createOldUserDayCube(Line line) {

		boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
		if (newUser) { // TODO 不是老用户
			return null;
		}
		long offset = (long) line.get(LineKeyConstants.projectoffset);
		// tenant_id project_id date
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		return new Values(tenantid, projectid, date, offset);
	}

	/**
	 * 当日探针老客
	 * @param line
	 * @return
	 */
	private static Values createActiveUserSensorHourCube(Line line) {
		long offset = (long) line.get(LineKeyConstants.projectoffset);
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		int placeid = ((Long) line.get(LineKeyConstants.projectplaceid)).intValue();
		int sensorid = ((Long) line.get(LineKeyConstants.sensorid)).intValue();
		String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		String hour = calendar.get(Calendar.HOUR_OF_DAY) + "";
		return new Values(tenantid, projectid, placeid, sensorid, date, hour,offset);
	}
	
	/**
	 * 当日探针老客
	 * @param line
	 * @return
	 */
	private static Values createOldUserSensorDayCube(Line line) {

		boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
		if (newUser) { // TODO 不是老用户
			return null;
		}
		long offset = (long) line.get(LineKeyConstants.projectoffset);

		// tenant_id project_id place_id sensor_id date
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		int placeid = ((Long) line.get(LineKeyConstants.projectplaceid)).intValue();
		int sensorid = ((Long) line.get(LineKeyConstants.sensorid)).intValue();
		String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		return new Values(tenantid, projectid, placeid, sensorid, date, offset);
	}

	/**
	 * 进店用户
	 * @param line
	 * @return
	 */
	private static Values createEnterUserCube(Line line) {
		long offset = (long) line.get(LineKeyConstants.projectoffset);
		String tenantid = (String) line.get(LineKeyConstants.tenantid);
		int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
		String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
		Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
		String date = DateTimeUtil.formatDate(calendar.getTime());
		return new Values(tenantid, projectid, date, offset);
	}
	

	

}

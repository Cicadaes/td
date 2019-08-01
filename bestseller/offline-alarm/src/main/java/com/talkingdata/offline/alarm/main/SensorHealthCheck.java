package com.talkingdata.offline.alarm.main;

import java.security.GeneralSecurityException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

import com.talkingdata.offline.alarm.bean.SensorBean;
import com.talkingdata.offline.alarm.util.MailUtil;

public class SensorHealthCheck {
	
	private static String tendantId = "2000247";
	
	public static void main(String[] args) {
		
		if(args.length<4){
			System.out.println("Usage : Params is wrong!");
			System.exit(-1);
		}
		
		String recipients = args[0];//"yunlong.wang@tendcloud.com"
		String date = args[1];//"2016-09-23"
		String queryUrl = args[2];//"http://54.222.252.185/wifianalytics-queryengine/api/query"
		String url = args[3];//"jdbc:mysql://54.222.189.137:5000/wifianalytics?user=wifianalytics&password=wifianalytics&useUnicode=true&characterEncoding=UTF8";
		String[] recipientArr = recipients.split(",");
		List<SensorBean> sensorList = getSensorInfo(url, tendantId);
		Map<String, Integer> newUserMap = queryNewSensorCube(queryUrl,tendantId,date);
		Map<String, Integer> oldUserMap = queryOldSensorCube(queryUrl,tendantId,date);
		StringBuilder sb = new StringBuilder();
		StringBuilder sbErr = new StringBuilder();
		sb.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">");
		sb.append("<html>");
		sb.append("<body>");
		sb.append("<table border='1'cellspacing='0' cellpadding='0'>");
		sb.append("<tr><td>项目ID	</td><td>项目名称</td><td>所属场地</td><td>所属房间</td><td>探针mac</td><td>总人数</td></tr>");
		for(SensorBean bean:sensorList){
			int newUserNum = newUserMap.get(bean.getSensorId())==null?0:newUserMap.get(bean.getSensorId());
			int oldUserNum = oldUserMap.get(bean.getSensorId())==null?0:oldUserMap.get(bean.getSensorId());
			bean.setNewUserNum(newUserNum);
			bean.setOldUserNum(oldUserNum);
			if(bean.getAllUserNum()==0){
				sbErr.append("<tr style='color:red'><td>"+bean.getProjectId()+"</td><td>"+bean.getProjectName()+"</td>")
				  .append("<td>"+bean.getProjectPlacName()+"</td><td>"+bean.getRoomNmae()+"</td><td>"+bean.getSensorMac()+"</td>")
				  .append("<td>"+bean.getAllUserNum()+"</td></tr>");
			}else{
				sb.append("<tr><td>"+bean.getProjectId()+"</td><td>"+bean.getProjectName()+"</td>")
				  .append("<td>"+bean.getProjectPlacName()+"</td><td>"+bean.getRoomNmae()+"</td><td>"+bean.getSensorMac()+"</td>")
				  .append("<td>"+bean.getAllUserNum()+"</td></tr>");
			}
		}
		sb.append(sbErr);
		sb.append("</table>");
		sb.append("</body>");
		sb.append("</html>");
		try {
			boolean bl = MailUtil.sendHtmlMail("Sensor Health Check Mail",	sb.toString(), recipientArr);
		} catch (GeneralSecurityException e) {
			System.out.println("ERROR : Send mail is wrong !");
			e.printStackTrace();
		}
	}

	public static List<SensorBean> getSensorInfo(String url, String tendantId) {
		List<SensorBean> sensorList = new ArrayList<SensorBean>();
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		String sql = "select t1.project_id,t2.project_name,t1.project_place_name,t1.room_name room_name,t1.sensor_id,t1.sensor_mac "
				+ "from TD_SENSOR_INSTALL_INFO t1,TD_PROJECT t2 "
				+ " where t1.project_id = t2.id and t1.tenant_id="
				+ tendantId + " and t1.status=1 order by t1.project_id";
		System.out.println(sql);
		try {
			conn = DriverManager.getConnection(url);
			Class.forName("com.mysql.jdbc.Driver");
			ps = conn.prepareStatement(sql);
			conn.setAutoCommit(true);
			ps.setFetchSize(2000);
			rs = ps.executeQuery();
			while (rs.next()) {
				SensorBean bean = new SensorBean();
				bean.setProjectId(rs.getString("project_id"));
				bean.setProjectName(rs.getString("project_name"));
				bean.setProjectPlacName(rs.getString("project_place_name"));
				bean.setSensorId(rs.getString("sensor_id"));
				bean.setSensorMac(rs.getString("sensor_mac"));
				bean.setRoomNmae(rs.getString("room_name"));
				sensorList.add(bean);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}finally{
			try {
				rs.close();
				ps.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return sensorList;
	}
	
	public static Map<String, Integer> queryNewSensorCube(String queryUrl,
			String tenantId, String date) {
		String sql = "r30223=select * from bitmap.new_user_sensor_day_cube  where tenant_id="
				+ tenantId
				+ " and date='"
				+ date
				+ "' group by  sensor_id;r30223.subkey(0);";
		QueryEngineResult results = QueryServiceUtils.invoke("post", queryUrl,
				sql);
		Map<String, Integer> resultMap = new HashMap<String, Integer>();
		for (ResultBean resultBean : results.getResults()) {
			resultMap.put(resultBean.getKey().toString(),
					Integer.parseInt(resultBean.getValue().toString()));
		}
		return resultMap;
	}
	
	public static Map<String, Integer> queryOldSensorCube(String queryUrl,
			String tenantId, String date) {
		String sql = "r30223=select * from bitmap.old_user_sensor_day_cube  where tenant_id="
				+ tenantId
				+ " and date='"
				+ date
				+ "' group by  sensor_id;r30223.subkey(0);";
		QueryEngineResult results = QueryServiceUtils.invoke("post", queryUrl,
				sql);
		Map<String, Integer> resultMap = new HashMap<String, Integer>();
		for (ResultBean resultBean : results.getResults()) {
			resultMap.put(resultBean.getKey().toString(),
					Integer.parseInt(resultBean.getValue().toString()));
		}
		return resultMap;
	}
	
	
}

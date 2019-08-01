package com.talkingdata.offline.alarm.main;

import java.security.GeneralSecurityException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.talkingdata.offline.alarm.util.MailUtil;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

public class PassengerFlowHealthCheck {

	private static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
	private static Map<String, Integer> basisMap = new HashMap<String, Integer>();
	private static List<String> projectIdList = new ArrayList<String>();
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
		Map<String, String> projectMap = getProjectMap(url, tendantId);
		Map<String, Integer> passengerFlowvMap = queryPassengerFlow(queryUrl,
				tendantId, date);
		Map<String, Integer> passengerFlowvMap_10 = queryPassengerFlow_10(
				queryUrl, tendantId, date);
		StringBuilder sb = new StringBuilder();
		sb.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">");
		sb.append("<html>");
		sb.append("<body>");
		sb.append("<table border='1'cellspacing='0' cellpadding='0'>");
		sb.append("<tr><td>项目ID	</td><td>项目名称	</td><td>当日客流</td><td>10日平均客流</td></tr>");
		for (String key : projectIdList) {
			int passengerFlow = passengerFlowvMap.get(key) == null ? 0	: passengerFlowvMap.get(key);
			if(passengerFlow==0){
				sb.append("<tr style='color:red'><td>" + key + "</td><td>" + projectMap.get(key)+ "</td><td>" + passengerFlow + "</td><td>"
						+ (passengerFlowvMap_10.get(key) == null ? 0	: passengerFlowvMap_10.get(key)) + "</td></tr>");
			}else{
				sb.append("<tr><td>" + key + "</td><td>" + projectMap.get(key)+ "</td><td>" + passengerFlow + "</td><td>"
						+ (passengerFlowvMap_10.get(key) == null ? 0	: passengerFlowvMap_10.get(key)) + "</td></tr>");
			}
		}
		sb.append("</table>");
		sb.append("</body>");
		sb.append("</html>");
		try {
			boolean bl = MailUtil.sendHtmlMail("Passenger Flow Health Check Mail",
					sb.toString(), recipientArr);
		} catch (GeneralSecurityException e) {
			System.out.println("ERROR : Send mail is wrong !");
			e.printStackTrace();
		}
	}

	public static Map<String, String> getProjectMap(String url, String tendantId) {
		Map<String, String> projectMap = new HashMap<String, String>();
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = DriverManager.getConnection(url);
			Class.forName("com.mysql.jdbc.Driver");
			ps = conn.prepareStatement("select id,project_name from TD_PROJECT where tenant_id="
							+ tendantId + " and status=1 order by id");
			conn.setAutoCommit(true);
			ps.setFetchSize(2000);
			rs = ps.executeQuery();
			while (rs.next()) {
				projectMap
						.put(rs.getString("id"), rs.getString("project_name"));
				basisMap.put(rs.getString("id"), 0);
				projectIdList.add(rs.getString("id"));
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
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
		return projectMap;
	}

	public static Map<String, Integer> queryPassengerFlow(String queryUrl,
			String tenantId, String date) {
		String sql = "r30223=select * from bitmap.active_user_day_cube where tenant_id="
				+ tenantId
				+ " and date='"
				+ date
				+ "' group by  project_id;r30223.subkey(0);";
		QueryEngineResult results = QueryServiceUtils.invoke("post", queryUrl,
				sql);
		Map<String, Integer> resultMap = new HashMap<String, Integer>();
		for (ResultBean resultBean : results.getResults()) {
			resultMap.put(resultBean.getKey().toString(),
					Integer.parseInt(resultBean.getValue().toString()));
		}
		return resultMap;
	}

	public static Map<String, Integer> queryPassengerFlow_10(String queryUrl,
			String tenantId, String date) {
		Calendar calendar = Calendar.getInstance();
		try {
			calendar.setTime(df.parse(date));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		for (int i = 0; i < 10; i++) {
			calendar.add(Calendar.DAY_OF_YEAR, 0 - i);
			Map<String, Integer> map = queryPassengerFlow(queryUrl, tenantId,
					df.format(calendar.getTime()));
			for (String key : projectIdList) {
				basisMap.put(key, basisMap.get(key)
						+ (map.get(key) == null ? 0 : map.get(key)));
			}
		}
		for (String key : projectIdList) {
			basisMap.put(key, basisMap.get(key) / 10);
		}

		return basisMap;

	}
}

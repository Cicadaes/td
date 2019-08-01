package com.talkingdata.offline.alarm.main;

import java.security.GeneralSecurityException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

import com.mysql.fabric.xmlrpc.base.Array;
import com.talkingdata.offline.alarm.bean.ProjectBean;
import com.talkingdata.offline.alarm.util.MailUtil;

public class PassengerFlowHourCheck {
	
	private static DateFormat format=new SimpleDateFormat("yyyy-MM-dd");
	private static DateFormat format2=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static String tendantId = "2000247";
	
	public static void main(String[] args) throws ParseException {
		
		if(args.length<3){
			System.out.println("Usage : Params is wrong!");
			System.exit(-1);
		}
		
//		String recipients = "yunlong.wang@tendcloud.com";
//		String queryUrl = "http://54.222.252.185/wifianalytics-queryengine/api/query";
//		String url = "jdbc:mysql://54.222.189.137:5000/wifianalytics?user=wifianalytics&password=wifianalytics&useUnicode=true&characterEncoding=UTF8";
		String recipients = args[0];
		String queryUrl = args[1];
		String url = args[2];
		String[] recipientArr = recipients.split(",");
		
		Date time=new Date();
		String date=format.format(time);//得到当前日期
		Calendar calendar=Calendar.getInstance();
		calendar.setTime(time);
		calendar.add(Calendar.HOUR_OF_DAY, -1);
		int hour = calendar.getTime().getHours();//得到当前时间的前1小时数
		long nowTime = calendar.getTime().getTime();//得到当前时间的前1小时的毫秒数
		
		List<ProjectBean> errProjectList = new ArrayList<ProjectBean>();//定义一个List用于存放，在营业时间内但没有客流的项目信息
		List<ProjectBean> projectList = getProjectList(url, tendantId, date);//得到所有项目信息
		Map<String, Integer> passengerFlowvMap = queryPassengerFlow(queryUrl,tendantId, date,hour);//查看每小时的客流
		for (String key : passengerFlowvMap.keySet()) {
			System.out.println(key + " ============="
					+ passengerFlowvMap.get(key));
		}
		
		for(int i=0;i<projectList.size();i++){
			long startTime =format2.parse(projectList.get(i).getOpenTime()).getTime();
			long endTime =format2.parse(projectList.get(i).getCloseTime()).getTime();
			if(startTime<=nowTime&&nowTime<=endTime){
				String projectId = projectList.get(i).getProjectId();
				if (passengerFlowvMap.get(projectId) == null
						|| "".equals(passengerFlowvMap.get(projectId))
						|| "0".equals(passengerFlowvMap.get(projectId))) {
					ProjectBean bean = new ProjectBean();
					bean.setProjectId(projectId);
					bean.setProjectName(projectList.get(i).getProjectName());
					bean.setOpenTime(projectList.get(i).getOpenTime());
					bean.setCloseTime(projectList.get(i).getCloseTime());
					int PassengerFlow = passengerFlowvMap.get(projectId) == null ? 0 : passengerFlowvMap.get(projectId);
					bean.setPassengerFlow(PassengerFlow);
					errProjectList.add(bean);
				}
			}
		}
		
		//发邮件
		if(errProjectList.size()>0){
			StringBuilder sb = new StringBuilder();
			sb.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">");
			sb.append("<html>");
			sb.append("<body>");
			sb.append("<table border='1'cellspacing='0' cellpadding='0'>");
			sb.append("<tr><td>项目ID	</td><td>项目名称	</td><td>营业开始时间</td><td>营业结束时间</td><td>异常时段</td><td>当前客流</td></tr>");
			for(ProjectBean bean : errProjectList){
				int passengerFlow = passengerFlowvMap.get(bean.getProjectId()) == null ? 0	: passengerFlowvMap.get(bean.getProjectId());
				sb.append("<tr><td>"+bean.getProjectId()+"</td><td>"+bean.getProjectName()+"</td><td>"+bean.getOpenTime()+"</td>");
				sb.append("<td>"+bean.getCloseTime()+"</td><td>"+(hour-1)+":00~"+hour+":00"+"</td><td>"+passengerFlow+"<td></tr>");
			}
			sb.append("</table>");
			sb.append("</body>");
			sb.append("</html>");
			try {
				boolean bl = MailUtil.sendHtmlMail("Passenger Flow Hour Check Mail",
						sb.toString(), recipientArr);
			} catch (GeneralSecurityException e) {
				System.out.println("ERROR : Send mail is wrong !");
				e.printStackTrace();
			}
		}
	}
	
	public static List<ProjectBean> getProjectList(String url, String tendantId,String date) {
		List<ProjectBean> projectList = new ArrayList<ProjectBean>();
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = DriverManager.getConnection(url);
			Class.forName("com.mysql.jdbc.Driver");
			ps = conn.prepareStatement("select id,project_name,opening_time,closing_time from TD_PROJECT where tenant_id="
							+ tendantId + " and status=1 and id not in (4,45,50) order by id");
			conn.setAutoCommit(true);
			ps.setFetchSize(2000);
			rs = ps.executeQuery();
			while (rs.next()) {
				ProjectBean bean = new ProjectBean();
				bean.setProjectId(rs.getString("id"));
				bean.setProjectName(rs.getString("project_name"));
				bean.setOpenTime(date+" "+rs.getString("opening_time")+":00");
				bean.setCloseTime(date+" "+rs.getString("closing_time")+":00");
				projectList.add(bean);
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
		return projectList;
	}
	
	public static Map<String, Integer> queryPassengerFlow(String queryUrl,
			String tenantId, String date,int hour) {
		String sql = "r30223=select * from bitmap.active_user_hour_cube where tenant_id="
				+ tenantId	+ " and date='"	+ date +"' and hour='"+hour
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
}

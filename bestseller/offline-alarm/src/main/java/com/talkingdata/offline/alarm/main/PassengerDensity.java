package com.talkingdata.offline.alarm.main;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.talkingdata.offline.alarm.bean.ProjectBean;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

public class PassengerDensity {

	private static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");// 设置日期格式
	private static DecimalFormat    df2   = new DecimalFormat("######0.00");   
	private static String tenantId = "2000247";

	public static void main(String[] args) {

		if (args.length < 2) {
			System.out.println("Usage : Params is wrong!");
			System.exit(-1);
		}
//		String queryUrl = "http://54.222.252.185/wifianalytics-queryengine/api/query";
//		String url = "jdbc:mysql://54.222.189.137:5000/wifianalytics?user=wifianalytics&password=wifianalytics&useUnicode=true&characterEncoding=UTF8";
		String queryUrl = args[0];// "http://54.222.252.185/wifianalytics-queryengine/api/query"
		String url = args[1];// "jdbc:mysql://54.222.189.137:5000/wifianalytics?user=wifianalytics&password=wifianalytics&useUnicode=true&characterEncoding=UTF8";
		Date date = new Date();
		String endTime = df.format(date);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_YEAR, -30);
		String startTime = df.format(calendar.getTime());
		System.out.println(startTime+"----"+endTime);
		List<ProjectBean> list = queryProjectArea(tenantId, url);
		for(ProjectBean bean:list){
			Map<String,Double> activeMap=queryPassengerFlow(queryUrl,tenantId, bean.getProjectId(), startTime, endTime, "active");
			Map<String,Double> stayMap=queryPassengerFlow(queryUrl,tenantId, bean.getProjectId(), startTime, endTime, "stay");
			Double activeDensity = 0.00;
			Double stayDensity = 0.00;
			if(bean.getAreas()>0 && activeMap.size()>0 && stayMap.size()>0){
				activeDensity = activeMap.get(bean.getProjectId())/bean.getAreas();
				stayDensity = stayMap.get(bean.getProjectId())/bean.getAreas();
				System.out.println(bean.getProjectId()+"---"+bean.getProjectName()+"---"+df2.format(activeDensity)+"---"+df2.format(stayDensity));
			}
		}

	}
	
	
	public static  List<ProjectBean> queryProjectArea(String tenantId,String url){
		List<ProjectBean> projectList = new ArrayList<ProjectBean>();
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = DriverManager.getConnection(url);
			Class.forName("com.mysql.jdbc.Driver");
			ps = conn.prepareStatement("select t2.id,t2.project_name,round(sum(t1.area), 2) areas from TD_ROOM t1,TD_PROJECT t2 where t1.project_id = t2.id and t2.status=1 and t2.project_type=2 and t2.tenant_id="
							+ tenantId + " group by t2.id");
			conn.setAutoCommit(true);
			ps.setFetchSize(2000);
			rs = ps.executeQuery();
			while (rs.next()) {
				ProjectBean bean = new ProjectBean();
				bean.setProjectId(rs.getString("id"));
				bean.setProjectName(rs.getString("project_name"));
				bean.setAreas(rs.getDouble("areas"));
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
	
	public static Map<String, Double> queryPassengerFlow(String queryUrl,
			String tenantId, String projectId, String startTime,
			String endTime, String chartType) {
		String cube = "";
		if ("active".equals(chartType)) {
			cube = "active_user_day_cube ";
		} else if ("stay".equals(chartType)) {
			cube = "stay_user_day_cube";
		}

		String script = "r30223=select * from bitmap." + cube
				+ " where tenant_id=" + tenantId + " and project_id="
				+ projectId + " and date between " + startTime + " and "
				+ endTime + " group by date;";
		QueryEngineResult results = QueryServiceUtils.invoke("post", queryUrl,
				script);
		Map<String, Double> resultMap = new HashMap<String, Double>();
		
		Double sum =0.00;
		for (ResultBean resultBean : results.getResults()) {
			
			sum += Double.parseDouble(resultBean.getValue().toString());
		}
		resultMap.put(projectId, sum);
		return resultMap;
	}
}

package com.talkingdata.wifianalytics.etl.support.util;

import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.util.Date;
import java.util.List;
import java.util.Map;


public class OffsetUtils {

	 public static Date getTimeFromOffset(String tenantId,String projectId,String offset){
		 String sql = "select `time` from project_" + tenantId + "_" + projectId + " where `offset` =" + offset ;
		 List<Map<String,Object>>  list = QueryUtils.query(sql,QueryUtils.USER_DB);
		 if(null != list && list.size() == 1){
			  return  (Date)list.get(0).get("time") ;
		 }
		 return null;
	 }
	 
	 public static void main(String []args ){
		 Date time = OffsetUtils.getTimeFromOffset("2000247","1","1");
		 System.out.println(time);
	 }

}

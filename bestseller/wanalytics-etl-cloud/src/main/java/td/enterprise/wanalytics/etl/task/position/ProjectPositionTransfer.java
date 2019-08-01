package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.util.EnclosureUtil;
import td.enterprise.wanalytics.etl.util.PositionUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 位置位置, 各字段用”\t” 隔开
 *    聚集点用”|” 分割平常日跟周末，前面平常日后面周末；其中不同时段用”;”划分，时段内部先用”:”划分出时段和位置信息,如果该时间段出现多个位置，各位置用”,”隔开；位置信息用”_”划分出纬度，经度，次数
 * @author Administrator
 *
 */
public class ProjectPositionTransfer {
	
	public static Logger logger = Logger.getLogger(ProjectPositionTransfer.class);
	
	private final String columnSeparator = "\t";
    private final String workDaySeparator = "\\|";
    private final String positionsSeparator = ";";
    private final String hourSeparator = ":";
    private final String latLngAndCountsSeparator = "_";
    private final int columnSize = 3;
    private final int latLngCountColumnSize = 3;
    
    public final String separator = ",";//同一时段多个位置
	
	public List<ProjectPosition> transfer(String line,String cityName){
		try {
            String[] columns = line.split(columnSeparator);
            if (columns.length == columnSize) {
            	List<ProjectPosition> list = new ArrayList<ProjectPosition> ();
            	String mac =  columns[0];//第一列是mac地址
            	String tdId = columns [2];
                String[] workDayOrNot = columns[1].split(workDaySeparator);
                if (workDayOrNot != null && workDayOrNot.length <= 2 && workDayOrNot.length >= 1) {
                	List<ProjectPosition> workDayList = null;
                	List<ProjectPosition> weekDayList = null; 
                	if(!StringUtils.isBlank(workDayOrNot[0]) ){
                		workDayList =  getProjectPosition(Constant.DAY_TYPE_WORK_DAY,workDayOrNot[0],mac,tdId,cityName);
                	}
                	
                	if(workDayOrNot.length == 2 && !StringUtils.isBlank(workDayOrNot[1]) ){
                		weekDayList =  getProjectPosition(Constant.DAY_TYPE_WEEKDAY,workDayOrNot[1],mac,tdId,cityName);
                	}
                	
                	if(null != workDayList && !workDayList.isEmpty()){
                		list.addAll(workDayList);
                	}
                	if(null != weekDayList && !weekDayList.isEmpty()){
                		list.addAll(weekDayList);
                	}
                }else{
                	logger.warn("Date of " + " line is not valid.Ignore it");
                }
                
                return list;
            }
        } catch (Exception e) {
            logger.error("ProjectPositionTransfer parse error :" + line , e);
        }
		return null;
	}
	
	public  List<ProjectPosition> getProjectPosition(String dayType,String hourLngLatCount,String mac,String tdId,String cityName){
		List<ProjectPosition> list = new ArrayList<ProjectPosition> ();
		String[] positions = hourLngLatCount.split(positionsSeparator);//分割时段
	    for (String position : positions) {
	        String[] hourLatLng = position.split(hourSeparator);
	        if (hourLatLng != null && hourLatLng.length == 2) {
	        	 String hour = hourLatLng[0];
	        	 //同一个时段，可能有多个位置 
	        	 String latLngStr  = hourLatLng[1];
	        	 for(String temp : latLngStr.split(separator)){
	        		 String[] latLngCount = temp.split(latLngAndCountsSeparator);
		        	 if (latLngCount != null && latLngCount.length == latLngCountColumnSize) {
		        		 ProjectPosition tempPP = new ProjectPosition();
		        		 tempPP.setMac(mac);
		        		 tempPP.setTdId(tdId);
		        		 int hourValue = Integer.parseInt(hour);
		        		 tempPP.setHour(hourValue);
		        		 /**
		        		  * 注意：findByType接口中的type类型分别为：1、交通站 2、居住地 3、工作地
							       职住数据查询规则：
							              居住地：统计22 点至23点和00点至06点数据 统计 22点到06点
							              工作地：统计10点至12点和14点至17点数据  统计 10点到17点
							              交通站：统计08点至09点和17点至19点数据  统计 07-09 和18点至21点
							以上配置信息，代码里写死
		        		  */
		        		 if((hourValue >=0 && hourValue <= 6)  ||  ( hourValue >= 22 && hourValue <=23 )){
		        			 tempPP.setHourType(2);//居住地
		        		 }else  if(hourValue >=10 && hourValue <=17){
		        			 tempPP.setHourType(3);//工作地
		        		 }else if((hourValue >=7 && hourValue <=9) || (hourValue >= 18 && hourValue <=21)){
		        			 tempPP.setHourType(1);//交通站
		        		 }
		        		 String  lat = latLngCount[0];
		        		 String  lng = latLngCount[1];
		        		 tempPP.setLatitude(lat);//维度
		        		 tempPP.setLongtitude(lng);//经度 
		        		 float  count = Float.parseFloat(latLngCount[2]);
		        		 tempPP.setMetricValue(((int)count) + "") ;
		        		 tempPP.setDayType(dayType);
		        		 
		        		 //根据维度，经度，获取区域信息
		        		 String regionName = null;//行政区域名称
		        		 String bussinessName = null; //商圈名称
		        		 String regionType  = Enclosure.EnclosureType.DISTRICT.getType() + "";//默认类型  在enclosure_12.json 中是1，行政区域，在enclosure_108.json是2 商业中心
		        		 
		        		 PositionUtil.Gps bd09 = null;
	        	         try {
	        	            bd09 = PositionUtil.Gps84_To_bd09(Double.parseDouble(lat), Double.parseDouble(lng));
	        	         } catch (NullPointerException e) {
	        	            //logger.debug("EnclousreCacheTransfer Gps84_To_bd09 failed! ",e);
	        	         }
		        	     
	        	         //获取区域名称和类型
	        	         if(null != bd09){
	        	        	 regionName =  EnclosureUtil.latAndLng2Enclousure(Float.parseFloat(bd09.getWgLat() + ""),Float.parseFloat(bd09.getWgLon() + ""), Enclosure.EnclosureType.DISTRICT,cityName);
	        	        	 bussinessName =  EnclosureUtil.latAndLng2Enclousure(Float.parseFloat(bd09.getWgLat() + ""), Float.parseFloat(bd09.getWgLon() + ""), Enclosure.EnclosureType.BUSSINESS, cityName);
			        		 tempPP.setBd09Latitude(bd09.getWgLat() + "");
			        		 tempPP.setBd09Longtitude(bd09.getWgLon() + "");
	        	         }
		        		 if(null == regionName && bussinessName == null){
		        			 regionType = null;
		        			 //过滤没有用到数据
		        			 continue;
		        		 }
		        		 tempPP.setBussinessName(bussinessName);
		        		 tempPP.setRegionName(regionName);
		        		 tempPP.setRegionType(regionType);
		        		 list.add(tempPP);
		        	 }
	        	 }
	        }else{
	        	logger.warn("parse error :" + position);
	        }
	    }
		return list;
	}
	

}

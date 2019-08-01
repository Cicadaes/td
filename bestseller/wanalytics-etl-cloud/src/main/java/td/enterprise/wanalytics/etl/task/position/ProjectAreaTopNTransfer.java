package td.enterprise.wanalytics.etl.task.position;

import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.util.PositionUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *第四列和第五列分别是经度，和维度，GPS84标准
 *
 */
public class ProjectAreaTopNTransfer {
	
	public static Logger logger = Logger.getLogger(ProjectAreaTopNTransfer.class);
    
    private final double distance = 150; //按照150米算 TopN小区

    private List<Map<String,Object>> cacheList = null;

    private String cityName =  null;
    
    private Integer projectId;
    
    //缓存相同坐标的城市名称
    private Map<String,ProjectAreaTopN> areaCacheMap = new HashMap<String,ProjectAreaTopN> ();
    
    public ProjectAreaTopNTransfer( String cityName){
    	this.cityName = cityName;
    }
	
	public ProjectAreaTopN transfer(String line,long lineNumber){
		try {
            String[] columns = line.split(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
            if(columns.length >= 2){
            	ProjectAreaTopN value = getArea(columns);
            	return value;
            }else{
            	logger.error("---------------Invalid data lineNumber=" + lineNumber);
            }
        } catch (Exception e) {
            logger.error("ProjectAreaTopNTransfer parse error :" + line + " lineNumber is " + lineNumber, e);
        }
		return null;
	}
	
	public  ProjectAreaTopN getArea(String columns []) throws Exception{
		ProjectAreaTopN value = null;
		Double wgs84_lon = Double.parseDouble(columns[0]); //wgs 经度
		Double wgs84_lat  = Double.parseDouble(columns[1]); // wgs 维度 
    	if(cacheList == null){
            String sql = "select location_lat,location_lng,name,area_type from TD_CITY_AOI where cityname='" + cityName + "'";
            cacheList = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
    		if(null == cacheList || cacheList.isEmpty()){
    			throw new RuntimeException("项目id=" + projectId  + " 城市=" + cityName +  " 没有找到城市AOI数据，请补全后再运行。 ");
    		}
    	}
    	
    	String key = wgs84_lon + "_"  + wgs84_lat ;
    	if(null == areaCacheMap.get(key)){
    		for (Map<String,Object> p : cacheList) {
   	         Double gcjLat = (Double )p.get("location_lat");
   	         Double gcjLng = (Double )p.get("location_lng");
//   	     PositionUtil.Gps gps84 =  PositionUtil.gcj_To_Gps84(gcjLat,gcjLng);
             double tempDistance = PositionUtil.lantitudeLongitudeDist(wgs84_lon, wgs84_lat, gcjLng, gcjLat);
   	     	 if (tempDistance <= distance) {
   	     		value = new ProjectAreaTopN();
   	     		value.setAreaName(p.get("name") + "");
   	     		value.setAreaType(p.get("area_type") + "");
   	     		value.setLatitude(columns[0]  + "");
   	     		value.setLongtitude(columns[1]  + "");
   	     		areaCacheMap.put(key ,value);
   	     		break;
   	         }
   	      }
    	}else{
    		value = areaCacheMap.get(key);
    	}
	    
		return value;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

}

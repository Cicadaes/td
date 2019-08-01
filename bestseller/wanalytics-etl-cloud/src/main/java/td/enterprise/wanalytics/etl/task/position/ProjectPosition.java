package td.enterprise.wanalytics.etl.task.position;

/**
 * 根据mac地址，向数据中心请求返回来的数据，解析项目（案场）mac ，tdid，和经纬度
 * @author junmin.li
 *  注意：findByType接口中的type类型分别为：1、交通站 2、居住地 3、工作地
       职住数据查询规则：
              居住地：统计22 点至23点和00点至06点数据 统计 22点到06点
              工作地：统计10点至12点和14点至17点数据  统计 10点到17点
              交通站：统计08点至09点和17点至19点数据  统计 07-09 和18点至21点
          以上配置信息，代码里写死
 */
public class ProjectPosition {
   
	private String projectId; //案场
	private String tdId;
	private String mac ;
	private String longtitude ;  //经度
	private String latitude;     //维度 
	private String dayType ;//日期类型 工作日是1，周末节假日是2
	private int hour;
	private int hourType;//参考上面解释
	private String metricValue;
	private String startDate;//yyyy-MM-dd  统计开始日期 
	private String endDate; //统计结束日期
	private String cycleStatistics;//统计周期
	
	private String regionType; //区域类型   1行政中心区域  2商业中心区域
	private String regionName; //区域名称  根据经纬度计算而来
	private String bussinessName;//商业中心名称
	
	private String bd09Longtitude  = "";//百度标准
	private String bd09Latitude   = "";//百度标准
	
	private String poiWid ;//附近商场id
	private String tenantId ;//租户ID
	private String  crowdId;//人群ID
	private String runDate ;//运行日期
	
	private String areaName;// 餐饮 2娱乐 3品牌 名称
	private String poiType ;//餐饮 2娱乐 3品牌 '1餐饮 2娱乐 3品牌'
	
	/**
	 * 根据mac，dayType,hour 进行比较唯一 
	 */
	
	@Override
    public int hashCode() {
		String id = mac + dayType + hour;
        return id.hashCode();
    }
	/**
	 * 根据mac,dayType,hour进行区别唯一 
	 */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        String sId = mac + dayType + hour;
        ProjectPosition pp = (ProjectPosition) o;
   
        String destId = pp.getMac() + pp.getDayType() + pp.getHour();
        
        return sId.equals(destId);

    }
	
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getTdId() {
		return tdId;
	}
	public void setTdId(String tdId) {
		this.tdId = tdId;
	}
	public String getMac() {
		return mac;
	}
	public void setMac(String mac) {
		this.mac = mac;
	}
	public String getLongtitude() {
		return longtitude;
	}
	public void setLongtitude(String longtitude) {
		this.longtitude = longtitude;
	}
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getDayType() {
		return dayType;
	}
	public void setDayType(String dayType) {
		this.dayType = dayType;
	}
	public int getHour() {
		return hour;
	}
	public void setHour(int hour) {
		this.hour = hour;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getRegionType() {
		return regionType;
	}
	public void setRegionType(String regionType) {
		this.regionType = regionType;
	}
	public String getRegionName() {
		return regionName;
	}
	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}
	public String getBd09Longtitude() {
		return bd09Longtitude;
	}
	public void setBd09Longtitude(String bd09Longtitude) {
		this.bd09Longtitude = bd09Longtitude;
	}
	public String getBd09Latitude() {
		return bd09Latitude;
	}
	public void setBd09Latitude(String bd09Latitude) {
		this.bd09Latitude = bd09Latitude;
	}
	public String getPoiWid() {
		return poiWid;
	}
	public void setPoiWid(String poiWid) {
		this.poiWid = poiWid;
	}
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	public String getCrowdId() {
		return crowdId;
	}
	public void setCrowdId(String crowdId) {
		this.crowdId = crowdId;
	}
	public String getRunDate() {
		return runDate;
	}
	public void setRunDate(String runDate) {
		this.runDate = runDate;
	}
	public String getMetricValue() {
		return metricValue;
	}
	public void setMetricValue(String metricValue) {
		this.metricValue = metricValue;
	}
	public String getCycleStatistics() {
		return cycleStatistics;
	}
	public void setCycleStatistics(String cycleStatistics) {
		this.cycleStatistics = cycleStatistics;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getPoiType() {
		return poiType;
	}
	public void setPoiType(String poiType) {
		this.poiType = poiType;
	}
	public int getHourType() {
		return hourType;
	}
	public void setHourType(int hourType) {
		this.hourType = hourType;
	}
	public String getBussinessName() {
		return bussinessName;
	}
	public void setBussinessName(String bussinessName) {
		this.bussinessName = bussinessName;
	}
}

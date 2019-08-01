package td.enterprise.wanalytics.etl.task.postlog.bean;

public class LogLineKeyConstants {

	/**
	 * 租户id tenantid
	 Collector接收时间 tsreceive
	 探针或AP的mac地址 apmac
	 上报数据的绝对时间 tssend
	 终端设备的信号强度 rssi
	 终端设备的mac地址 mac
	 丢弃代码 discard
	 异常代码 failcode
	 项目id projectid
	 探针id sensorid
	 项目类型 projecttype
	 项目名称 projectname
	 mac对应租户offset tenantoffset
	 是否是新用户 projectnewflag
	 用户在项目中连续停留的sessionid sessionId
	 用户在案场停留时长（单位是分钟） sessionDuration
	 discard详细信息 discard
	 用户自定义全部扩展标签信息 tagSource
	 */

	//按照log顺序
	public static final String tenantid = "tenantid";
	public static final String tsreceive = "tsreceive";
	public static final String apmac = "apmac";
	public static final String tssend = "tssend";
	public static final String rssi = "rssi";
	public static final String mac = "mac";
	public static final String discard = "discard";//
	public static final String failcode = "failcode";
	public static final String projectid = "projectid";
	public static final String sensorid = "sensorid";
	public static final String projecttype = "projecttype";
	public static final String projectname = "projectname";
	public static final String tenantoffset = "tenantoffset";
	public static final String projectnewflag = "projectnewflag";
	public static final String sessionId = "sessionId";
	public static final String sessionDuration = "sessionDuration";
	public static final String discardMsg = "discardMsg";
	public static final String tagSource = "tagSource";

	
}

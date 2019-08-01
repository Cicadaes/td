package td.enterprise.wanalytics.processor.utils;

/**
 * @author yangtao
 *
 */
public class LineKeyConstants {

	// WiFiDataEntity
	public static final String version = "version";
	public static final String devtype = "devtype";
	public static final String keytype = "keytype";

	// WifiData
	public static final String apmac = "apmac";
	public static final String num = "num";
	public static final String tssend = "tssend";
	public static final String tsreceive = "tsreceive";

	// WifiTa
	public static final String rssi = "rssi";
	public static final String mac = "mac";
	public static final String dist = "dist";
	public static final String duringstart = "duringstart";
	public static final String duringend = "duringend";
	public static final String packetnumup = "packetnumup";
	public static final String packetnumdown = "packetnumdown";
	public static final String volumeup = "volumeup";
	public static final String volumedown = "volumedown";
	public static final String authidtype = "authidtype";
	public static final String authid = "authid";
	public static final String tatype = "tatype";
	public static final String tabrand = "tabrand";
	public static final String tasystem = "tasystem";
	public static final String applicationlist = "applicationlist";
	public static final String urllist = "urllist";
	public static final String dns = "dns";

	// TaEvent
	public static final String taevent = "taevent";
	public static final String fragtype = "fragtype";
	public static final String dstmac = "dstmac";
	public static final String ssid = "ssid";
	public static final String channel = "channel";
	
	// error discard code
	public static final String discard = "discard";

	// 填充属性  SensorPropFillChanger
	public static final String sensorid = "sensorid";
	public static final String projectid = "projectid";
	public static final String projectplaceid = "projectplaceid";
	public static final String tenantid = "tenantid";
	
	public static final String projecttype = "projecttype";
	public static final String openingtime = "openingtime";
	public static final String closingtime = "closingtime";

	//过滤营业时间范围外的mac
	public static final String filterOpeningtime = "filteropeningtime";
	public static final String filterClosingtime = "filterclosingtime";

	
	// 填充属性 idmapping
	public static final String tenantoffset = "tenantoffset";
	public static final String tenantnewflag = "tenantnewflag";
	
	public static final String frontoffset = "frontoffset";
	
	public static final String projectoffset = "projectoffset";
	public static final String projectnewflag = "projectnewflag";
	public static final String groupid = "groupid";
	
	
	public static final String failcode = "failcode";
	public static final String projectname = "projectname";
	public static final String projectplacename = "projectplacename";

	public static final String city = "city";
	
	// session 数据
	public static final String sessionId = "sessionid";
	public static final String sessionDuration = "sessionduration";

	public static final String visitMinutes       = "visitMinutes";//案场停留时长

	public static final String maxDuration          = "maxDuration";//要过滤的最长时长限制
	
	public static final String stayMinutes   = "stayMinutes";//项目停留时长
	
	public static final String sessionTimeoutSeconds   = "sessionTimeoutSeconds";//项目停留间隔

	public  static final String groupId  = "groupId"; //店组id

	public static final String tagSource = "tagSource";
	
	//店铺编码
	public static final String projectNum = "projectNum";
	
	//店前客流 标记
	public static final String isFrontUser = "isFrontUser";
	
	public static final String activeSign = "activeSign"; // 活跃客流标识
	
	public static final String staySign = "staySign"; // 停留客流标识
	
	public static final String visitInterval = "visitInterval"; // 活跃天数

}

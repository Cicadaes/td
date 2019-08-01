import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.junit.Test;

import td.enterprise.wanalytics.etl.util.HttpsRequestUtil;


public class TestHttpsRequest {
	
	private final static String GET_METHOD = "GET";
	
	private final static String POST_METHOD = "POST";
	
	private final static String REQUEST_URL_SHOP = "https://lvzhouapi.h3c.com/user/shop"; // 店铺
	
	private final static String REQUEST_URL_SHOP_DEVICE_RLT = "https://lvzhouapi.h3c.com/shop/device"; // 店铺和设备关系
	
	private final static String REQUEST_URL_DEVICE = "https://lvzhouapi.h3c.com/device/operation"; // 设备
	
	private final static String REQUEST_URL_AP = "https://lvzhouapi.h3c.com/device/apinfo?devsn=XXX"; // AP
	
	private final static String REQUEST_URL_SSID = "https://lvzhouapi.h3c.com/device/ssidinfo?devsn=XXX"; // SSID
	
	private final static String REQUEST_URL_REALTIME_MAC = "https://lvzhouapi.h3c.com/device/ssid/clientmac"; // 实时连接终端MAC
	
	private final static String REQUEST_URL_AUTH_HISTORY = "https://lvzhouapi.h3c.com/api/o2oportal/getAuthUserInfo"; // 历史认证
	
	/**
	* <p>Description: 测试HTTPS请求</p>
	* @throws Exception
	* @author liyinglei 
	* @date 2017年10月16日上午11:03:45
	 */
//	@Test
	public void testHttpsRequest() throws Exception {
		JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_SHOP, GET_METHOD, null);
		
		System.out.println(results);
		
		if (results != null && results.get("code").equals("0")) {
			JSONArray data = results.getJSONArray("data");
			for (Object object : data) {
				JSONObject obj = (JSONObject) object;
				String userName = obj.getString("userName");
				String shopName = obj.getString("shopName");
				String shopId = obj.getString("shopId");
				String province = obj.getString("province");
				String city = obj.getString("city");
				String area = obj.getString("area");
				String address = obj.getString("address");
				String phone = obj.getString("phone");
				String scenarioName = obj.getString("scenarioName");
				JSONArray columns = obj.getJSONArray("columns");
				
			}
		}
	}

}

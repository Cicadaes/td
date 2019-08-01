package td.enterprise.wanalytics.idmapping.bean;

import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("serial")
public class InputBean implements java.io.Serializable, Cloneable {

	private String domain; // database name/alias
	private String key; // table name
	private String value; // offset
	private String time ; //time
	private String tenantid; // tenant
	private String offset; // offset
	
	private DeviceExtInfo extInfo;
	
	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getTenantid() {
		return tenantid;
	}

	public void setTenantid(String tenantid) {
		this.tenantid = tenantid;
	}

	public String getOffset() {
		return offset;
	}

	public void setOffset(String offset) {
		this.offset = offset;
	}
	
	public static class DeviceExtInfo{
		
		private String deviceid;
		private String imei;
		private String idfa;
		private String mac_address;
		private String mobile_model;
		private String ext1;
		private String ext2;
		private String ext3;
		
		public Map<String, String> toMap(){
			Map<String, String> rst = new HashMap<String, String>();
			if(StringUtils.isNotBlank(deviceid)){
				rst.put("deviceid", deviceid);
			}
			if(StringUtils.isNotBlank(imei)){
				rst.put("imei", imei);
			}
			if(StringUtils.isNotBlank(idfa)){
				rst.put("idfa", idfa);
			}
			if(StringUtils.isNotBlank(mac_address)){
				rst.put("mac_address", mac_address);
			}
			if(StringUtils.isNotBlank(mobile_model)){
				rst.put("mobile_model", mobile_model);
			}
			if(StringUtils.isNotBlank(ext1)){
				rst.put("ext1", ext1);
			}
			if(StringUtils.isNotBlank(ext2)){
				rst.put("ext2", ext2);
			}
			if(StringUtils.isNotBlank(ext3)){
				rst.put("ext3", ext3);
			}			
			return rst;
		}
		
		public String getDeviceid() {
			return deviceid;
		}
		public void setDeviceid(String deviceid) {
			this.deviceid = deviceid;
		}
		public String getImei() {
			return imei;
		}
		public void setImei(String imei) {
			this.imei = imei;
		}
		public String getIdfa() {
			return idfa;
		}
		public void setIdfa(String idfa) {
			this.idfa = idfa;
		}
		public String getMac_address() {
			return mac_address;
		}
		public void setMac_address(String mac_address) {
			this.mac_address = mac_address;
		}
		public String getMobile_model() {
			return mobile_model;
		}
		public void setMobile_model(String mobile_model) {
			this.mobile_model = mobile_model;
		}
		public String getExt1() {
			return ext1;
		}
		public void setExt1(String ext1) {
			this.ext1 = ext1;
		}
		public String getExt2() {
			return ext2;
		}
		public void setExt2(String ext2) {
			this.ext2 = ext2;
		}
		public String getExt3() {
			return ext3;
		}
		public void setExt3(String ext3) {
			this.ext3 = ext3;
		}
		
	}

	public DeviceExtInfo getExtInfo() {
		return extInfo;
	}

	public void setExtInfo(DeviceExtInfo extInfo) {
		this.extInfo = extInfo;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

}

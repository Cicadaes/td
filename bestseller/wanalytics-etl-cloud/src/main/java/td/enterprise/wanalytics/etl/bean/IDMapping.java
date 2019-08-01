package td.enterprise.wanalytics.etl.bean;

public class IDMapping {
	private String mac;
	private String tdid;
	private String imei;
	private String idfa;
	private String androidid;

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public String getTdid() {
		return tdid;
	}

	public void setTdid(String tdid) {
		this.tdid = tdid;
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

	public String getAndroidid() {
		return androidid;
	}

	public void setAndroidid(String androidid) {
		this.androidid = androidid;
	}

	@Override
	public String toString() {
		return "IDMapping [mac=" + mac + ", tdid=" + tdid + ", imei=" + imei
				+ ", idfa=" + idfa + ", androidid=" + androidid + "]";
	}


}

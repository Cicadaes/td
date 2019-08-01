package td.enterprise.wanalytics.etl.bean;

/**
 * 设备标签
 *
 * @author junmin.li
 *
 */
public class DeviceBean extends BaseBean {

	private DeviceData data;
	private String tdid;

	public DeviceData getData() {
		return data;
	}

	public void setData(DeviceData data) {
		this.data = data;
	}

	public String getTdid() {
		return tdid;
	}

	public void setTdid(String tdid) {
		this.tdid = tdid;
	}

}

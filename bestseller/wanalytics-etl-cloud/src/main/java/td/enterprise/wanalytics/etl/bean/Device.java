package td.enterprise.wanalytics.etl.bean;


/**
 * 设备标签
 * @author junmin.li
 *
 */
public class Device  {
	private String tdid;
	private String originModel;
	private String standardModel;
	private String standardBrand;
	private String deviceType;
	private String screen;
	private String price;
	private String functionType;
	private String hardwareType;
	public String getTdid() {
		return tdid;
	}
	public void setTdid(String tdid) {
		this.tdid = tdid;
	}
	public String getOriginModel() {
		return originModel;
	}
	public void setOriginModel(String originModel) {
		this.originModel = originModel;
	}
	public String getStandardModel() {
		return standardModel;
	}
	public void setStandardModel(String standardModel) {
		this.standardModel = standardModel;
	}
	public String getStandardBrand() {
		return standardBrand;
	}
	public void setStandardBrand(String standardBrand) {
		this.standardBrand = standardBrand;
	}
	public String getDeviceType() {
		return deviceType;
	}
	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}
	public String getScreen() {
		return screen;
	}
	public void setScreen(String screen) {
		this.screen = screen;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getFunctionType() {
		return functionType;
	}
	public void setFunctionType(String functionType) {
		this.functionType = functionType;
	}
	public String getHardwareType() {
		return hardwareType;
	}
	public void setHardwareType(String hardwareType) {
		this.hardwareType = hardwareType;
	}


}

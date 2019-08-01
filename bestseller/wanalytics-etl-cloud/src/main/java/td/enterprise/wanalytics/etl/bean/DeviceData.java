package td.enterprise.wanalytics.etl.bean;

import java.util.List;


/**
 * 设备标签
 * @author junmin.li
 *
 */
public class DeviceData   {
	private List<Device> tags;

	public List<Device> getTags() {
		return tags;
	}

	public void setTags(List<Device> tags) {
		this.tags = tags;
	}


}

package td.enterprise.wanalytics.etl.bean;

/**
 * 月聚集位置
 *
 * @author junmin.li
 *
 */
public class PositionBean extends BaseBean {

	private PositionData data;

	public PositionData getData() {
		return data;
	}

	public void setData(PositionData data) {
		this.data = data;
	}

}

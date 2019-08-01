package td.enterprise.wanalytics.etl.bean;

public class IDMappingBean extends BaseBean {
	private IDMapping data;

	public IDMapping getData() {
		return data;
	}

	public void setData(IDMapping data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "IDMappingBean [data=" + data + "]";
	}


}

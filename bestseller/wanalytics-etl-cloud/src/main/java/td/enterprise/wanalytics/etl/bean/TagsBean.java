package td.enterprise.wanalytics.etl.bean;

/**
 * 标签通用类
 * @author junmin.li
 *
 */
public class TagsBean extends BaseBean  {

	private String id;
	private TagsData data;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public TagsData getData() {
		return data;
	}
	public void setData(TagsData data) {
		this.data = data;
	}


}

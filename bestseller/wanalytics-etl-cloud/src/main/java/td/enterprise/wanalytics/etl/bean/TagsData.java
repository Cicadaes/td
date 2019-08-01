package td.enterprise.wanalytics.etl.bean;

import java.util.List;

/**
 * 标签通用类
 * @author junmin.li
 *
 */
public class TagsData   {
	private List<Tags> tags;
	private String tdid;

	public String getTdid() {
		return tdid;
	}
	public void setTdid(String tdid) {
		this.tdid = tdid;
	}
	public List<Tags> getTags() {
		return tags;
	}

	public void setTags(List<Tags> tags) {
		this.tags = tags;
	}

}

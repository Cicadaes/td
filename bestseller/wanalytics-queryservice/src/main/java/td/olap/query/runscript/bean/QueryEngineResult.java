package td.olap.query.runscript.bean;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;


/**
 * 对查询结果集+结果集key的顺序的封装
 * @author chenxiaolong
 *
 */
@XmlRootElement
public class QueryEngineResult {
	private List<List<String>> key_list;
	private List<ResultBean> results;
	public List<List<String>> getKey_list() {
		return key_list;
	}
	public void setKey_list(List<List<String>> key_list) {
		this.key_list = key_list;
	}
	public List<ResultBean> getResults() {
		return results;
	}
	public void setResults(List<ResultBean> results) {
		this.results = results;
	}
	@Override
	public String toString() {
		return "QueryEngineResult [key_list=" + key_list + ", results="
				+ results + "]";
	}
	
}

package td.olap.query.runscript.bean;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ResultBean implements Comparable<ResultBean>{
	private String key;
	private Object value;
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	@Override
	public String toString() {
		return "ResultBean [key=" + key + ", value=" + value + "]";
	}
	@Override
	public int compareTo(ResultBean o) {
		int thisValue = Integer.valueOf(this.getValue().toString());
		int rValue = Integer.valueOf(o.getValue().toString());
		return thisValue - rValue;
	}
	public ResultBean(String key, Object value) {
		super();
		this.key = key;
		this.value = value;
	}
	public ResultBean() {
		super();
	}
	
	
}

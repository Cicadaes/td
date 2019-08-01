package td.enterprise.wanalytics.idmapping.bean;


import td.enterprise.wanalytics.processor.utils.DateTimeUtil;

@SuppressWarnings("serial")
public class OutputBean implements java.io.Serializable, Cloneable {

	public String key; // required
	public String value; // required
	public long offset; // required
	public boolean isNew; // required
	public long time; // required

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public long getOffset() {
		return offset;
	}

	public void setOffset(long offset) {
		this.offset = offset;
	}

	public boolean isNew(long tsreceive) {
		//判断是否是新客和老客
		isNew= DateTimeUtil.isCurrentDate(time,tsreceive);
		return isNew;
	}

	public void setNew(boolean isNew) {
		this.isNew = isNew;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

}

package td.enterprise.wanalytics.etl.common;

/**
 * IDMapping返回结果
 * @author junmin.li
 *
 */
public class Response {
	
	private Status code;  //返回代码 0 表示正常， 1 表示失败
	private String msg; //返回错误消息
	
	public Status getCode() {
		return code;
	}


	public void setCode(Status code) {
		this.code = code;
	}


	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public enum Status {
		
		SUCCESS(0) , ERROR(1);
		
		private int value;
		
		Status(int value) {
	        this.value = value;
	    }
		
	    public int getValue() {
	        return value;
	    }
	}
	
}

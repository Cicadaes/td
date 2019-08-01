package td.enterprise.wanalytics.etl.bean;

/**
 * 返回消息公共消息类
 * @author junmin.li
 *
 */
public class BaseBean {
	protected int code;
	protected String msg;
	protected String seq;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getSeq() {
		return seq;
	}

	public void setSeq(String seq) {
		this.seq = seq;
	}

}

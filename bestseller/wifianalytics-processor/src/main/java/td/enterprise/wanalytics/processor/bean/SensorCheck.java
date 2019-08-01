package td.enterprise.wanalytics.processor.bean;

import java.io.Serializable;

public class SensorCheck implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4138250666422013472L;
	
	private String mac;
	
	private String apMac;
	
	private String signal;
	
	private Long time;

	
	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public String getApMac() {
		return apMac;
	}

	public void setApMac(String apMac) {
		this.apMac = apMac;
	}

	public Long getTime() {
		return time;
	}

	public void setTime(Long time) {
		this.time = time;
	}

	public String getSignal() {
		return signal;
	}

	public void setSignal(String signal) {
		this.signal = signal;
	}

}

package td.enterprise.entity;


import java.lang.Integer;
import java.lang.String;
import java.util.Date;
import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>调用dmk日志 DmkLogEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DmkLog extends BaseEntity {
	
	private Integer id;
	private String mac;
	private String tdid;
	private String type;
	private String month;
	private String httpStatus;
	private String data;
	private Date createTime;

	private List<String> macList;
	private List<String> tdidList;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMac() {
		return this.mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public String getTdid() {
		return this.tdid;
	}

	public void setTdid(String tdid) {
		this.tdid = tdid;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getHttpStatus() {
		return this.httpStatus;
	}

	public void setHttpStatus(String httpStatus) {
		this.httpStatus = httpStatus;
	}

	public String getData() {
		return this.data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public List<String> getMacList() {
		return macList;
	}

	public void setMacList(List<String> macList) {
		this.macList = macList;
	}

	public List<String> getTdidList() {
		return tdidList;
	}

	public void setTdidList(List<String> tdidList) {
		this.tdidList = tdidList;
	}
}


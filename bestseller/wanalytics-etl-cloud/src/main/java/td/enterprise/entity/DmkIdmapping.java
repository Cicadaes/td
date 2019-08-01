package td.enterprise.entity;


import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>DMK mac tdid映射 DmkIdmappingEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DmkIdmapping extends BaseEntity {
	
	private Integer id;
	private String mac;
	private String tdid;
	private String imei;
	private String idfa;
	private String androidid;
	private Date syncDate;
	private String dmkCode;
	private String dmkMsg;
	private String dmkSeq;
	private Date createTime;
	private Integer httpStatus;

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

	public String getImei() {
		return this.imei;
	}

	public void setImei(String imei) {
		this.imei = imei;
	}

	public String getIdfa() {
		return this.idfa;
	}

	public void setIdfa(String idfa) {
		this.idfa = idfa;
	}

	public String getAndroidid() {
		return this.androidid;
	}

	public void setAndroidid(String androidid) {
		this.androidid = androidid;
	}

	public Date getSyncDate() {
		return this.syncDate;
	}

	public void setSyncDate(Date syncDate) {
		this.syncDate = syncDate;
	}

	public String getDmkCode() {
		return this.dmkCode;
	}

	public void setDmkCode(String dmkCode) {
		this.dmkCode = dmkCode;
	}

	public String getDmkMsg() {
		return this.dmkMsg;
	}

	public void setDmkMsg(String dmkMsg) {
		this.dmkMsg = dmkMsg;
	}

	public String getDmkSeq() {
		return this.dmkSeq;
	}

	public void setDmkSeq(String dmkSeq) {
		this.dmkSeq = dmkSeq;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Integer getHttpStatus() {
		return this.httpStatus;
	}

	public void setHttpStatus(Integer httpStatus) {
		this.httpStatus = httpStatus;
	}
}


package td.enterprise.entity;


import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>用户日志扩展标签数据表 CustomizedMatchDataEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-06 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CustomizedMatchData extends BaseEntity {
	
	private Integer id;
	private String businessId;
	private String source;
	private String validStartTime;
	private String validEndTime;
	private Object customizedInfo;
	private String status;
	private String creator;
	private String createBy;
	private Date createTime;
	private String updater;
	private String updateBy;
	private Date updateTime;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getBusinessId() {
		return this.businessId;
	}

	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}

	public String getSource() {
		return this.source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getValidStartTime() {
		return this.validStartTime;
	}

	public void setValidStartTime(String validStartTime) {
		this.validStartTime = validStartTime;
	}

	public String getValidEndTime() {
		return this.validEndTime;
	}

	public void setValidEndTime(String validEndTime) {
		this.validEndTime = validEndTime;
	}

	public Object getCustomizedInfo() {
		return this.customizedInfo;
	}

	public void setCustomizedInfo(Object customizedInfo) {
		this.customizedInfo = customizedInfo;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCreator() {
		return this.creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getCreateBy() {
		return this.createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getUpdater() {
		return this.updater;
	}

	public void setUpdater(String updater) {
		this.updater = updater;
	}

	public String getUpdateBy() {
		return this.updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}

	public Date getUpdateTime() {
		return this.updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
}


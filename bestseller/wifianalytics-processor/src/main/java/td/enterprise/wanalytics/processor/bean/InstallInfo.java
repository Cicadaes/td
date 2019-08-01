package td.enterprise.wanalytics.processor.bean;

import td.enterprise.dmp.base.entity.BaseEntity;

/**
 * <br>
 * <b>功能：</b>安装归属表 InstallInfoEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class InstallInfo extends BaseEntity {

	private Integer id;
	private String tenantId;
	private Long projectId;
	private Long projectPlaceId;
	private Long relatedId;
	private Integer relatedType;
	private String relatedAttribute;
	private String longitude;
	private String latitude;
	private String description;
	private Integer status;

	private Integer rssi;
	
	private Integer frontRSSI;// 店前客流信号强度

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public Long getProjectPlaceId() {
		return projectPlaceId;
	}

	public void setProjectPlaceId(Long projectPlaceId) {
		this.projectPlaceId = projectPlaceId;
	}

	public Long getRelatedId() {
		return relatedId;
	}

	public void setRelatedId(Long relatedId) {
		this.relatedId = relatedId;
	}

	public Integer getRelatedType() {
		return relatedType;
	}

	public void setRelatedType(Integer relatedType) {
		this.relatedType = relatedType;
	}

	public String getRelatedAttribute() {
		return relatedAttribute;
	}

	public void setRelatedAttribute(String relatedAttribute) {
		this.relatedAttribute = relatedAttribute;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getRssi() {
		return rssi;
	}

	public void setRssi(Integer rssi) {
		this.rssi = rssi;
	}

	public Integer getFrontRSSI() {
		return frontRSSI;
	}

	public void setFrontRSSI(Integer frontRSSI) {
		this.frontRSSI = frontRSSI;
	}
	
}


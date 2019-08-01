package td.enterprise.wanalytics.processor.bean;

import java.io.Serializable;

/**
 * 项目
 * @author yangtao
 */
public class Project implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = -1207999890573797123L;

	/**
	 * 项目id
	 */
	private Long id;

	/**
	 * 租户id
	 */
	private String tenantId;

	/**
	 * 项目类型
	 */
	private Integer projectType;

	/**
	 * 营业开始时间
	 */
	private String openingTime;

	/**
	 * 营业结束时间
	 */
	private String closingTime;


	private String projectName;


	private Integer status;


	private Integer visitMinutes;//参观时间有效时间

	private Integer stayMinutes;//项目停留

	private Integer maxDuration;//最长停留时长，超过这个值，mac会放到黑名单中

	private String filterOpeningTime; // 营业时间开始前2小时  不跨天， 营业时间如果是2点或者前面，为00
	private String filterClosingTime;   // 营业时间结束后2小时 不跨天，如果是22点，或者23点，结束后2小时为23，判断是的时候是X<=23

	private Integer sessionTimeoutSeconds; //项目停留间隔
	
	private String projectNum;//店铺代码
	
	private Integer activeHighBegin; // 高活跃客流时间阈值
	private Integer activeHighEnd; // 高活跃客流时间阈值
	
	private Integer activeMediumBegin; // 中活跃客流时间阈值
	private Integer activeMediumEnd; // 中活跃客流时间阈值
	
	private Integer activeLowBegin; // 中活跃客流时间阈值
	private Integer activeLowEnd; // 中活跃客流时间阈值
	
	private Integer activeSleep; // 沉睡客流时间阈值

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getOpeningTime() {
		return openingTime;
	}

	public void setOpeningTime(String openingTime) {
		this.openingTime = openingTime;
	}

	public String getClosingTime() {
		return closingTime;
	}

	public void setClosingTime(String closingTime) {
		this.closingTime = closingTime;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getProjectType() {
		return projectType;
	}

	public void setProjectType(Integer projectType) {
		this.projectType = projectType;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}


	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}


	public Integer getVisitMinutes() {
		return visitMinutes;
	}

	public void setVisitMinutes(Integer visitMinutes) {
		this.visitMinutes = visitMinutes;
	}

	public Integer getStayMinutes() {
		return stayMinutes;
	}

	public void setStayMinutes(Integer stayMinutes) {
		this.stayMinutes = stayMinutes;
	}

	public Integer getMaxDuration() {
		return maxDuration;
	}

	public void setMaxDuration(Integer maxDuration) {
		this.maxDuration = maxDuration;
	}

	public String getFilterOpeningTime() {
		return filterOpeningTime;
	}

	public void setFilterOpeningTime(String filterOpeningTime) {
		this.filterOpeningTime = filterOpeningTime;
	}

	public String getFilterClosingTime() {
		return filterClosingTime;
	}

	public void setFilterClosingTime(String filterClosingTime) {
		this.filterClosingTime = filterClosingTime;
	}

	public Integer getSessionTimeoutSeconds() {
		return sessionTimeoutSeconds;
	}

	public void setSessionTimeoutSeconds(Integer sessionTimeoutSeconds) {
		this.sessionTimeoutSeconds = sessionTimeoutSeconds;
	}

	public String getProjectNum() {
		return projectNum;
	}

	public void setProjectNum(String projectNum) {
		this.projectNum = projectNum;
	}

	public Integer getActiveHighBegin() {
		return activeHighBegin;
	}

	public void setActiveHighBegin(Integer activeHighBegin) {
		this.activeHighBegin = activeHighBegin;
	}

	public Integer getActiveHighEnd() {
		return activeHighEnd;
	}

	public void setActiveHighEnd(Integer activeHighEnd) {
		this.activeHighEnd = activeHighEnd;
	}

	public Integer getActiveMediumBegin() {
		return activeMediumBegin;
	}

	public void setActiveMediumBegin(Integer activeMediumBegin) {
		this.activeMediumBegin = activeMediumBegin;
	}

	public Integer getActiveMediumEnd() {
		return activeMediumEnd;
	}

	public void setActiveMediumEnd(Integer activeMediumEnd) {
		this.activeMediumEnd = activeMediumEnd;
	}

	public Integer getActiveLowBegin() {
		return activeLowBegin;
	}

	public void setActiveLowBegin(Integer activeLowBegin) {
		this.activeLowBegin = activeLowBegin;
	}

	public Integer getActiveLowEnd() {
		return activeLowEnd;
	}

	public void setActiveLowEnd(Integer activeLowEnd) {
		this.activeLowEnd = activeLowEnd;
	}

	public Integer getActiveSleep() {
		return activeSleep;
	}

	public void setActiveSleep(Integer activeSleep) {
		this.activeSleep = activeSleep;
	}

	
	
	
}

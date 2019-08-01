package td.enterprise.entity;


import java.lang.Integer;
import java.lang.String;

/**
 * 
 * <br>
 * <b>功能：</b>项目新老客停留时长 TenantStayDurationEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantStayDuration extends BaseEntity {
	
	private Integer id;
	private String tenantId;
	private Integer projectId;
	private String date;
	private Integer stayUsers;
	private Integer newUsers;
	private Integer oldUsers;
	private Integer stayDuration;
	private Integer newDuration;
	private Integer oldDuration;
	private String averageStayDuration;
	private String averageNewDuration;
	private String averageOldDuration;
	
	private String start;
	private String end;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTenantId() {
		return this.tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public Integer getProjectId() {
		return this.projectId;
	}

	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}

	public String getDate() {
		return this.date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public Integer getStayUsers() {
		return this.stayUsers;
	}

	public void setStayUsers(Integer stayUsers) {
		this.stayUsers = stayUsers;
	}

	public Integer getNewUsers() {
		return this.newUsers;
	}

	public void setNewUsers(Integer newUsers) {
		this.newUsers = newUsers;
	}

	public Integer getOldUsers() {
		return this.oldUsers;
	}

	public void setOldUsers(Integer oldUsers) {
		this.oldUsers = oldUsers;
	}

	public Integer getStayDuration() {
		return this.stayDuration;
	}

	public void setStayDuration(Integer stayDuration) {
		this.stayDuration = stayDuration;
	}

	public Integer getNewDuration() {
		return this.newDuration;
	}

	public void setNewDuration(Integer newDuration) {
		this.newDuration = newDuration;
	}

	public Integer getOldDuration() {
		return this.oldDuration;
	}

	public void setOldDuration(Integer oldDuration) {
		this.oldDuration = oldDuration;
	}

	public String getAverageStayDuration() {
		return this.averageStayDuration;
	}

	public void setAverageStayDuration(String averageStayDuration) {
		this.averageStayDuration = averageStayDuration;
	}

	public String getAverageNewDuration() {
		return this.averageNewDuration;
	}

	public void setAverageNewDuration(String averageNewDuration) {
		this.averageNewDuration = averageNewDuration;
	}

	public String getAverageOldDuration() {
		return this.averageOldDuration;
	}

	public void setAverageOldDuration(String averageOldDuration) {
		this.averageOldDuration = averageOldDuration;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return end;
	}

	public void setEnd(String end) {
		this.end = end;
	}
	
	
}


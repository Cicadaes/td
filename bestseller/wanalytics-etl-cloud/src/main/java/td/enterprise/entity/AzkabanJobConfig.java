package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>Azkaban任务配置表 AzkabanJobConfigEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AzkabanJobConfig extends BaseEntity {

    private Integer id;
    private String projectName;
    private String projectDesc;
    private String jobFilePath;
    private String flowName;
    private String scheduleTime;
    private String scheduleDate;
    private String isRecurring;
    private String recurringPeriod;
    private Integer status;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProjectName() {
        return this.projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDesc() {
        return this.projectDesc;
    }

    public void setProjectDesc(String projectDesc) {
        this.projectDesc = projectDesc;
    }

    public String getJobFilePath() {
        return this.jobFilePath;
    }

    public void setJobFilePath(String jobFilePath) {
        this.jobFilePath = jobFilePath;
    }

    public String getFlowName() {
        return this.flowName;
    }

    public void setFlowName(String flowName) {
        this.flowName = flowName;
    }

    public String getScheduleTime() {
        return this.scheduleTime;
    }

    public void setScheduleTime(String scheduleTime) {
        this.scheduleTime = scheduleTime;
    }

    public String getScheduleDate() {
        return this.scheduleDate;
    }

    public void setScheduleDate(String scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public String getIsRecurring() {
        return this.isRecurring;
    }

    public void setIsRecurring(String isRecurring) {
        this.isRecurring = isRecurring;
    }

    public String getRecurringPeriod() {
        return this.recurringPeriod;
    }

    public void setRecurringPeriod(String recurringPeriod) {
        this.recurringPeriod = recurringPeriod;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}


package td.enterprise.page;

/**
 * <br>
 * <b>功能：</b>行为客群计算参数 BehaviorCrowdPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class BehaviorCrowdPage extends BasePage {

    private Integer id;
    private String crowdName;
    private int projectId;
    private String tenantId;
    private String paramJson;
    private Integer execId;
    private Integer status;
    private Integer calcStatus;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getParamJson() {
        return this.paramJson;
    }

    public void setParamJson(String paramJson) {
        this.paramJson = paramJson;
    }

    public Integer getExecId() {
        return this.execId;
    }

    public void setExecId(Integer execId) {
        this.execId = execId;
    }

    public String getCrowdName() {
        return crowdName;
    }

    public void setCrowdName(String crowdName) {
        this.crowdName = crowdName;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getCalcStatus() {
        return calcStatus;
    }

    public void setCalcStatus(Integer calcStatus) {
        this.calcStatus = calcStatus;
    }
}

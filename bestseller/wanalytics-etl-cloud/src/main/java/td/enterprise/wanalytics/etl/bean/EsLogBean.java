package td.enterprise.wanalytics.etl.bean;

/**
 * Created by pc on 2017/7/20.
 */
public class EsLogBean {

    private String tenantId;    //租户ID
    private String projectId;   //项目ID
    private String tenantOffset;//用户唯一标识
    private String tsReceive;
    private Long sessionId;    //进店时间，由于ts_receive只精确天天，所以取sessionId


    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getTenantOffset() {
        return tenantOffset;
    }

    public void setTenantOffset(String tenantOffset) {
        this.tenantOffset = tenantOffset;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getTsReceive() {
        return tsReceive;
    }

    public void setTsReceive(String tsReceive) {
        this.tsReceive = tsReceive;
    }
}

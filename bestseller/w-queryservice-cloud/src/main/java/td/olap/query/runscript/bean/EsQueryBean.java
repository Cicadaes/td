package td.olap.query.runscript.bean;

import java.util.Collection;
import java.util.List;

/**
 * Created by Yan on 2017/4/14.
 */
public class EsQueryBean {


    private String dbName;
    private String typeName;
    private String index;
    private String tenantId;
    private String projectId;
    private String minDuration;
    private String maxDuration;
    private String newFlag;
    private String startDate;
    private String endDate;
    private String duration;
    private String count;
    private String activeSign;
    private List<String> projectIds;

    //根据时长添加是否包括字段
    private boolean hasMin; //包括最小
    private boolean hasMax; //包括最大

    //聚合count
    private String relatetionship;
    private String eventCount;

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

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

    public String getMinDuration() {
        return minDuration;
    }

    public void setMinDuration(String minDuration) {
        this.minDuration = minDuration;
    }

    public String getMaxDuration() {
        return maxDuration;
    }

    public void setMaxDuration(String maxDuration) {
        this.maxDuration = maxDuration;
    }

    public String getNewFlag() {
        return newFlag;
    }

    public void setNewFlag(String newFlag) {
        this.newFlag = newFlag;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getCount() {
        return count;
    }

    public void setCount(String count) {
        this.count = count;
    }

    public boolean isHasMin() {
        return hasMin;
    }

    public void setHasMin(boolean hasMin) {
        this.hasMin = hasMin;
    }

    public boolean isHasMax() {
        return hasMax;
    }

    public void setHasMax(boolean hasMax) {
        this.hasMax = hasMax;
    }

    public String getRelatetionship() {
        return relatetionship;
    }

    public void setRelatetionship(String relatetionship) {
        this.relatetionship = relatetionship;
    }

    public String getEventCount() {
        return eventCount;
    }

    public void setEventCount(String eventCount) {
        this.eventCount = eventCount;
    }

    public List<String> getProjectIds() {
        return projectIds;
    }

    public void setProjectIds(List<String> projectIds) {
        this.projectIds = projectIds;
    }

    public String getActiveSign() { return activeSign;  }

    public void setActiveSign(String activeSign) { this.activeSign = activeSign;  }
}

package td.enterprise.wanalytics.processor.bean;

/**
 * 根据营业时间和停留时长过滤出来的mac列表
 * 
 * @author junmin.li
 *
 */
public class FilterMacBean implements Comparable<FilterMacBean> {
    private String tenantId;
    private int projectId;
    private String mac;
    private FilterTypeEnum filterType;
    private String filterReason;
    private String createTime;

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getMac() {
        return mac;
    }

    public void setMac(String mac) {
        this.mac = mac;
    }

    public FilterTypeEnum getFilterType() {
        return filterType;
    }

    public void setFilterType(FilterTypeEnum filterType) {
        this.filterType = filterType;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
    
    
    public String getFilterReason() {
        return filterReason;
    }

    public void setFilterReason(String filterReason) {
        this.filterReason = filterReason;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    @Override
    public int hashCode() {
        String result = tenantId + "_" + projectId + "_"  + mac;
        return result.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        FilterMacBean other = (FilterMacBean) obj;
        if (mac == null) {
            if (other.mac != null)
                return false;
        } else if (!mac.equals(other.mac))
            return false;
        if (projectId != other.projectId)
            return false;
        if (tenantId == null) {
            if (other.tenantId != null)
                return false;
        } else if (!tenantId.equals(other.tenantId))
            return false;
        return true;
    }

    @Override
    public int compareTo(FilterMacBean o) {
        boolean isEqual= equals(o);
        if(isEqual){
            return 0;
        }
        return 1;
    }

}

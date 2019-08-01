package td.enterprise.service.DTO;

import td.enterprise.entity.BaseEntity;
import td.enterprise.entity.KmeansCrowdResult;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>聚类客群任务计算结果 KmeansCrowdResultEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class KmeansCrowdResultTag extends BaseEntity {

    private Integer id;
    //	private Integer kmeansCrowdId;
    private String dataName;
    private Integer projectId;
    private Integer tenantId;
    private List<KmeansCrowdResult> classifications;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProjectId() {
        return this.projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public String getDataName() {
        return dataName;
    }

    public void setDataName(String dataName) {
        this.dataName = dataName;
    }

    public List<KmeansCrowdResult> getClassifications() {
        return classifications;
    }

    public void setClassifications(List<KmeansCrowdResult> classifications) {
        this.classifications = classifications;
    }
}


package com.talkingdata.marketing.streaming.model;

import java.io.Serializable;
import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_MONITOR PipelineMonitorEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-08 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineMonitor extends BaseEntity implements Serializable {

    private Integer id;
    private Integer campaignId;
    private Integer pipelineId;
    private String pipelineNodeId;
    private String pipelineVersion;
    private Integer monitorType;
    private Long metricValue;
    private String tenantId;
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String creator;
    private String createBy;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    /**
     * 确定PipelineMonitor是唯一的key
     */
    private String uniqueKey;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>pipelineId -> pipeline_id</li>
     * <li>pipelineNodeId -> pipeline_node_id</li>
     * <li>pipelineVersion -> pipeline_version</li>
     * <li>monitorType -> monitor_type</li>
     * <li>metricValue -> metric_value</li>
     * <li>tenantId -> tenant_id</li>
     * <li>createTime -> create_time</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id":
                return "id";
            case "campaignId":
                return "campaign_id";
            case "pipelineId":
                return "pipeline_id";
            case "pipelineNodeId":
                return "pipeline_node_id";
            case "pipelineVersion":
                return "pipeline_version";
            case "monitorType":
                return "monitor_type";
            case "metricValue":
                return "metric_value";
            case "tenantId":
                return "tenant_id";
            case "createTime":
                return "create_time";
            case "creator":
                return "creator";
            case "createBy":
                return "create_by";
            case "updater":
                return "updater";
            case "updateBy":
                return "update_by";
            case "updateTime":
                return "update_time";
            default:
                return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaign_id -> campaignId</li>
     * <li>pipeline_id -> pipelineId</li>
     * <li>pipeline_node_id -> pipelineNodeId</li>
     * <li>pipeline_version -> pipelineVersion</li>
     * <li>monitor_type -> monitorType</li>
     * <li>metric_value -> metricValue</li>
     * <li>tenant_id -> tenantId</li>
     * <li>create_time -> createTime</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id":
                return "id";
            case "campaign_id":
                return "campaignId";
            case "pipeline_id":
                return "pipelineId";
            case "pipeline_node_id":
                return "pipelineNodeId";
            case "pipeline_version":
                return "pipelineVersion";
            case "monitor_type":
                return "monitorType";
            case "metric_value":
                return "metricValue";
            case "tenant_id":
                return "tenantId";
            case "create_time":
                return "createTime";
            case "creator":
                return "creator";
            case "create_by":
                return "createBy";
            case "updater":
                return "updater";
            case "update_by":
                return "updateBy";
            case "update_time":
                return "updateTime";
            default:
                return null;
        }
    }

    /**
     * 主键
     **/
    public Integer getId() {
        return this.id;
    }

    /**
     * 主键
     **/
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * 活动ID
     **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /**
     * 活动ID
     **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /**
     * 活动流程ID
     **/
    public Integer getPipelineId() {
        return this.pipelineId;
    }

    /**
     * 活动流程ID
     **/
    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    /**
     * 活动流程节点ID
     **/
    public String getPipelineNodeId() {
        return this.pipelineNodeId;
    }

    /**
     * 活动流程节点ID
     **/
    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    /**
     * 活动流程版本
     **/
    public String getPipelineVersion() {
        return this.pipelineVersion;
    }

    /**
     * 活动流程版本
     **/
    public void setPipelineVersion(String pipelineVersion) {
        this.pipelineVersion = pipelineVersion;
    }

    /**
     * 监控类型
     **/
    public Integer getMonitorType() {
        return this.monitorType;
    }

    /**
     * 监控类型
     **/
    public void setMonitorType(Integer monitorType) {
        this.monitorType = monitorType;
    }

    /**
     * 指标值
     **/
    public Long getMetricValue() {
        return this.metricValue;
    }

    /**
     * 指标值
     **/
    public void setMetricValue(Long metricValue) {
        this.metricValue = metricValue;
    }

    /**
     * 租户id
     **/
    public String getTenantId() {
        return this.tenantId;
    }

    /**
     * 租户id
     **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /**
     * 创建时间
     **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /**
     * 创建时间
     **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * 创建人
     **/
    public String getCreator() {
        return this.creator;
    }

    /**
     * 创建人
     **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /**
     * 创建人账号
     **/
    public String getCreateBy() {
        return this.createBy;
    }

    /**
     * 创建人账号
     **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /**
     * 更新人
     **/
    public String getUpdater() {
        return this.updater;
    }

    /**
     * 更新人
     **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /**
     * 更新人账号
     **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /**
     * 更新人账号
     **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /**
     * 更新时间
     **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /**
     * 更新时间
     **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getUniqueKey() {
        return uniqueKey;
    }

    public void setUniqueKey(String uniqueKey) {
        this.uniqueKey = uniqueKey;
    }

    @Override
    public String toString() {
        return "PipelineMonitor{" +
                "campaignId=" + campaignId +
                ", pipelineId=" + pipelineId +
                ", pipelineNodeId='" + pipelineNodeId + '\'' +
                ", pipelineVersion='" + pipelineVersion + '\'' +
                ", monitorType=" + monitorType +
                ", metricValue=" + metricValue +
                '}';
    }
}

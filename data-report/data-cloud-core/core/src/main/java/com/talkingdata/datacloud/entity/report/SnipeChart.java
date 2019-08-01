package com.talkingdata.datacloud.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_SNIPE_CHART SnipeChartEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SnipeChart extends BaseEntity {

    private Integer id;
    private String chartUuid;
    private Integer datasourceId;
    private String datasetId;
    private String chartType;
    private String chartName;
    private String filter;
    private String xIds;
    private String yIds;
    private String style;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>chartUuid -> chart_uuid</li>
     * <li>datasourceId -> datasource_id</li>
     * <li>datasetId -> dataset_id</li>
     * <li>chartType -> chart_type</li>
     * <li>chartName -> chart_name</li>
     * <li>filter -> filter</li>
     * <li>xIds -> x_ids</li>
     * <li>yIds -> y_ids</li>
     * <li>style -> style</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "chartUuid": return "chart_uuid";
            case "datasourceId": return "datasource_id";
            case "datasetId": return "dataset_id";
            case "chartType": return "chart_type";
            case "chartName": return "chart_name";
            case "filter": return "filter";
            case "xIds": return "x_ids";
            case "yIds": return "y_ids";
            case "style": return "style";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>chart_uuid -> chartUuid</li>
     * <li>datasource_id -> datasourceId</li>
     * <li>datasetId -> dataset_id</li>
     * <li>chart_type -> chartType</li>
     * <li>chart_name -> chartName</li>
     * <li>filter -> filter</li>
     * <li>x_ids -> xIds</li>
     * <li>y_ids -> yIds</li>
     * <li>style -> style</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "chart_uuid": return "chartUuid";
            case "datasource_id": return "datasourceId";
            case "dataset_id": return "datasetId";
            case "chart_type": return "chartType";
            case "chart_name": return "chartName";
            case "filter": return "filter";
            case "x_ids": return "xIds";
            case "y_ids": return "yIds";
            case "style": return "style";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            default: return null;
        }
    }
    
    /** 主键id，自增 **/
    public Integer getId() {
        return this.id;
    }

    /** 主键id，自增 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** chart UUID **/
    public String getChartUuid() {
        return this.chartUuid;
    }

    /** chart UUID **/
    public void setChartUuid(String chartUuid) {
        this.chartUuid = chartUuid;
    }

    /** 数据源ID **/
    public Integer getDatasourceId() {
        return this.datasourceId;
    }

    /** 数据源ID **/
    public void setDatasourceId(Integer datasourceId) {
        this.datasourceId = datasourceId;
    }

    /** 数据集ID **/
    public String getDatasetId() {
        return this.datasetId;
    }

    /** 数据集ID **/
    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    /** 图表类型，此类型由前端决定 **/
    public String getChartType() {
        return this.chartType;
    }

    /** 图表类型，此类型由前端决定 **/
    public void setChartType(String chartType) {
        this.chartType = chartType;
    }

    /** 图表名称 **/
    public String getChartName() {
        return this.chartName;
    }

    /** 图表名称 **/
    public void setChartName(String chartName) {
        this.chartName = chartName;
    }

    /** 数据过滤条件 **/
    public String getFilter() {
        return this.filter;
    }

    /** 数据过滤条件 **/
    public void setFilter(String filter) {
        this.filter = filter;
    }

    /** x轴字段ID列表 **/
    public String getXIds() {
        return this.xIds;
    }

    /** x轴字段ID列表 **/
    public void setXIds(String xIds) {
        this.xIds = xIds;
    }

    /** y轴字段ID列表 **/
    public String getYIds() {
        return this.yIds;
    }

    /** y轴字段ID列表 **/
    public void setYIds(String yIds) {
        this.yIds = yIds;
    }

    /** chart样式描述 **/
    public String getStyle() {
        return this.style;
    }

    /** chart样式描述 **/
    public void setStyle(String style) {
        this.style = style;
    }

    /** 创建人 **/
    public String getCreator() {
        return this.creator;
    }

    /** 创建人 **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /** 创建人账号 **/
    public String getCreateBy() {
        return this.createBy;
    }

    /** 创建人账号 **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /** 修改人 **/
    public String getUpdater() {
        return this.updater;
    }

    /** 修改人 **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /** 修改人账号 **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 修改人账号 **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /** 修改时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 修改时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}

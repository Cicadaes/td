package com.talkingdata.datacloud.visual.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <b>功能：</b>TD_DC_CONFIG_DEFINITION ConfigDefinitionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ConfigDefinition extends BaseEntity {

    private Integer id;
    private Integer groupId;
    private Integer orderNum;
    private String name;
    private String code;
    private String version;
    private Integer type;
    private Integer status;
    private String diagramName;
    private String developer;
    private String implClass;
    private String description;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private List<ConfigDefinitionField> configDefinitionFieldList= new ArrayList<ConfigDefinitionField>();

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>groupId -> group_id</li>
     * <li>orderNum -> order_num</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>version -> version</li>
     * <li>type -> type</li>
     * <li>status -> status</li>
     * <li>diagramName -> diagram_name</li>
     * <li>developer -> developer</li>
     * <li>implClass -> impl_class</li>
     * <li>description -> description</li>
     * <li>tenantId -> tenant_id</li>
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
            case "groupId": return "group_id";
            case "orderNum": return "order_num";
            case "name": return "name";
            case "code": return "code";
            case "version": return "version";
            case "type": return "type";
            case "status": return "status";
            case "diagramName": return "diagram_name";
            case "developer": return "developer";
            case "implClass": return "impl_class";
            case "description": return "description";
            case "tenantId": return "tenant_id";
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
     * <li>group_id -> groupId</li>
     * <li>order_num -> orderNum</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>version -> version</li>
     * <li>type -> type</li>
     * <li>status -> status</li>
     * <li>diagram_name -> diagramName</li>
     * <li>developer -> developer</li>
     * <li>impl_class -> implClass</li>
     * <li>description -> description</li>
     * <li>tenant_id -> tenantId</li>
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
            case "group_id": return "groupId";
            case "order_num": return "orderNum";
            case "name": return "name";
            case "code": return "code";
            case "version": return "version";
            case "type": return "type";
            case "status": return "status";
            case "diagram_name": return "diagramName";
            case "developer": return "developer";
            case "impl_class": return "implClass";
            case "description": return "description";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            default: return null;
        }
    }
    
    /**  **/
    public Integer getId() {
        return this.id;
    }

    /**  **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 图表组ID **/
    public Integer getGroupId() {
        return this.groupId;
    }

    /** 图表组ID **/
    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    /** 图表排列顺序 **/
    public Integer getOrderNum() {
        return this.orderNum;
    }

    /** 图表排列顺序 **/
    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 编码,当为图表时此字段为图表类型 1:文本,2:表格,3:图片,4:饼图,5:柱图,6:线图,7:条图,8:时间,9:地图,10:区域图,11:概览,12:矩形,13:圆形 **/
    public String getCode() {
        return this.code;
    }

    /** 编码,当为图表时此字段为图表类型 1:文本,2:表格,3:图片,4:饼图,5:柱图,6:线图,7:条图,8:时间,9:地图,10:区域图,11:概览,12:矩形,13:圆形 **/
    public void setCode(String code) {
        this.code = code;
    }

    /** 版本 **/
    public String getVersion() {
        return this.version;
    }

    /** 版本 **/
    public void setVersion(String version) {
        this.version = version;
    }

    /** 版本,1 datasource 2, chart,3:adapter **/
    public Integer getType() {
        return this.type;
    }

    /** 版本,1 datasource 2, chart,3:adapter **/
    public void setType(Integer type) {
        this.type = type;
    }

    /** 状态 -1,无效 0,有效 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 -1,无效 0,有效 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 图片名称 **/
    public String getDiagramName() {
        return this.diagramName;
    }

    /** 图片名称 **/
    public void setDiagramName(String diagramName) {
        this.diagramName = diagramName;
    }

    /** 开发者 **/
    public String getDeveloper() {
        return this.developer;
    }

    /** 开发者 **/
    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    /** 接口实现类 **/
    public String getImplClass() {
        return this.implClass;
    }

    /** 接口实现类 **/
    public void setImplClass(String implClass) {
        this.implClass = implClass;
    }

    /** 描述 **/
    public String getDescription() {
        return this.description;
    }

    /** 描述 **/
    public void setDescription(String description) {
        this.description = description;
    }

    /** 租户ID **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户ID **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
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

    public List<ConfigDefinitionField> getConfigDefinitionFieldList() {
        return configDefinitionFieldList;
    }

    public void setConfigDefinitionFieldList(List<ConfigDefinitionField> configDefinitionFieldList) {
        this.configDefinitionFieldList = configDefinitionFieldList;
    }
}

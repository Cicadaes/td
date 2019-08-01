package com.talkingdata.datacloud.visual.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <b>功能：</b>TD_DC_VISUAL_ADAPTER_ATTACHMENT AdapterAttachmentEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AdapterAttachment extends BaseEntity {

    private Integer id;
    private Integer adapterId;
    private Integer parentId;
    private String version;
    private String code;
    private String name;
    private String path;
    private Integer type;
    private String size;
    private Object data;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private List<AdapterAttachment> dependencyAttachmentList=new ArrayList<>();

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>adapterId -> adapter_id</li>
     * <li>parentId -> parent_id</li>
     * <li>version -> version</li>
     * <li>code -> code</li>
     * <li>name -> name</li>
     * <li>path -> path</li>
     * <li>type -> type</li>
     * <li>size -> size</li>
     * <li>data -> data</li>
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
            case "adapterId": return "adapter_id";
            case "parentId": return "parent_id";
            case "version": return "version";
            case "code": return "code";
            case "name": return "name";
            case "path": return "path";
            case "type": return "type";
            case "size": return "size";
            case "data": return "data";
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
     * <li>adapter_id -> adapterId</li>
     * <li>parent_id -> parentId</li>
     * <li>version -> version</li>
     * <li>code -> code</li>
     * <li>name -> name</li>
     * <li>path -> path</li>
     * <li>type -> type</li>
     * <li>size -> size</li>
     * <li>data -> data</li>
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
            case "adapter_id": return "adapterId";
            case "parent_id": return "parentId";
            case "version": return "version";
            case "code": return "code";
            case "name": return "name";
            case "path": return "path";
            case "type": return "type";
            case "size": return "size";
            case "data": return "data";
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

    /** adapter ID **/
    public Integer getAdapterId() {
        return this.adapterId;
    }

    /** adapter ID **/
    public void setAdapterId(Integer adapterId) {
        this.adapterId = adapterId;
    }

    /** 依赖包所属主JAR包ID **/
    public Integer getParentId() {
        return this.parentId;
    }

    /** 依赖包所属主JAR包ID **/
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    /**  **/
    public String getVersion() {
        return this.version;
    }

    /**  **/
    public void setVersion(String version) {
        this.version = version;
    }

    /**  **/
    public String getCode() {
        return this.code;
    }

    /**  **/
    public void setCode(String code) {
        this.code = code;
    }

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 附件存储路径 **/
    public String getPath() {
        return this.path;
    }

    /** 附件存储路径 **/
    public void setPath(String path) {
        this.path = path;
    }

    /** 附件类型 1,main JAR 2.dependency JAR **/
    public Integer getType() {
        return this.type;
    }

    /** 附件类型 1,main JAR 2.dependency JAR **/
    public void setType(Integer type) {
        this.type = type;
    }

    /** 大小 **/
    public String getSize() {
        return this.size;
    }

    /** 大小 **/
    public void setSize(String size) {
        this.size = size;
    }

    /** 附件内容 最大为10M **/
    public Object getData() {
        return this.data;
    }

    /** 附件内容 最大为10M **/
    public void setData(Object data) {
        this.data = data;
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

    public List<AdapterAttachment> getDependencyAttachmentList() {
        return dependencyAttachmentList;
    }

    public void setDependencyAttachmentList(List<AdapterAttachment> dependencyAttachmentList) {
        this.dependencyAttachmentList = dependencyAttachmentList;
    }
}

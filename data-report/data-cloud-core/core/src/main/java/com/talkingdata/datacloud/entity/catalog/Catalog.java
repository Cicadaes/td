package com.talkingdata.datacloud.entity.catalog;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.talkingdata.datacloud.base.entity.BaseEntity;
import com.talkingdata.datacloud.vo.TreeNode;

import java.util.*;


/**
 * <b>功能：</b>dict_catalog CatalogEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Catalog extends BaseEntity {

    private Integer id;
    private String title;
    private String path;
    private Integer level;
    private Integer parentId;
    private Integer isFolder;
    private Integer datasetId;
    private Object storageType;
    private Integer createdTime;
    private Integer modifiedTime;
    private String updater;
    private Integer whEtlExecId;
    private String creator;
    private String createBy;
    private String updateBy;
    private String description;
    // 数据集权限集合
    private Set<TreeNode.Permission> permissions = new HashSet<>();

    @JsonIgnore
    private Catalog parent;

    public Catalog getParent() {
        return parent;
    }

    public void setParent(Catalog parent) {
        this.parent = parent;
    }

    private List<Catalog> parentList;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>title -> title</li>
     * <li>path -> path</li>
     * <li>level -> level</li>
     * <li>parentId -> parent_id</li>
     * <li>isFolder -> is_folder</li>
     * <li>datasetId -> dataset_id</li>
     * <li>storageType -> storage_type</li>
     * <li>createdTime -> created_time</li>
     * <li>modifiedTime -> modified_time</li>
     * <li>updater -> updater</li>
     * <li>whEtlExecId -> wh_etl_exec_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>updateBy -> update_by</li>
     * <li>description -> description</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id":
                return "id";
            case "title":
                return "title";
            case "path":
                return "path";
            case "level":
                return "level";
            case "parentId":
                return "parent_id";
            case "isFolder":
                return "is_folder";
            case "datasetId":
                return "dataset_id";
            case "storageType":
                return "storage_type";
            case "createdTime":
                return "created_time";
            case "modifiedTime":
                return "modified_time";
            case "updater":
                return "updater";
            case "whEtlExecId":
                return "wh_etl_exec_id";
            case "creator":
                return "creator";
            case "createBy":
                return "create_by";
            case "updateBy":
                return "update_by";
            case "description":
                return "description";				
            default:
                return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>title -> title</li>
     * <li>path -> path</li>
     * <li>level -> level</li>
     * <li>parent_id -> parentId</li>
     * <li>is_folder -> isFolder</li>
     * <li>dataset_id -> datasetId</li>
     * <li>storage_type -> storageType</li>
     * <li>created_time -> createdTime</li>
     * <li>modified_time -> modifiedTime</li>
     * <li>updater -> updater</li>
     * <li>wh_etl_exec_id -> whEtlExecId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id":
                return "id";
            case "title":
                return "title";
            case "path":
                return "path";
            case "level":
                return "level";
            case "parent_id":
                return "parentId";
            case "is_folder":
                return "isFolder";
            case "dataset_id":
                return "datasetId";
            case "storage_type":
                return "storageType";
            case "created_time":
                return "createdTime";
            case "modified_time":
                return "modifiedTime";
            case "updater":
                return "updater";
            case "wh_etl_exec_id":
                return "whEtlExecId";
            case "creator":
                return "creator";
            case "create_by":
                return "createBy";
            case "update_by":
                return "updateBy";
			case "description": 
				return "description";
            default:
                return null;
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

    /**  **/
    public String getTitle() {
        return this.title;
    }

    /**  **/
    public void setTitle(String title) {
        this.title = title;
    }

    /**  **/
    public String getPath() {
        return this.path;
    }

    /**  **/
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * level of catalog
     **/
    public Integer getLevel() {
        return this.level;
    }

    /**
     * level of catalog
     **/
    public void setLevel(Integer level) {
        this.level = level;
    }

    /**
     * parent id of current catalog
     **/
    public Integer getParentId() {
        return this.parentId;
    }

    /**
     * parent id of current catalog
     **/
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    /**
     * 1,数据目录;0,文件型数据集;-1,目录型数据集
     **/
    public Integer getIsFolder() {
        return this.isFolder;
    }

    /**  **/
    public void setIsFolder(Integer isFolder) {
        this.isFolder = isFolder;
    }

    /**  **/
    public Integer getDatasetId() {
        return this.datasetId;
    }

    /**  **/
    public void setDatasetId(Integer datasetId) {
        this.datasetId = datasetId;
    }

    /**  **/
    public Object getStorageType() {
        return storageType;
    }

    /**  **/
    public void setStorageType(Object storageType) {
        this.storageType = storageType;
    }

    /**
     * wherehows created time
     **/
    public Integer getCreatedTime() {
        return this.createdTime;
    }

    /**
     * wherehows created time
     **/
    public void setCreatedTime(Integer createdTime) {
        this.createdTime = createdTime;
    }

    /**
     * latest wherehows modified
     **/
    public Integer getModifiedTime() {
        return this.modifiedTime;
    }

    /**
     * latest wherehows modified
     **/
    public void setModifiedTime(Integer modifiedTime) {
        this.modifiedTime = modifiedTime;
    }

    /**  **/
    public String getUpdater() {
        return this.updater;
    }

    /**  **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /**
     * wherehows etl execution id that modified this record
     **/
    public Integer getWhEtlExecId() {
        return this.whEtlExecId;
    }

    /**
     * wherehows etl execution id that modified this record
     **/
    public void setWhEtlExecId(Integer whEtlExecId) {
        this.whEtlExecId = whEtlExecId;
    }

    public Set<TreeNode.Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<TreeNode.Permission> permissions) {
        this.permissions = permissions;
    }

    public Catalog addUpdatePermission() {
        this.permissions.add(TreeNode.Permission.UPDATE);
        return this;
    }

    public Catalog addDeletePermission() {
        this.permissions.add(TreeNode.Permission.DELETE);
        return this;
    }

    public Catalog addCreateSubCatalogPermission() {
        this.permissions.add(TreeNode.Permission.CREATE_SUB_CATALOG);
        return this;
    }

    public Catalog addCreateDatasetPermission() {
        this.permissions.add(TreeNode.Permission.CREATE_DATASET);
        return this;
    }

    public Catalog addGrantPermission() {
        this.permissions.add(TreeNode.Permission.GRANT);
        return this;
    }

    public Catalog addReadPermission() {
        this.permissions.add(TreeNode.Permission.READ);
        return this;
    }

    public Catalog addRefreshPermission() {
        this.permissions.add(TreeNode.Permission.REFRESH);
        return this;
    }

    public Catalog removeUpdatePermission() {
        this.permissions.remove(TreeNode.Permission.UPDATE);
        return this;
    }

    public Catalog removeDeletePermission() {
        this.permissions.remove(TreeNode.Permission.DELETE);
        return this;
    }

    public Catalog removeCreateSubCatalogPermission() {
        this.permissions.remove(TreeNode.Permission.CREATE_SUB_CATALOG);
        return this;
    }

    public Catalog removeCreateDatasetPermission() {
        this.permissions.remove(TreeNode.Permission.CREATE_DATASET);
        return this;
    }

    public Catalog removeGrantPermission() {
        this.permissions.remove(TreeNode.Permission.GRANT);
        return this;
    }

    public Catalog removeReadPermission() {
        this.permissions.remove(TreeNode.Permission.READ);
        return this;
    }

    public Catalog removeRefreshPermission() {
        this.permissions.remove(TreeNode.Permission.REFRESH);
        return this;
    }

    /**  **/
    public String getCreator() {
        return this.creator;
    }

    /**  **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /**  **/
    public String getCreateBy() {
        return this.createBy;
    }

    /**  **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /**  **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /**  **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }
    /** 描述 **/
    public String getDescription() {
        return this.description;
    }

    /** 描述 **/
    public void setDescription(String description) {
        this.description = description;
    }

    public List<Catalog> getParentList() {
        return parentList;
    }

    public void setParentList(List<Catalog> parentList) {
        this.parentList = parentList;
    }

    public void assembleParentList(){
        parentList = new ArrayList<>();
        Catalog tmp = parent;
        while(null != tmp){
            parentList.add(tmp);
            tmp = tmp.getParent();
        }
        Collections.reverse(parentList);
    }
}

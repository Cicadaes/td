package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>auto_scan AutoScanEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AutoScan extends BaseEntity {

    private Integer id;
    private String autoScanPath;
    private String ignorePattern;
    private Integer verifyMetadata;
    private String csvScanRule;
    private String jsonScanRule;
    private Integer status;
    private String creator;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createdTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date modifiedTime;
    private String updater;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>autoScanPath -> auto_scan_path</li>
     * <li>ignorePattern -> ignore_pattern</li>
     * <li>verifyMetadata -> verify_metadata</li>
     * <li>csvScanRule -> csv_scan_rule</li>
     * <li>jsonScanRule -> json_scan_rule</li>
     * <li>status -> status</li>
     * <li>creator -> creator</li>
     * <li>createdTime -> created_time</li>
     * <li>modifiedTime -> modified_time</li>
     * <li>updater -> updater</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "autoScanPath": return "auto_scan_path";
            case "ignorePattern": return "ignore_pattern";
            case "verifyMetadata": return "verify_metadata";
            case "csvScanRule": return "csv_scan_rule";
            case "jsonScanRule": return "json_scan_rule";
            case "status": return "status";
            case "creator": return "creator";
            case "createdTime": return "created_time";
            case "modifiedTime": return "modified_time";
            case "updater": return "updater";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>auto_scan_path -> autoScanPath</li>
     * <li>ignore_pattern -> ignorePattern</li>
     * <li>verify_metadata -> verifyMetadata</li>
     * <li>csv_scan_rule -> csvScanRule</li>
     * <li>json_scan_rule -> jsonScanRule</li>
     * <li>status -> status</li>
     * <li>creator -> creator</li>
     * <li>created_time -> createdTime</li>
     * <li>modified_time -> modifiedTime</li>
     * <li>updater -> updater</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "auto_scan_path": return "autoScanPath";
            case "ignore_pattern": return "ignorePattern";
            case "verify_metadata": return "verifyMetadata";
            case "csv_scan_rule": return "csvScanRule";
            case "json_scan_rule": return "jsonScanRule";
            case "status": return "status";
            case "creator": return "creator";
            case "created_time": return "createdTime";
            case "modified_time": return "modifiedTime";
            case "updater": return "updater";
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

    /** 扫描路径 **/
    public String getAutoScanPath() {
        return this.autoScanPath;
    }

    /** 扫描路径 **/
    public void setAutoScanPath(String autoScanPath) {
        this.autoScanPath = autoScanPath;
    }

    /** 扫描忽略的文件模式 **/
    public String getIgnorePattern() {
        return this.ignorePattern;
    }

    /** 扫描忽略的文件模式 **/
    public void setIgnorePattern(String ignorePattern) {
        this.ignorePattern = ignorePattern;
    }

    /** 是否校验数据可用性 **/
    public Integer getVerifyMetadata() {
        return this.verifyMetadata;
    }

    /** 是否校验数据可用性 **/
    public void setVerifyMetadata(Integer verifyMetadata) {
        this.verifyMetadata = verifyMetadata;
    }

    /** csv文件默认规则 **/
    public String getCsvScanRule() {
        return this.csvScanRule;
    }

    /** csv文件默认规则 **/
    public void setCsvScanRule(String csvScanRule) {
        this.csvScanRule = csvScanRule;
    }

    /** json文件默认规则 **/
    public String getJsonScanRule() {
        return this.jsonScanRule;
    }

    /** json文件默认规则 **/
    public void setJsonScanRule(String jsonScanRule) {
        this.jsonScanRule = jsonScanRule;
    }

    /** 是否启用 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 是否启用 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 创建人 **/
    public String getCreator() {
        return this.creator;
    }

    /** 创建人 **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /** created time **/
    public Date getCreatedTime() {
        return this.createdTime;
    }

    /** created time **/
    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    /** latest modified **/
    public Date getModifiedTime() {
        return this.modifiedTime;
    }

    /** latest modified **/
    public void setModifiedTime(Date modifiedTime) {
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

}

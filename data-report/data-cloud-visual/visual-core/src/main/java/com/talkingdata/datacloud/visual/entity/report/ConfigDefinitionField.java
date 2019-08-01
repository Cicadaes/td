package com.talkingdata.datacloud.visual.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <b>功能：</b>TD_DC_CONFIG_DEFINITION_FIELD ConfigDefinitionFieldEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ConfigDefinitionField extends BaseEntity {

    private Integer id;
    private Integer configDefinitionId;
    private Integer parentId;
    private String fieldGroupName;
    private Integer fieldGroupEnable;
    private Integer fieldTabLock;
    private String fieldTabName;
    private String name;
    private String code;
    private String fieldAliasName;
    private Integer valueType;
    private Integer multipleMaxNumber;
    private String defaultValue;
    private String optionValues;
    private Integer requried;
    private String minValue;
    private String maxValue;
    private String verifyRule;
    private String verifyGroupName;
    private String verifyGroupRule;
    private String helpInfo;
    private Integer viewType;
    private String iconClass;
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
    private String viewMetaData;
    private List<ConfigDefinitionField> childFieldList= new ArrayList<>();
    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>configDefinitionId -> config_definition_id</li>
     * <li>parentId -> parent_id</li>
     * <li>fieldGroupName -> field_group_name</li>
     * <li>fieldGroupEnable -> field_group_enable</li>
     * <li>fieldTabLock -> field_tab_lock</li>
     * <li>fieldTabName -> field_tab_name</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>fieldAliasName -> field_alias_name</li>
     * <li>valueType -> value_type</li>
     * <li>multipleMaxNumber -> multiple_max_number</li>
     * <li>defaultValue -> default_value</li>
     * <li>optionValues -> option_values</li>
     * <li>requried -> requried</li>
     * <li>minValue -> min_value</li>
     * <li>maxValue -> max_value</li>
     * <li>verifyRule -> verify_rule</li>
     * <li>verifyGroupName -> verify_group_name</li>
     * <li>verifyGroupRule -> verify_group_rule</li>
     * <li>helpInfo -> help_info</li>
     * <li>viewType -> view_type</li>
     * <li>iconClass -> icon_class</li>
     * <li>description -> description</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     * <li>viewMetaData -> view_meta_data</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "configDefinitionId": return "config_definition_id";
            case "parentId": return "parent_id";
            case "fieldGroupName": return "field_group_name";
            case "fieldGroupEnable": return "field_group_enable";
            case "fieldTabLock": return "field_tab_lock";
            case "fieldTabName": return "field_tab_name";
            case "name": return "name";
            case "code": return "code";
            case "fieldAliasName": return "field_alias_name";
            case "valueType": return "value_type";
            case "multipleMaxNumber": return "multiple_max_number";
            case "defaultValue": return "default_value";
            case "optionValues": return "option_values";
            case "requried": return "requried";
            case "minValue": return "min_value";
            case "maxValue": return "max_value";
            case "verifyRule": return "verify_rule";
            case "verifyGroupName": return "verify_group_name";
            case "verifyGroupRule": return "verify_group_rule";
            case "helpInfo": return "help_info";
            case "viewType": return "view_type";
            case "iconClass": return "icon_class";
            case "description": return "description";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            case "viewMetaData": return "view_meta_data";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>config_definition_id -> configDefinitionId</li>
     * <li>parent_id -> parentId</li>
     * <li>field_group_name -> fieldGroupName</li>
     * <li>field_group_enable -> fieldGroupEnable</li>
     * <li>field_tab_lock -> fieldTabLock</li>
     * <li>field_tab_name -> fieldTabName</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>field_alias_name -> fieldAliasName</li>
     * <li>value_type -> valueType</li>
     * <li>multiple_max_number -> multipleMaxNumber</li>
     * <li>default_value -> defaultValue</li>
     * <li>option_values -> optionValues</li>
     * <li>requried -> requried</li>
     * <li>min_value -> minValue</li>
     * <li>max_value -> maxValue</li>
     * <li>verify_rule -> verifyRule</li>
     * <li>verify_group_name -> verifyGroupName</li>
     * <li>verify_group_rule -> verifyGroupRule</li>
     * <li>help_info -> helpInfo</li>
     * <li>view_type -> viewType</li>
     * <li>icon_class -> iconClass</li>
     * <li>description -> description</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     * <li>view_meta_data -> viewMetaData</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "config_definition_id": return "configDefinitionId";
            case "parent_id": return "parentId";
            case "field_group_name": return "fieldGroupName";
            case "field_group_enable": return "fieldGroupEnable";
            case "field_tab_lock": return "fieldTabLock";
            case "field_tab_name": return "fieldTabName";
            case "name": return "name";
            case "code": return "code";
            case "field_alias_name": return "fieldAliasName";
            case "value_type": return "valueType";
            case "multiple_max_number": return "multipleMaxNumber";
            case "default_value": return "defaultValue";
            case "option_values": return "optionValues";
            case "requried": return "requried";
            case "min_value": return "minValue";
            case "max_value": return "maxValue";
            case "verify_rule": return "verifyRule";
            case "verify_group_name": return "verifyGroupName";
            case "verify_group_rule": return "verifyGroupRule";
            case "help_info": return "helpInfo";
            case "view_type": return "viewType";
            case "icon_class": return "iconClass";
            case "description": return "description";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            case "view_meta_data": return "viewMetaData";
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

    /** 样式ID **/
    public Integer getConfigDefinitionId() {
        return this.configDefinitionId;
    }

    /** 样式ID **/
    public void setConfigDefinitionId(Integer configDefinitionId) {
        this.configDefinitionId = configDefinitionId;
    }

    /** 父id **/
    public Integer getParentId() {
        return this.parentId;
    }

    /** 父id **/
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    /** 属性分组名称 **/
    public String getFieldGroupName() {
        return this.fieldGroupName;
    }

    /** 属性分组名称 **/
    public void setFieldGroupName(String fieldGroupName) {
        this.fieldGroupName = fieldGroupName;
    }

    /** 是否展示 group 0 不展示 1 展示 **/
    public Integer getFieldGroupEnable() {
        return this.fieldGroupEnable;
    }

    /** 是否展示 group 0 不展示 1 展示 **/
    public void setFieldGroupEnable(Integer fieldGroupEnable) {
        this.fieldGroupEnable = fieldGroupEnable;
    }

    /** 是否锁定tab 0 不锁定 1 锁定 **/
    public Integer getFieldTabLock() {
        return this.fieldTabLock;
    }

    /** 是否锁定tab 0 不锁定 1 锁定 **/
    public void setFieldTabLock(Integer fieldTabLock) {
        this.fieldTabLock = fieldTabLock;
    }

    /** tab 显示的name **/
    public String getFieldTabName() {
        return this.fieldTabName;
    }

    /** tab 显示的name **/
    public void setFieldTabName(String fieldTabName) {
        this.fieldTabName = fieldTabName;
    }

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 编码 **/
    public String getCode() {
        return this.code;
    }

    /** 编码 **/
    public void setCode(String code) {
        this.code = code;
    }

    /** 字段重命名 **/
    public String getFieldAliasName() {
        return this.fieldAliasName;
    }

    /** 字段重命名 **/
    public void setFieldAliasName(String fieldAliasName) {
        this.fieldAliasName = fieldAliasName;
    }

    /** 状态 0, 不需要搜集参数 1,字符串 2,整形 3,浮点型 4,日期 5,时间 6,数组 7,文件 8,Json 9,boolean **/
    public Integer getValueType() {
        return this.valueType;
    }

    /** 状态 0, 不需要搜集参数 1,字符串 2,整形 3,浮点型 4,日期 5,时间 6,数组 7,文件 8,Json 9,boolean **/
    public void setValueType(Integer valueType) {
        this.valueType = valueType;
    }

    /** 输入框中值的最大数目 **/
    public Integer getMultipleMaxNumber() {
        return this.multipleMaxNumber;
    }

    /** 输入框中值的最大数目 **/
    public void setMultipleMaxNumber(Integer multipleMaxNumber) {
        this.multipleMaxNumber = multipleMaxNumber;
    }

    /** 默认值 **/
    public String getDefaultValue() {
        return this.defaultValue;
    }

    /** 默认值 **/
    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    /** 候选值 **/
    public String getOptionValues() {
        return this.optionValues;
    }

    /** 候选值 **/
    public void setOptionValues(String optionValues) {
        this.optionValues = optionValues;
    }

    /** 是否必须 0,必须 1,可选,2 隐藏不可选 **/
    public Integer getRequried() {
        return this.requried;
    }

    /** 是否必须 0,必须 1,可选,2 隐藏不可选 **/
    public void setRequried(Integer requried) {
        this.requried = requried;
    }

    /** 最小值 **/
    public String getMinValue() {
        return this.minValue;
    }

    /** 最小值 **/
    public void setMinValue(String minValue) {
        this.minValue = minValue;
    }

    /** 最大值值 **/
    public String getMaxValue() {
        return this.maxValue;
    }

    /** 最大值值 **/
    public void setMaxValue(String maxValue) {
        this.maxValue = maxValue;
    }

    /** 校验规则 **/
    public String getVerifyRule() {
        return this.verifyRule;
    }

    /** 校验规则 **/
    public void setVerifyRule(String verifyRule) {
        this.verifyRule = verifyRule;
    }

    /** 校验组 **/
    public String getVerifyGroupName() {
        return this.verifyGroupName;
    }

    /** 校验组 **/
    public void setVerifyGroupName(String verifyGroupName) {
        this.verifyGroupName = verifyGroupName;
    }

    /** 校验组规则 1,全填 2,其中之一 **/
    public String getVerifyGroupRule() {
        return this.verifyGroupRule;
    }

    /** 校验组规则 1,全填 2,其中之一 **/
    public void setVerifyGroupRule(String verifyGroupRule) {
        this.verifyGroupRule = verifyGroupRule;
    }

    /** 帮助信息 **/
    public String getHelpInfo() {
        return this.helpInfo;
    }

    /** 帮助信息 **/
    public void setHelpInfo(String helpInfo) {
        this.helpInfo = helpInfo;
    }

    /** 0:隐藏,1:输入框,2:下拉框,3:文本框,4:日期选择框,5:时间选择框,6:表格,7:文件,8:按钮,9:密码,10:未分配,11:AutoComplete,12:静态文本,13:radio,14:checkbox,15:colorPicker,16:colorblock,17:dragRange,18:redioList,19:checkList,20:selectList **/
    public Integer getViewType() {
        return this.viewType;
    }

    /** 0:隐藏,1:输入框,2:下拉框,3:文本框,4:日期选择框,5:时间选择框,6:表格,7:文件,8:按钮,9:密码,10:未分配,11:AutoComplete,12:静态文本,13:radio,14:checkbox,15:colorPicker,16:colorblock,17:dragRange,18:redioList,19:checkList,20:selectList **/
    public void setViewType(Integer viewType) {
        this.viewType = viewType;
    }

    /** 控件渲染样式 **/
    public String getIconClass() {
        return this.iconClass;
    }

    /** 控件渲染样式 **/
    public void setIconClass(String iconClass) {
        this.iconClass = iconClass;
    }

    /** 运行时库版本 **/
    public String getDescription() {
        return this.description;
    }

    /** 运行时库版本 **/
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

    /** 控件动作描述 **/
    public String getViewMetaData() {
        return this.viewMetaData;
    }

    /** 控件动作描述 **/
    public void setViewMetaData(String viewMetaData) {
        this.viewMetaData = viewMetaData;
    }

    public List<ConfigDefinitionField> getChildFieldList() {
        return childFieldList;
    }

    public void setChildFieldList(List<ConfigDefinitionField> childFieldList) {
        this.childFieldList = childFieldList;
    }
}

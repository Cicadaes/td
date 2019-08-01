package com.talkingdata.datacloud.entity.um;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>UM_RESOURCE ResourceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Resource extends BaseEntity {

    private Integer rid;
    private Integer appRid;
    private Integer resourceTypeRid;
    private Integer parentResourceRid;
    private String resourceCode;
    private String resourceName;
    private String resourceDesc;
    private Integer resourceOrder;
    private String resourceUri;
    private Integer isAction;
    private String action;
    private String extAttr1;
    private String extAttr2;
    private String extAttr3;
    private String extAttr4;
    private String extAttr5;
    private String extAttr6;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private String opUmid;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>rid -> rid</li>
     * <li>appRid -> app_rid</li>
     * <li>resourceTypeRid -> resource_type_rid</li>
     * <li>parentResourceRid -> parent_resource_rid</li>
     * <li>resourceCode -> resource_code</li>
     * <li>resourceName -> resource_name</li>
     * <li>resourceDesc -> resource_desc</li>
     * <li>resourceOrder -> resource_order</li>
     * <li>resourceUri -> resource_uri</li>
     * <li>isAction -> is_action</li>
     * <li>action -> action</li>
     * <li>extAttr1 -> ext_attr1</li>
     * <li>extAttr2 -> ext_attr2</li>
     * <li>extAttr3 -> ext_attr3</li>
     * <li>extAttr4 -> ext_attr4</li>
     * <li>extAttr5 -> ext_attr5</li>
     * <li>extAttr6 -> ext_attr6</li>
     * <li>createTime -> create_time</li>
     * <li>updateTime -> update_time</li>
     * <li>opUmid -> op_umid</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "rid": return "rid";
            case "appRid": return "app_rid";
            case "resourceTypeRid": return "resource_type_rid";
            case "parentResourceRid": return "parent_resource_rid";
            case "resourceCode": return "resource_code";
            case "resourceName": return "resource_name";
            case "resourceDesc": return "resource_desc";
            case "resourceOrder": return "resource_order";
            case "resourceUri": return "resource_uri";
            case "isAction": return "is_action";
            case "action": return "action";
            case "extAttr1": return "ext_attr1";
            case "extAttr2": return "ext_attr2";
            case "extAttr3": return "ext_attr3";
            case "extAttr4": return "ext_attr4";
            case "extAttr5": return "ext_attr5";
            case "extAttr6": return "ext_attr6";
            case "createTime": return "create_time";
            case "updateTime": return "update_time";
            case "opUmid": return "op_umid";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>rid -> rid</li>
     * <li>app_rid -> appRid</li>
     * <li>resource_type_rid -> resourceTypeRid</li>
     * <li>parent_resource_rid -> parentResourceRid</li>
     * <li>resource_code -> resourceCode</li>
     * <li>resource_name -> resourceName</li>
     * <li>resource_desc -> resourceDesc</li>
     * <li>resource_order -> resourceOrder</li>
     * <li>resource_uri -> resourceUri</li>
     * <li>is_action -> isAction</li>
     * <li>action -> action</li>
     * <li>ext_attr1 -> extAttr1</li>
     * <li>ext_attr2 -> extAttr2</li>
     * <li>ext_attr3 -> extAttr3</li>
     * <li>ext_attr4 -> extAttr4</li>
     * <li>ext_attr5 -> extAttr5</li>
     * <li>ext_attr6 -> extAttr6</li>
     * <li>create_time -> createTime</li>
     * <li>update_time -> updateTime</li>
     * <li>op_umid -> opUmid</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "rid": return "rid";
            case "app_rid": return "appRid";
            case "resource_type_rid": return "resourceTypeRid";
            case "parent_resource_rid": return "parentResourceRid";
            case "resource_code": return "resourceCode";
            case "resource_name": return "resourceName";
            case "resource_desc": return "resourceDesc";
            case "resource_order": return "resourceOrder";
            case "resource_uri": return "resourceUri";
            case "is_action": return "isAction";
            case "action": return "action";
            case "ext_attr1": return "extAttr1";
            case "ext_attr2": return "extAttr2";
            case "ext_attr3": return "extAttr3";
            case "ext_attr4": return "extAttr4";
            case "ext_attr5": return "extAttr5";
            case "ext_attr6": return "extAttr6";
            case "create_time": return "createTime";
            case "update_time": return "updateTime";
            case "op_umid": return "opUmid";
            default: return null;
        }
    }
    
    /** @view[title:唯一标识,filter:false,searchResult:true,form:false]
@comment[value:唯一标识] **/
    public Integer getRid() {
        return this.rid;
    }

    /** @view[title:唯一标识,filter:false,searchResult:true,form:false]
@comment[value:唯一标识] **/
    public void setRid(Integer rid) {
        this.rid = rid;
    }

    /** @view[title:应用系统记录ID,filter:true,searchResult:true,form:true]
@comment[value:应用系统记录ID] **/
    public Integer getAppRid() {
        return this.appRid;
    }

    /** @view[title:应用系统记录ID,filter:true,searchResult:true,form:true]
@comment[value:应用系统记录ID] **/
    public void setAppRid(Integer appRid) {
        this.appRid = appRid;
    }

    /** @view[title:资源类别记录ID,filter:true,searchResult:true,form:true]
@comment[value:资源类别记录ID] **/
    public Integer getResourceTypeRid() {
        return this.resourceTypeRid;
    }

    /** @view[title:资源类别记录ID,filter:true,searchResult:true,form:true]
@comment[value:资源类别记录ID] **/
    public void setResourceTypeRid(Integer resourceTypeRid) {
        this.resourceTypeRid = resourceTypeRid;
    }

    /** @view[title:上级资源记录id,filter:true,searchResult:true,form:true]
@comment[value:上级资源记录id] **/
    public Integer getParentResourceRid() {
        return this.parentResourceRid;
    }

    /** @view[title:上级资源记录id,filter:true,searchResult:true,form:true]
@comment[value:上级资源记录id] **/
    public void setParentResourceRid(Integer parentResourceRid) {
        this.parentResourceRid = parentResourceRid;
    }

    /** @view[title:资源代码，即业务ID,filter:true,searchResult:true,form:true]
@comment[value:资源代码，即业务ID] **/
    public String getResourceCode() {
        return this.resourceCode;
    }

    /** @view[title:资源代码，即业务ID,filter:true,searchResult:true,form:true]
@comment[value:资源代码，即业务ID] **/
    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    /** @view[title:资源名称,filter:true,searchResult:true,form:true]
@comment[value:资源名称] **/
    public String getResourceName() {
        return this.resourceName;
    }

    /** @view[title:资源名称,filter:true,searchResult:true,form:true]
@comment[value:资源名称] **/
    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    /** @view[title:描述,filter:true,searchResult:true,form:true]
@comment[value:描述] **/
    public String getResourceDesc() {
        return this.resourceDesc;
    }

    /** @view[title:描述,filter:true,searchResult:true,form:true]
@comment[value:描述] **/
    public void setResourceDesc(String resourceDesc) {
        this.resourceDesc = resourceDesc;
    }

    /** @view[title:资源序号，缺省为0,filter:true,searchResult:true,form:true]
@comment[value:资源序号，缺省为0] **/
    public Integer getResourceOrder() {
        return this.resourceOrder;
    }

    /** @view[title:资源序号，缺省为0,filter:true,searchResult:true,form:true]
@comment[value:资源序号，缺省为0] **/
    public void setResourceOrder(Integer resourceOrder) {
        this.resourceOrder = resourceOrder;
    }

    /** @view[title:资源地址,filter:true,searchResult:true,form:true]
@comment[value:资源地址，如url、action] **/
    public String getResourceUri() {
        return this.resourceUri;
    }

    /** @view[title:资源地址,filter:true,searchResult:true,form:true]
@comment[value:资源地址，如url、action] **/
    public void setResourceUri(String resourceUri) {
        this.resourceUri = resourceUri;
    }

    /** @view[title:是否上级资源的操作,filter:true,searchResult:true,form:true]
@comment[value:是否对上级资源的操作，缺省为0，代表为不是，为1时可表示页面里的新增、修改等操作] **/
    public Integer getIsAction() {
        return this.isAction;
    }

    /** @view[title:是否上级资源的操作,filter:true,searchResult:true,form:true]
@comment[value:是否对上级资源的操作，缺省为0，代表为不是，为1时可表示页面里的新增、修改等操作] **/
    public void setIsAction(Integer isAction) {
        this.isAction = isAction;
    }

    /** @view[title:具体操作,filter:true,searchResult:true,form:true]
@comment[value:具体操作，is_action为1时才可填入，应用系统自己定义] **/
    public String getAction() {
        return this.action;
    }

    /** @view[title:具体操作,filter:true,searchResult:true,form:true]
@comment[value:具体操作，is_action为1时才可填入，应用系统自己定义] **/
    public void setAction(String action) {
        this.action = action;
    }

    /** @view[title:扩展属性1,filter:true,searchResult:true,form:true] @comment[value:扩展属性1] **/
    public String getExtAttr1() {
        return this.extAttr1;
    }

    /** @view[title:扩展属性1,filter:true,searchResult:true,form:true] @comment[value:扩展属性1] **/
    public void setExtAttr1(String extAttr1) {
        this.extAttr1 = extAttr1;
    }

    /** @view[title:应用系统扩展属性2,filter:true,searchResult:true,form:true]
@comment[value:表示 dcds 系统 ua_ext_resource_type 表 resource_type_id] **/
    public String getExtAttr2() {
        return this.extAttr2;
    }

    /** @view[title:应用系统扩展属性2,filter:true,searchResult:true,form:true]
@comment[value:表示 dcds 系统 ua_ext_resource_type 表 resource_type_id] **/
    public void setExtAttr2(String extAttr2) {
        this.extAttr2 = extAttr2;
    }

    /** @view[title:应用系统扩展属性3,filter:true,searchResult:true,form:true]
@comment[value:应用系统扩展属性3] **/
    public String getExtAttr3() {
        return this.extAttr3;
    }

    /** @view[title:应用系统扩展属性3,filter:true,searchResult:true,form:true]
@comment[value:应用系统扩展属性3] **/
    public void setExtAttr3(String extAttr3) {
        this.extAttr3 = extAttr3;
    }

    /** @view[title:应用系统扩展属性4,filter:true,searchResult:true,form:true]
@comment[value:应用系统扩展属性4] **/
    public String getExtAttr4() {
        return this.extAttr4;
    }

    /** @view[title:应用系统扩展属性4,filter:true,searchResult:true,form:true]
@comment[value:应用系统扩展属性4] **/
    public void setExtAttr4(String extAttr4) {
        this.extAttr4 = extAttr4;
    }

    /** @view[title:应用系统扩展属性5,filter:true,searchResult:true,form:true]
@comment[value:应用系统扩展属性5] **/
    public String getExtAttr5() {
        return this.extAttr5;
    }

    /** @view[title:应用系统扩展属性5,filter:true,searchResult:true,form:true]
@comment[value:应用系统扩展属性5] **/
    public void setExtAttr5(String extAttr5) {
        this.extAttr5 = extAttr5;
    }

    /**  **/
    public String getExtAttr6() {
        return this.extAttr6;
    }

    /**  **/
    public void setExtAttr6(String extAttr6) {
        this.extAttr6 = extAttr6;
    }

    /** 0000-00-00 00:00:00'' COMMENT ''@view[title:创建时间,filter:true,searchResult:true,form:true,formatter:formatTimeStamp1]@comment[value:创建时间] **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 0000-00-00 00:00:00'' COMMENT ''@view[title:创建时间,filter:true,searchResult:true,form:true,formatter:formatTimeStamp1]@comment[value:创建时间] **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /** @view[title:修改时间,filter:true,searchResult:true,form:true,formatter:formatTimeStamp1]@comment[value:最后修改时间，取系统时间] **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** @view[title:修改时间,filter:true,searchResult:true,form:true,formatter:formatTimeStamp1]@comment[value:最后修改时间，取系统时间] **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /** @view[title:操作UMID,filter:true,searchResult:true,form:true] @comment[value:操作UMID] **/
    public String getOpUmid() {
        return this.opUmid;
    }

    /** @view[title:操作UMID,filter:true,searchResult:true,form:true] @comment[value:操作UMID] **/
    public void setOpUmid(String opUmid) {
        this.opUmid = opUmid;
    }

}

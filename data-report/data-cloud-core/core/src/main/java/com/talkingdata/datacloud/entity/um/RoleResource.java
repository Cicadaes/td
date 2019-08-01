package com.talkingdata.datacloud.entity.um;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>UM_ROLE_RESOURCE RoleResourceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class RoleResource extends BaseEntity {

    private Integer rid;
    private Integer roleRid;
    private Integer resourceRid;
    private String attr1;
    private String attr2;
    private String attr3;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String opUmid;
    private String resourceCode;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>rid -> rid</li>
     * <li>roleRid -> role_rid</li>
     * <li>resourceRid -> resource_rid</li>
     * <li>attr1 -> attr1</li>
     * <li>attr2 -> attr2</li>
     * <li>attr3 -> attr3</li>
     * <li>createTime -> create_time</li>
     * <li>opUmid -> op_umid</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "rid": return "rid";
            case "roleRid": return "role_rid";
            case "resourceRid": return "resource_rid";
            case "attr1": return "attr1";
            case "attr2": return "attr2";
            case "attr3": return "attr3";
            case "createTime": return "create_time";
            case "opUmid": return "op_umid";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>rid -> rid</li>
     * <li>role_rid -> roleRid</li>
     * <li>resource_rid -> resourceRid</li>
     * <li>attr1 -> attr1</li>
     * <li>attr2 -> attr2</li>
     * <li>attr3 -> attr3</li>
     * <li>create_time -> createTime</li>
     * <li>op_umid -> opUmid</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "rid": return "rid";
            case "role_rid": return "roleRid";
            case "resource_rid": return "resourceRid";
            case "attr1": return "attr1";
            case "attr2": return "attr2";
            case "attr3": return "attr3";
            case "create_time": return "createTime";
            case "op_umid": return "opUmid";
            default: return null;
        }
    }
    
    /** @view[title:唯一标识,filter:false,searchResult:false,form:false] @comment[value:唯一标识] **/
    public Integer getRid() {
        return this.rid;
    }

    /** @view[title:唯一标识,filter:false,searchResult:false,form:false] @comment[value:唯一标识] **/
    public void setRid(Integer rid) {
        this.rid = rid;
    }

    /** @view[title:角色记录ID,filter:true,searchResult:true,form:true] @comment[value:角色记录ID] **/
    public Integer getRoleRid() {
        return this.roleRid;
    }

    /** @view[title:角色记录ID,filter:true,searchResult:true,form:true] @comment[value:角色记录ID] **/
    public void setRoleRid(Integer roleRid) {
        this.roleRid = roleRid;
    }

    /** @view[title:资源记录ID,filter:true,searchResult:true,form:true] @comment[value:资源记录ID] **/
    public Integer getResourceRid() {
        return this.resourceRid;
    }

    /** @view[title:资源记录ID,filter:true,searchResult:true,form:true] @comment[value:资源记录ID] **/
    public void setResourceRid(Integer resourceRid) {
        this.resourceRid = resourceRid;
    }

    /** 扩展属性 **/
    public String getAttr1() {
        return this.attr1;
    }

    /** 扩展属性 **/
    public void setAttr1(String attr1) {
        this.attr1 = attr1;
    }

    /** 扩展属性 **/
    public String getAttr2() {
        return this.attr2;
    }

    /** 扩展属性 **/
    public void setAttr2(String attr2) {
        this.attr2 = attr2;
    }

    /** 扩展属性 **/
    public String getAttr3() {
        return this.attr3;
    }

    /** 扩展属性 **/
    public void setAttr3(String attr3) {
        this.attr3 = attr3;
    }

    /** @view[title:创建时间,filter:true,searchResult:true,form:true,formatter:formatTimeStamp1] @comment[value:创建时间] **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** @view[title:创建时间,filter:true,searchResult:true,form:true,formatter:formatTimeStamp1] @comment[value:创建时间] **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /** @view[title:操作UMID,filter:true,searchResult:true,form:true] @comment[value:操作UMID] **/
    public String getOpUmid() {
        return this.opUmid;
    }

    /** @view[title:操作UMID,filter:true,searchResult:true,form:true] @comment[value:操作UMID] **/
    public void setOpUmid(String opUmid) {
        this.opUmid = opUmid;
    }

    public String getResourceCode() {
        return resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }
}

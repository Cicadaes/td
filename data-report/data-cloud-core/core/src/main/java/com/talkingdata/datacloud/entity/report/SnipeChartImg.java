package com.talkingdata.datacloud.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_SNIPE_CHART_IMG SnipeChartImgEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SnipeChartImg extends BaseEntity {

    private Integer id;
    private String chartUuid;
    private Object img;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>chartUuid -> chart_uuid</li>
     * <li>img -> img</li>
     * <li>createTime -> create_time</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "chartUuid": return "chart_uuid";
            case "img": return "img";
            case "createTime": return "create_time";
            case "updateTime": return "update_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>chart_uuid -> chartUuid</li>
     * <li>img -> img</li>
     * <li>create_time -> createTime</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "chart_uuid": return "chartUuid";
            case "img": return "img";
            case "create_time": return "createTime";
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

    /** 图表缩略图 **/
    public Object getImg() {
        return this.img;
    }

    /** 图表缩略图 **/
    public void setImg(Object img) {
        this.img = img;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
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

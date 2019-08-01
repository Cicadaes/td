package com.talkingdata.marketing.core.entity.admin;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_SYS_JOB_CONFIG SysJobConfigEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-06-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SysJobConfig extends BaseEntity {

    private Integer id;
    private String name;
    private String className;
    private String intervall;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    private Integer repeatTime;
    private Integer executeTime;
    private Integer status;
    private String jkey;
    private String systemCode;
    private String triggerType;
    private String cronExpression;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>className -> class_name</li>
     * <li>intervall -> intervall</li>
     * <li>startTime -> start_time</li>
     * <li>endTime -> end_time</li>
     * <li>repeatTime -> repeat_time</li>
     * <li>executeTime -> execute_time</li>
     * <li>status -> status</li>
     * <li>jkey -> jkey</li>
     * <li>systemCode -> system_code</li>
     * <li>triggerType -> trigger_type</li>
     * <li>cronExpression -> cron_expression</li>
     * <li>updateTime -> update_time</li>
     * <li>createTime -> create_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "name": return "name";
            case "className": return "class_name";
            case "intervall": return "intervall";
            case "startTime": return "start_time";
            case "endTime": return "end_time";
            case "repeatTime": return "repeat_time";
            case "executeTime": return "execute_time";
            case "status": return "status";
            case "jkey": return "jkey";
            case "systemCode": return "system_code";
            case "triggerType": return "trigger_type";
            case "cronExpression": return "cron_expression";
            case "updateTime": return "update_time";
            case "createTime": return "create_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>class_name -> className</li>
     * <li>intervall -> intervall</li>
     * <li>start_time -> startTime</li>
     * <li>end_time -> endTime</li>
     * <li>repeat_time -> repeatTime</li>
     * <li>execute_time -> executeTime</li>
     * <li>status -> status</li>
     * <li>jkey -> jkey</li>
     * <li>system_code -> systemCode</li>
     * <li>trigger_type -> triggerType</li>
     * <li>cron_expression -> cronExpression</li>
     * <li>update_time -> updateTime</li>
     * <li>create_time -> createTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "name": return "name";
            case "class_name": return "className";
            case "intervall": return "intervall";
            case "start_time": return "startTime";
            case "end_time": return "endTime";
            case "repeat_time": return "repeatTime";
            case "execute_time": return "executeTime";
            case "status": return "status";
            case "jkey": return "jkey";
            case "system_code": return "systemCode";
            case "trigger_type": return "triggerType";
            case "cron_expression": return "cronExpression";
            case "update_time": return "updateTime";
            case "create_time": return "createTime";
            default: return null;
        }
    }
    
    /** 唯一标识 **/
    public Integer getId() {
        return this.id;
    }

    /** 唯一标识 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 任务名称 **/
    public String getName() {
        return this.name;
    }

    /** 任务名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 任务的实现类 **/
    public String getClassName() {
        return this.className;
    }

    /** 任务的实现类 **/
    public void setClassName(String className) {
        this.className = className;
    }

    /**  **/
    public String getIntervall() {
        return this.intervall;
    }

    /**  **/
    public void setIntervall(String intervall) {
        this.intervall = intervall;
    }

    /** 任务的起始时间，为null则立刻开始 **/
    public Date getStartTime() {
        return this.startTime;
    }

    /** 任务的起始时间，为null则立刻开始 **/
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /** 任务的终止时间，为null则永不终止 **/
    public Date getEndTime() {
        return this.endTime;
    }

    /** 任务的终止时间，为null则永不终止 **/
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    /** 任务的最大重复次数，非0则生效 **/
    public Integer getRepeatTime() {
        return this.repeatTime;
    }

    /** 任务的最大重复次数，非0则生效 **/
    public void setRepeatTime(Integer repeatTime) {
        this.repeatTime = repeatTime;
    }

    /** 任务的执行次数 **/
    public Integer getExecuteTime() {
        return this.executeTime;
    }

    /** 任务的执行次数 **/
    public void setExecuteTime(Integer executeTime) {
        this.executeTime = executeTime;
    }

    /** 状态，1，有效，0，无效 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态，1，有效，0，无效 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 任务的唯一英文代码 **/
    public String getJkey() {
        return this.jkey;
    }

    /** 任务的唯一英文代码 **/
    public void setJkey(String jkey) {
        this.jkey = jkey;
    }

    /** 所属子系统 **/
    public String getSystemCode() {
        return this.systemCode;
    }

    /** 所属子系统 **/
    public void setSystemCode(String systemCode) {
        this.systemCode = systemCode;
    }

    /** 定时任务触发类型，S:simpleTrigger，C：cronTrigger **/
    public String getTriggerType() {
        return this.triggerType;
    }

    /** 定时任务触发类型，S:simpleTrigger，C：cronTrigger **/
    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    /** cron表达式 **/
    public String getCronExpression() {
        return this.cronExpression;
    }

    /** cron表达式 **/
    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /** 修改时间，默认数据库当前时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 修改时间，默认数据库当前时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

}

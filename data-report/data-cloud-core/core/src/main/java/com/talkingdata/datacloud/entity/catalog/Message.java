package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;
import java.util.List;

/**
 * <b>功能：</b>message MessageEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Message extends BaseEntity {

    private Integer id;
    private Integer entityType;
    private Integer entityId;
    private Integer messageType;
    private String messageInfo;
    private Integer status;
    private String receiver;
    private String handler;
    private String sender;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createdTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date modifiedTime;
    private String updater;
    private String entityName;
    private List<Integer> idList;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>entityType -> entity_type</li>
     * <li>entityId -> entity_id</li>
     * <li>messageType -> message_type</li>
     * <li>messageInfo -> message_info</li>
     * <li>status -> status</li>
     * <li>receiver -> receiver</li>
     * <li>handler -> handler</li>
     * <li>sender -> sender</li>
     * <li>createdTime -> created_time</li>
     * <li>modifiedTime -> modified_time</li>
     * <li>updater -> updater</li>
     * <li>entityName -> entity_name</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "entityType": return "entity_type";
            case "entityId": return "entity_id";
            case "messageType": return "message_type";
            case "messageInfo": return "message_info";
            case "status": return "status";
            case "receiver": return "receiver";
            case "handler": return "handler";
            case "sender": return "sender";
            case "createdTime": return "created_time";
            case "modifiedTime": return "modified_time";
            case "updater": return "updater";
            case "entityName": return "entity_name";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>entity_type -> entityType</li>
     * <li>entity_id -> entityId</li>
     * <li>message_type -> messageType</li>
     * <li>message_info -> messageInfo</li>
     * <li>status -> status</li>
     * <li>receiver -> receiver</li>
     * <li>handler -> handler</li>
     * <li>sender -> sender</li>
     * <li>created_time -> createdTime</li>
     * <li>modified_time -> modifiedTime</li>
     * <li>updater -> updater</li>
     * <li>entity_name -> entityName</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "entity_type": return "entityType";
            case "entity_id": return "entityId";
            case "message_type": return "messageType";
            case "message_info": return "messageInfo";
            case "status": return "status";
            case "receiver": return "receiver";
            case "handler": return "handler";
            case "sender": return "sender";
            case "created_time": return "createdTime";
            case "modified_time": return "modifiedTime";
            case "updater": return "updater";
            case "entity_name": return "entityName";
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

    /** 1.dataset 2.project 3.pipeline **/
    public Integer getEntityType() {
        return this.entityType;
    }

    /** 1.dataset 2.project 3.pipeline **/
    public void setEntityType(Integer entityType) {
        this.entityType = entityType;
    }

    /** 具体实体的id **/
    public Integer getEntityId() {
        return this.entityId;
    }

    /** 具体实体的id **/
    public void setEntityId(Integer entityId) {
        this.entityId = entityId;
    }

    /** 消息类型: 1 扫描到新的数据集需要进行分区定义。2 检测到CSV数据集需要调整元数据。3 扫描到数据集中不同文件元数据不一致情况。4 扫描到数据集不可用，文件不存在。 **/
    public Integer getMessageType() {
        return this.messageType;
    }

    /** 消息类型: 1 扫描到新的数据集需要进行分区定义。2 检测到CSV数据集需要调整元数据。3 扫描到数据集中不同文件元数据不一致情况。4 扫描到数据集不可用，文件不存在。 **/
    public void setMessageType(Integer messageType) {
        this.messageType = messageType;
    }

    /** 消息信息 **/
    public String getMessageInfo() {
        return this.messageInfo;
    }

    /** 消息信息 **/
    public void setMessageInfo(String messageInfo) {
        this.messageInfo = messageInfo;
    }

    /** 状态:1 已读 2 未读 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态:1 已读 2 未读 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 接收人 **/
    public String getReceiver() {
        return this.receiver;
    }

    /** 接收人 **/
    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    /** 处理人 **/
    public String getHandler() {
        return this.handler;
    }

    /** 处理人 **/
    public void setHandler(String handler) {
        this.handler = handler;
    }

    /** 发送人 **/
    public String getSender() {
        return this.sender;
    }

    /** 发送人 **/
    public void setSender(String sender) {
        this.sender = sender;
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

    /** 具体实体的名字 **/
    public String getEntityName() {
        return this.entityName;
    }

    /** 具体实体的名字 **/
    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public List<Integer> getIdList() {
        return idList;
    }

    public void setIdList(List<Integer> idList) {
        this.idList = idList;
    }
}

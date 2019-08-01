package com.talkingdata.marketing.core.page.campaign.extend;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * The type Crowd creation page.
 * @author xiaoming.kang
 */
public class CrowdCreationPage {
    private Integer refId;
    /**
     * 1 LookLike 2 scene  3 Accurate history 4 id file
     */
    private Integer crowdType;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8" )
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date endTime;
    private String refCode;
    private Integer source;
    private Integer fileId;
    private String fileName;
    private String description;
    private String crowdName;
    private String campaignId;
    private String uploadUUID;

    /**
     * Gets ref id.
     *
     * @return the ref id
     */
    public Integer getRefId() {
        return refId;
    }

    /**
     * Sets ref id.
     *
     * @param refId the ref id
     */
    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    /**
     * Gets crowd type.
     *
     * @return the crowd type
     */
    public Integer getCrowdType() {
        return crowdType;
    }

    /**
     * Sets crowd type.
     *
     * @param crowdType the crowd type
     */
    public void setCrowdType(Integer crowdType) {
        this.crowdType = crowdType;
    }

    /**
     * Gets ref code.
     *
     * @return the ref code
     */
    public String getRefCode() {
        return refCode;
    }

    /**
     * Sets ref code.
     *
     * @param refCode the ref code
     */
    public void setRefCode(String refCode) {
        this.refCode = refCode;
    }

    /**
     * Gets source.
     *
     * @return the source
     */
    public Integer getSource() {
        return source;
    }

    /**
     * Sets source.
     *
     * @param source the source
     */
    public void setSource(Integer source) {
        this.source = source;
    }

    /**
     * Gets file id.
     *
     * @return the file id
     */
    public Integer getFileId() {
        return fileId;
    }

    /**
     * Sets file id.
     *
     * @param fileId the file id
     */
    public void setFileId(Integer fileId) {
        this.fileId = fileId;
    }

    /**
     * Gets file name.
     *
     * @return the file name
     */
    public String getFileName() {
        return fileName;
    }

    /**
     * Sets file name.
     *
     * @param fileName the file name
     */
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    /**
     * Gets start time.
     *
     * @return the start time
     */
    public Date getStartTime() {
        return startTime;
    }

    /**
     * Sets start time.
     *
     * @param startTime the start time
     */
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /**
     * Gets end time.
     *
     * @return the end time
     */
    public Date getEndTime() {
        return endTime;
    }

    /**
     * Sets end time.
     *
     * @param endTime the end time
     */
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    /**
     * Gets description.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets description.
     *
     * @param description the description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets crowd name.
     *
     * @return the crowd name
     */
    public String getCrowdName() {
        return crowdName;
    }

    /**
     * Sets crowd name.
     *
     * @param crowdName the crowd name
     */
    public void setCrowdName(String crowdName) {
        this.crowdName = crowdName;
    }

    /**
     * Gets campaign id.
     *
     * @return the campaign id
     */
    public String getCampaignId() {
        return campaignId;
    }

    /**
     * Sets campaign id.
     *
     * @param campaignId the campaign id
     */
    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    /**
     * Gets upload uuid.
     *
     * @return the upload uuid
     */
    public String getUploadUUID() {
        return uploadUUID;
    }

    /**
     * Sets upload uuid.
     *
     * @param uploadUUID the upload uuid
     */
    public void setUploadUUID(String uploadUUID) {
        this.uploadUUID = uploadUUID;
    }
}

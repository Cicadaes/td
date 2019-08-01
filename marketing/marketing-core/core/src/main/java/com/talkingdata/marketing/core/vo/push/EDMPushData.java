package com.talkingdata.marketing.core.vo.push;


/**
 *
 * @author armeng
 * @date 2018/01/03
 */
public class EDMPushData extends AbstractPushData{

    /**
     * 邮件标题
     */
    private String title;

    /**
     * 发件人名称
     */
    private String fromName;

    /**
     * 发件人地址
     */
    private String fromAddress;

    /**
     * 回复人名称
     */

    private String replyName;

    /**
     * 回复人地址
     */

    private String replyAddress;

    /**
     * EDM邮件模板路径
     * // TODO armeng 可以删除
     */
    private String edmFilePath;

    /**
     * 邮件模板名称
     */
    private String fileName;

    private String contentType;

    private String importUrl;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFromName() {
        return fromName;
    }

    public void setFromName(String fromName) {
        this.fromName = fromName;
    }

    public String getFromAddress() {
        return fromAddress;
    }

    public void setFromAddress(String fromAddress) {
        this.fromAddress = fromAddress;
    }

    public String getReplyName() {
        return replyName;
    }

    public void setReplyName(String replyName) {
        this.replyName = replyName;
    }

    public String getReplyAddress() {
        return replyAddress;
    }

    public void setReplyAddress(String replyAddress) {
        this.replyAddress = replyAddress;
    }

    public String getEdmFilePath() {
        return edmFilePath;
    }

    public void setEdmFilePath(String edmFilePath) {
        this.edmFilePath = edmFilePath;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getImportUrl() {
        return importUrl;
    }

    public void setImportUrl(String importUrl) {
        this.importUrl = importUrl;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}

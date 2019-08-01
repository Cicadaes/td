package td.enterprise.page;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>接受配置 ReceiveConfigPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-30 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ReceiveConfigPage extends BasePage {

    private Integer id;
    private String uniqueId;
    private String urls;
    private Integer receiveMode;
    private Integer receiveInterval;
    private Integer retryTimes;
    private Integer retryInterval;
    private Integer timeUnit;
    private Integer filterMac;
    private Integer filterSignal;
    private Integer status;
    private Integer alarmThreshold;
    private Integer localThreshold;
    private Integer messageNumber;
    private String kafkaTopic;
    private String sftpPwd;
    private Integer isTenant;
    @ApiModelProperty(hidden = true)
    private String createBy;
    @ApiModelProperty(hidden = true)
    private String creator;
    @ApiModelProperty(hidden = true)
    private Date createTime;
    @ApiModelProperty(hidden = true)
    private String updateBy;
    @ApiModelProperty(hidden = true)
    private String updater;
    @ApiModelProperty(hidden = true)
    private Date updateTime;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUniqueId() {
        return this.uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getUrls() {
        return this.urls;
    }

    public void setUrls(String urls) {
        this.urls = urls;
    }

    public Integer getReceiveMode() {
        return this.receiveMode;
    }

    public void setReceiveMode(Integer receiveMode) {
        this.receiveMode = receiveMode;
    }

    public Integer getReceiveInterval() {
        return this.receiveInterval;
    }

    public void setReceiveInterval(Integer receiveInterval) {
        this.receiveInterval = receiveInterval;
    }

    public Integer getRetryTimes() {
        return this.retryTimes;
    }

    public void setRetryTimes(Integer retryTimes) {
        this.retryTimes = retryTimes;
    }

    public Integer getRetryInterval() {
        return this.retryInterval;
    }

    public void setRetryInterval(Integer retryInterval) {
        this.retryInterval = retryInterval;
    }

    public Integer getTimeUnit() {
        return this.timeUnit;
    }

    public void setTimeUnit(Integer timeUnit) {
        this.timeUnit = timeUnit;
    }

    public Integer getFilterMac() {
        return this.filterMac;
    }

    public void setFilterMac(Integer filterMac) {
        this.filterMac = filterMac;
    }

    public Integer getFilterSignal() {
        return this.filterSignal;
    }

    public void setFilterSignal(Integer filterSignal) {
        this.filterSignal = filterSignal;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getAlarmThreshold() {
        return this.alarmThreshold;
    }

    public void setAlarmThreshold(Integer alarmThreshold) {
        this.alarmThreshold = alarmThreshold;
    }

    public Integer getLocalThreshold() {
        return this.localThreshold;
    }

    public void setLocalThreshold(Integer localThreshold) {
        this.localThreshold = localThreshold;
    }

    public Integer getMessageNumber() {
        return this.messageNumber;
    }

    public void setMessageNumber(Integer messageNumber) {
        this.messageNumber = messageNumber;
    }

    public String getKafkaTopic() {
        return this.kafkaTopic;
    }

    public void setKafkaTopic(String kafkaTopic) {
        this.kafkaTopic = kafkaTopic;
    }

    public String getSftpPwd() {
        return this.sftpPwd;
    }

    public void setSftpPwd(String sftpPwd) {
        this.sftpPwd = sftpPwd;
    }

    public Integer getIsTenant() {
        return this.isTenant;
    }

    public void setIsTenant(Integer isTenant) {
        this.isTenant = isTenant;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getUpdater() {
        return this.updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}

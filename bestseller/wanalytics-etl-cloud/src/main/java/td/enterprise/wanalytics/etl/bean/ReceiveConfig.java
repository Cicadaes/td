package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.BaseEntity;

/**
 * <br>
 * <b>功能：</b>接受配置 ReceiveConfigEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-30 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ReceiveConfig extends BaseEntity {

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
    private Long alarmThreshold;
    private Long localThreshold;
    private Long messageNumber;
    private String kafkaTopic;
    private String sftpPwd;
    private Integer isTenant;

    private String label;
    private String url;

    public boolean compareTo(ReceiveConfig receiveConfig) {
        boolean flag = false;
        if (id.equals(receiveConfig.getId())
                && uniqueId.equals(receiveConfig.getUniqueId())
                && urls.equals(receiveConfig.getUrls())
                && receiveMode.equals(receiveConfig.getReceiveMode())
                && receiveInterval.equals(receiveConfig.getReceiveInterval())
                && retryTimes.equals(receiveConfig.getRetryTimes())
                && retryInterval.equals(receiveConfig.getRetryInterval())
                && ((timeUnit == null && receiveConfig.getTimeUnit() == null) || (timeUnit != null && timeUnit.equals(receiveConfig.getTimeUnit())))
                && filterMac.equals(receiveConfig.getFilterMac())
                && filterSignal.equals(receiveConfig.getFilterSignal())
                && status.equals(receiveConfig.getStatus())
                && alarmThreshold.equals(receiveConfig.getAlarmThreshold())
                && localThreshold.equals(receiveConfig.getLocalThreshold())
                && messageNumber.equals(receiveConfig.getMessageNumber())
                && kafkaTopic.equals(receiveConfig.getKafkaTopic())
                && sftpPwd.equals(receiveConfig.getSftpPwd())
                && url.equals(receiveConfig.getUrl())
                ) {
            flag = true;
        }
        return flag;
    }
}


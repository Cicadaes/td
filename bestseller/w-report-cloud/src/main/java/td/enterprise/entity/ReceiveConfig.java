package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    private Integer alarmThreshold;
    private Integer localThreshold;
    private Integer messageNumber;
    private String kafkaTopic;
    private String sftpPwd;
    private Integer isTenant;

}


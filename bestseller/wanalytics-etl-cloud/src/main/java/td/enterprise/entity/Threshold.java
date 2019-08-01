package td.enterprise.entity;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>阈值表 ThresholdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class Threshold extends BaseEntity {

    private Integer   id;
    private Integer   projectId;
    private Integer   crowdCome;             //入店客流时间阈值
    private Integer   crowdBounce;           //跳出客流时间阈值
    private Integer   crowdStay;
    private Integer   crowdActiveHighBegin;
    private Integer   crowdActiveHighEnd;
    private Integer   crowdActiveMediumBegin;
    private Integer   crowdActiveMediumEnd;
    private Integer   crowdActiveLowBegin;
    private Integer   crowdActiveLowEnd;
    private Integer   crowdSleep;
    private Integer   strengthCrowdBefore;
    private Integer   strengthCrowdCome;
    private Integer   frequencyIntervalTime;
    private Integer   salesConsecutiveDay;
    private Integer   salesComeDay;
    private Integer   salesStayTime;
    private Integer   blackConsecutiveDay;
    private Integer   blackComeDay;
    private Integer   blackStayTime;

    //创建人账号
    private String    createBy;

    //创建人
    private String    creator;

    //修改人账号
    private String    updateBy;

    //修改人
    private String    updater;

    //创建时间
    private Timestamp createTime;

    //修改时间
    private Timestamp updateTime;

}

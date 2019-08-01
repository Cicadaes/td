package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>绫致店铺设备关系 BsAuthHistoryEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BsAuthHistory extends BaseEntity {
	
	private Integer id;
	private String apGroupId;
	private String apMac;
	private String upstream;
	private String downstream;
	private String userGroup;
	private String shopId;
	private Integer userType;
	private String accessStartTime;
	private String accessDuration;
	private String accessAcIp;
	private String userMac;
	private String userIp;
	private String vendor;
	private String terminalModel;
	private String accessDurationSum;
	private Integer loginFreqSum;
	private String upstreamSum;
	private String downstreamSum;
	private String offlineType;
	private String mobileNo;
	private String userName;
	private String appAuthId;
	private String appAccount;
	private String preliminary;
	private String openId;
	private String nickname;
	private Integer sex;
	private String province;
	private String city;
	private String country;
	private String headimgurl;
	private String unionid;
	private String tid;
	private String appId;
	private String mobileDecode;
	private Date createTime;
	private Date updateTime;
	private String runDate;

}


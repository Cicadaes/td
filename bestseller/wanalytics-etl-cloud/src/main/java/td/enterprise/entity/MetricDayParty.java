package td.enterprise.entity;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>一方数据日指标 MetricDayPartyEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-08 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricDayParty {
	
	private Integer id;
	private String brand;
	private String region;
	private String city;
	private String province;
	private String channel;
	private String mall;
	private String projectName;
	private Boolean projectType;
	private Integer projectId;
	private String date;
	private String weekOfYear;
	private String month;
	private BigDecimal salesAmount;
	private Integer orderCount;
	private BigDecimal orderAveragePrice;
	private Integer singularCount;
	private Integer memberCount;
	private Integer potentialCount;
	private Date updateTime;

}


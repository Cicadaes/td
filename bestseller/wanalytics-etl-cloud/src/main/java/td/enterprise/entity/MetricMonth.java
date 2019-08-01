package td.enterprise.entity;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>TD_METRIC_MONTH MetricMonthEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-12-21 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricMonth extends BaseEntity {
	
	private Integer id;
	private String brand;
	private String region;
	private String city;
	private String province;
	private String channel;
	private String mall;
	private String projectName;
	private String year;
	private String month;
	private String projectNum;
	private String logicalCity;
	private String tenantId;
	private String cCityCnName;
	private int projectType;
	private int projectId;
	private int activeNewUsers;
	private int activeOldUsers;
	private int activeUsers;
	private int stayNewUsers;
	private int stayOldUsers;
	private int stayUsers;
	private int frontUsers;
	private int jumpUsers;
	private int highActiveUsers;
	private int middleActiveUsers;
	private int lowActiveUsers;
	private int sleepActiveUsers;
	private int highStayUsers;
	private int middleStayUsers;
	private int lowStayUsers;
	private int sleepStayUsers;
	private int activeDuration;
	private int stayTimes;
	private int interval2;
	private int interval5;
	private int interval10;
	private int interval15;
	private double salesAmount;
	private int orderCount;
	private int memberCount;
	private int potentialCount;
	private Date updateTime;
	private int cityLevel;
	private int newActiveDuration;
	private int newActiveTime;
	private int orderCountGt1;
	private int vipOrderCount;
	private int vipOrderCountGt1;
	private int nonVipOrderCount;
	private int nonVipOrderCountGt1;
	private long activeTimes;
	private long stayDuration;
	private long oldActiveDuration;
	private long oldActiveTime;
	private long visitCycle;
	private double averageOrderNums;
	private double nonVipSalesCount;
	private double salesCount;
	private double vipSalesAmount;
	private double vipSalesCount;
	private double nonVipSalesAmount;

}


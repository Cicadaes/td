package td.enterprise.entity;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>TD_METRIC_WEEK MetricWeekEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-12-21 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricWeek extends BaseEntity {
	
	private Integer id;
	private String brand;
	private String region;
	private String city;
	private String province;
	private String channel;
	private String mall;
	private String projectName;
	private int projectType;
	private int projectId;
	private String year;
	private String weekOfYear;
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
	private int activeTimes;
	private int stayDuration;
	private int stayTimes;
	private int interval2;
	private int interval5;
	private int interval10;
	private int interval15;
	private int visitCycle;
	private double salesAmount;
	private int orderCount;
	private int memberCount;
	private int potentialCount;
	private Date updateTime;
	private double averageOrderNums;
	private Boolean cityLevel;
	private String projectNum;
	private int newActiveDuration;
	private int newActiveTime;
	private int oldActiveDuration;
	private int oldActiveTime;
	private String logicalCity;
	private String tenantId;
	private double salesCount;
	private int orderCountGt1;
	private double vipSalesAmount;
	private int vipOrderCount;
	private double vipSalesCount;
	private int vipOrderCountGt1;
	private double nonVipSalesAmount;
	private int nonVipOrderCount;
	private double nonVipSalesCount;
	private int nonVipOrderCountGt1;
	private String cCityCnName;

}


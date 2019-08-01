package td.enterprise.entity;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>metric MetricDayEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-09 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricDay extends BaseEntity {

	private static final long serialVersionUID = -8375904776393308680L;
	
	private Integer id;
	private String brand;
	private String region;
	private String city;
	private String province;
	private String channel;
	private String mall;
	private String projectName;
	private String projectNum;
	private String logicalCity;
	private String tenantId;
	private String date;
	private String weekOfYear;
	private String month;
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
	private int newActiveDuration;
	private int newActiveTime;
	private int vipOrderCount;
	private int vipOrderCountGt1;
	private int nonVipOrderCount;
	private int nonVipOrderCountGt1;
	private int orderCountGt1;
	private int cityLevel;
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
	private Date updateTime;
	
}

package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Long;
import java.lang.String;


/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricMonthEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-09 <br>
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
	private Integer projectType;
	private Integer projectId;
	private String year;
	private String month;
	private Long activeNewUsers;
	private Long activeOldUsers;
	private Long activeUsers;
	private Long stayNewUsers;
	private Long stayOldUsers;
	private Long stayUsers;
	private Long frontUsers;
	private Long jumpUsers;
	private Long highActiveUsers;
	private Long middleActiveUsers;
	private Long lowActiveUsers;
	private Long sleepActiveUsers;
	private Long highStayUsers;
	private Long middleStayUsers;
	private Long lowStayUsers;
	private Long sleepStayUsers;
	private Long activeDuration;
	private Long activeTimes;
	private Long stayDuration;
	private Long stayTimes;
	private Long interval2;
	private Long interval5;
	private Long interval10;
	private Long interval15;
	private Long interval30;
	private Long visitCycle;
	private Double salesAmount;
	private Long orderCount;
	private Long memberCount;
	private Long potentialCount;
	private Double averageOrderNums;
	private Long cityLevel;
	private String projectNum;
	private Long newActiveDuration;
	private Long newActiveTime;
	private Long oldActiveDuration;
	private Long oldActiveTime;
	private String logicalCity;
	private String tenantId;
	private Double salesCount;
	private Long orderCountGt1;
	private Double vipSalesAmount;
	private Long vipOrderCount;
	private Double vipSalesCount;
	private Long vipOrderCountGt1;
	private Double nonVipSalesAmount;
	private Long nonVipOrderCount;
	private Double nonVipSalesCount;
	private Long nonVipOrderCountGt1;

}


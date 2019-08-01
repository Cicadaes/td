package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.page.BasePage;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>排行榜表 MetricDayPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-22 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricDayPage extends BasePage {
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
	private String date;
	private String weekOfYear;
	private String month;
	private String year;
	private Integer activeNewUsers;
	private Integer activeOldUsers;
	private Integer activeUsers;
	private Integer stayNewUsers;
	private Integer stayOldUsers;
	private Integer stayUsers;
	private Integer frontUsers;
	private Integer jumpUsers;
	private Integer highActiveUsers;
	private Integer middleActiveUsers;
	private Integer lowActiveUsers;
	private Integer sleepActiveUsers;
	private Integer highStayUsers;
	private Integer middleStayUsers;
	private Integer lowStayUsers;
	private Integer sleepStayUsers;
	private Integer activeDuration;
	private Integer activeTimes;
	private Integer stayDuration;
	private Integer stayTimes;
	private Integer interval2;
	private Integer interval5;
	private Integer interval10;
	private Integer interval15;
	private Integer interval30;
	private Integer visitCycle;
	private Double  salesAmount;
	private Integer orderCount;
	private Integer memberCount;
	private Integer potentialCount;
	private Double averageOrderNums;
	private Integer cityLevel;
	private String projectNum;
	private Integer newActiveDuration;
	private Integer newActiveTime;
	private Integer oldActiveDuration;
	private Integer oldActiveTime;
	private String logicalCity;
	private Double salesCount;
	private Integer orderCountGt1;
	private Double vipSalesAmount;
	private Integer vipOrderCount;
	private Double vipSalesCount;
	private Integer vipOrderCountGt1;
	private Double nonVipSalesAmount;
	private Integer nonVipOrderCount;
	private Double nonVipSalesCount;
	private Integer nonVipOrderCountGt1;

	private Timestamp updateTime;

	//开始日期（闭区间）
	private String startDate;
	//结束如期（开区间）
	private String endDate;

	private String umid;

	private String tenantId;

	// 是否只是查询收藏夹的内容，如果是1， 如果是全部查询 则为0
	private int joinFlag;
	private int rangeQueryFlag;// 0 是天查询，1 是周查询，2 是月查询
	private List<Integer> list = new ArrayList();


	private List<String> cityCnNameList = new ArrayList();

}

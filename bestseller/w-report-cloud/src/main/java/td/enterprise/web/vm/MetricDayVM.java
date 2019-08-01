package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.BaseEntity;

/**
 * <br>
 * <b>功能：</b>排行榜表 MetricDayEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-22 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricDayVM extends BaseEntity {

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
    private Long visitCycle;
    private Double salesAmount;
    private Long orderCount;
    private Double orderAveragePrice;
    private Long memberCount;
    private Long potentialCount;

    private Double singularPrice;

    private Double memberSinglePrice;
    private Double nonMemberSinglePrice;
    private Double averageOrderNums;
    private Long cityLevel;
    private String projectNum;
    private Double memberOrderAveragePrice;
    private Double nonMemberOrderAveragePrice;
    private String relationOrderRate;
    private String memberRelationOrderRate;
    private String nonMemberRelationOrderRate;
    private Long newActiveDuration;
    private Long newActiveTime;
    private Long oldActiveDuration;
    private Long oldActiveTime;
    private String logicalCity;
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

    //    新客占比
    private Double activeUserNewRate;
    //    老客占必
    private Double activeUserOldRate;

    //    高活跃客占比
    private Double highRate;
    //    中活跃客人占比
    private Double middleRate;
    //    低活跃客人占比
    private Double lowRate;
    //    沉睡客人占比
    private Double sleepRate;

    //    入店率
    private Double enterRate;
    //    停留率
    private Double stayRate;
    //    跳出率
    private Double jumpRate;

    //  次均停留时长
    private Double stayDurationPerTime;

//    额外加的一些环比值
    private Double frontUsersChainRate =0.0;
    private Double activeUsersChainRate =0.0;
    private Double stayUsersChainRate =0.0;
    private Double jumpUsersChainRate =0.0;
    private Double memberCountChainRate =0.0;
    private Double potentialCountChainRate =0.0;

    private Double activeUserNewRateChainRate =0.0;
    private Double activeUserOldRateChainRate =0.0;
    private Double highRateChainRate =0.0;
    private Double middleRateChainRate =0.0;
    private Double lowRateChainRate =0.0;
    private Double sleepRateChainRate =0.0;

    private Double stayDurationPerTimeChainRate =0.0;
    private Double enterRateChainRate =0.0;
    private Double stayRateChainRate =0.0;
    private Double jumpRateChainRate =0.0;

    private Double salesAmountChainRate =0.0;
    private Double orderCountChainRate =0.0;
    private Double orderAveragePriceChainRate =0.0;
    private Double singularPriceChainRate =0.0;

    private String  frontUsersChainRateFlag ="UP";
    private String activeUsersChainRateFlag ="UP";
    private String stayUsersChainRateFlag ="UP";
    private String jumpUsersChainRateFlag ="UP";
    private String memberCountChainRateFlag ="UP";
    private String potentialCountChainRateFlag ="UP";

    private String activeUserNewRateChainRateFlag ="UP";
    private String activeUserOldRateChainRateFlag ="UP";
    private String highRateChainRateFlag ="UP";
    private String middleRateChainRateFlag ="UP";
    private String lowRateChainRateFlag ="UP";
    private String sleepRateChainRateFlag ="UP";

    private String stayDurationPerTimeChainRateFlag ="UP";
    private String enterRateChainRateFlag ="UP";
    private String stayRateChainRateFlag ="UP";
    private String jumpRateChainRateFlag ="UP";

    private String salesAmountChainRateFlag ="UP";
    private String orderCountChainRateFlag ="UP";
    private String orderAveragePriceChainRateFlag ="UP";
    private String singularPriceChainRateFlag ="UP";

    private int favorite;
    private String tenantId;

}


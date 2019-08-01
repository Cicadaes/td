package td.enterprise.wanalytics.etl.task.party;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.entity.BsShopSales;
import td.enterprise.entity.Project;
import td.enterprise.service.BsShopSalseService;
import td.enterprise.service.MetricDayService;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.task.group.AggregationDataByDayTask;
import td.enterprise.wanalytics.etl.task.lz.MetricMonthAndWeekTask;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.JsonUtils;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

/**
 * @author kayc
 */
@Slf4j
public class PartyDayTask {
    private static SqlSession sqlSession;
    private static String     calDate;

    static {
        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();
    }

    /**
     * 按照与绫致约定，每个目录存放30天销售数据，有些有变化，有些可能没有变化
     * 为了防止重复计算, 每次会把30天数据与TD_METRIC_DAY数据进行比较.
     */
	public static void execute(String date, int days) {
		log.info("Entering to execute. date:{}, days:{}", date, days);
		int result = days-1;
		while (result >= 0) {
			calDate = addDay(-result, date);
			List<BsShopSales> bsShopSalesList = BsShopSalseService.queryBySyncDate(sqlSession, calDate);
			log.info("{} BsShopSales data size: {}", calDate, bsShopSalesList.size());

			if (bsShopSalesList.size() > 500) {
				List<BsShopSales> filterBsShopSalesList = filterShopCodeWithoutProjectId(bsShopSalesList);
				log.info("filtered {} BsShopSales data size: {}", calDate, filterBsShopSalesList.size());
				
				// 把删除的，变化的，新增的销售数据更新到TD_METRIC_DAY
				Set<String> changedDateSet = findChangedAndUpdate(filterBsShopSalesList);
				
				// 对变化的数据进行汇合计算
				log.info("changedDateSet size: {}, {}", changedDateSet.size(), JsonUtils.toJsonString(changedDateSet));
				aggregateAndCalcMetric(changedDateSet);

			} else {
				log.warn("{} BsShopSales size is too small, ignore it, {}", calDate, bsShopSalesList.size());
			}
			result--;
		}
		close();
		log.info("Leaving execute of {}", date);
	}

	/**
	 * 过滤掉没有project_id的一方销售数据
	 */
	private static List<BsShopSales> filterShopCodeWithoutProjectId(List<BsShopSales> list) {
		List<Project> projectList = ProjectService.findProjectsByType(sqlSession, Collections.singletonList(1));
		Map<String, Integer> projectIdsByType = new HashMap<String, Integer>();
		for (Project project : projectList) {
			if (StringUtils.isNotBlank(project.getProjectNum())) {
				projectIdsByType.put(project.getProjectNum().toUpperCase(), project.getId());
			}
		}
		List<BsShopSales> filterList = new ArrayList<>();
		for (BsShopSales shopSales : list) {
			if (projectIdsByType.containsKey(shopSales.getShopCode().toUpperCase())) {
				shopSales.setProjectId(projectIdsByType.get(shopSales.getShopCode().toUpperCase()));
				filterList.add(shopSales);
			} else {
				log.debug("DateId: {} shopCode: {} has no projectId", shopSales.getDateId(), shopSales.getShopCode());
			}
		}
		return filterList;
	}
    
	// 处理删除的和变化的销售数据
	private static Set<String> findChangedAndUpdate(List<BsShopSales> filterBsShopSalesList) {
		// *** 一方销售数据(BS_SHOP_SALES) ***
		// 日期集合
		Set<String> bsShopSalesDateSet = createDateSet(filterBsShopSalesList);
		// 日期 + projectId 集合
		Set<String> bsShopSalesDateIdSet = createDateProjectIdSet(filterBsShopSalesList);
		// 日期 + projectId + 销售金额 集合
		Set<String> bsShopSalesDateIdAmountSet = createDateIdAmountSet(filterBsShopSalesList);
		
		// *** 客缘销售数据(TD_METRIC_DAY) ***
		
		List<String> bsShopSalesDateList = new ArrayList<>(bsShopSalesDateSet);
		log.info("新一方销售数据 size: {}, {}", bsShopSalesDateList.size(), JsonUtils.toJsonString(bsShopSalesDateList));
		
		// 查询TD_METRIC_DAY 中店铺有销售额的数据
		List<BsShopSales> tdMetricDayShopSalesList = MetricDayService.listShopSalesByDateList(sqlSession,
				bsShopSalesDateList);
		
		// 日期 + projectId 集合
		Set<String> tdMetricDayDateIdSet = createDateProjectIdSet(tdMetricDayShopSalesList);
		// 日期 + projectId + 销售金额 集合
		Set<String> tdMetricDayDateIdAmountSet = createDateIdAmountSet(tdMetricDayShopSalesList);
		
		log.info("tdMetricDayDateIdSet size: {} bsShopSalesDateIdSet {}", tdMetricDayDateIdSet.size(),
				bsShopSalesDateIdSet.size());
		// 客源中有， 而新一方数据中无， 就是被删除的销售数据
		tdMetricDayDateIdSet.removeAll(bsShopSalesDateIdSet);
		log.info("BsShopSales deleted data size: {}, {}", tdMetricDayDateIdSet.size(), JsonUtils.toJsonString(tdMetricDayDateIdSet));
		Set<String> deletedDateSet = clearTdMetricDaySalesData(tdMetricDayShopSalesList, tdMetricDayDateIdSet);
		
		log.info("bsShopSalesDateIdAmountSet size: {} tdMetricDayDateIdAmountSet {}", bsShopSalesDateIdAmountSet.size(),
				tdMetricDayDateIdAmountSet.size());	
		// 客源中数据与新一方数据有变化的，就是需要更新的数据.
		bsShopSalesDateIdAmountSet.removeAll(tdMetricDayDateIdAmountSet);
		log.info("BsShopSales changed data size: {}", bsShopSalesDateIdAmountSet.size());
		
		Set<String> updatedDateSet = updateTdMetricDaySalesData(filterBsShopSalesList, bsShopSalesDateIdAmountSet);

		// 所有更新的记录
		updatedDateSet.addAll(deletedDateSet);
		return updatedDateSet;
	}
	
	private static void close() {
		if (sqlSession != null) {
			sqlSession.close();
		}
	}
    
	private static void batchUpdate(List<BsShopSales> list) {
		log.info("Entering to batchUpdate. list size:{}", list.size());
		if (CollectionUtils.isEmpty(list)) {
			return;
		}
		int subListSize = 200;
		int slot = list.size() / subListSize;
		if (list.size() % subListSize > 0) {
			slot++;
		}
		for (int i = 0; i < slot; i++) {
			log.debug("batch to insert data to db. slot:{}", slot);
			if (i != slot - 1) {
				MetricDayService.batchUpdateShopSales(sqlSession, list.subList(i * subListSize, (i + 1) * subListSize));
			} else {
				MetricDayService.batchUpdateShopSales(sqlSession, list.subList(i * subListSize, list.size()));
			}
		}
	}

    private static String addDay(int result, String date) {
        Date date1 = DateUtil.getDate(date);
        Date date2 = DateUtil.addDay2Date(result, date1);
        return DateUtil.format(date2, DateUtil.PATTERN_DATE);
    }

    /**
     * 根据一方数据的日期，判断是否需要重新做汇合并计算周/月的Metric.
     * 按与客户约定，数据有可能是修改后的历史数据（上周， 上月或者更早的数据），
     * 由于各种汇总指标已经计算过了，导致汇总指标不准确，需要重新计算
     * @param filterList
     */
	private static void aggregateAndCalcMetric(Set<String> changedDateSet) {
		// 需要重新按天聚合数据的日期
		Set<String> toAggregationDateSet = new HashSet<>();
		// 需要重新计算 Week Metric的日期
		Set<String> toCalcMetricWeekDateSet = new HashSet<>();
		// 需要重新计算 Month Metric的日期
		Set<String> toCalcMetricMonthDateSet = new HashSet<>();
		
		for (String  dateStr : changedDateSet) {
			// 采集的数据的实际日期
			Date realDate = DateUtil.format(dateStr, DateUtil.PATTERN_DATE);
			// 今日计算昨日数据，如果不是昨日数据，说明这是一个后来变动的数据，需要对汇总数据重计算
			if (!DateUtil.isYesterday(realDate)) {
				toAggregationDateSet.add(dateStr);
				if (!DateUtil.isCurrentWeek(realDate)) {
					toCalcMetricWeekDateSet.add(dateStr);
				}
				if (!DateUtil.isCurrentMonth(realDate)) {
					toCalcMetricMonthDateSet.add(dateStr);
				}
			}
		}
		
		log.info("toAggregateDateSet size: {}, toCalcMetricWeekDateSet size: {}, toCalcMetricMonthDateSet size: {}",
				toAggregationDateSet.size(), toCalcMetricWeekDateSet.size(), toCalcMetricMonthDateSet.size());
		
		doAggregationDataByDayTask(toAggregationDateSet);
		doMetricWeekTask(toCalcMetricWeekDateSet);
		doMetricMonthTask(toCalcMetricMonthDateSet);
	}
	
	private static void doAggregationDataByDayTask(Set<String> toAggregationDateSet) {
		for (String date : toAggregationDateSet) {
			log.info("aggregating date {} ", date);
			AggregationDataByDayTask.execute(-1, date, "day");
		}
	}
	
	private static void doMetricWeekTask(Set<String> toCalcMetricWeekDateSet) {
		// 保存处理过区间的startDate，用来避免重复计算;
		Set<String> doneWeekSet = new HashSet<>();
		
		for (String dateStr : toCalcMetricWeekDateSet) {
			Date date = DateUtil.format(dateStr, DateUtil.PATTERN_DATE);
			String startDate = DateUtil.getMonday(date);
			String endDate = DateUtil.getSunday(date);
			// 判断是否计算过
			if (!doneWeekSet.contains(startDate)) {
				doneWeekSet.add(startDate);
				try {
					log.info("doMetricWeekTask with startDate: {}, endDate: {}", startDate, endDate);
					MetricMonthAndWeekTask.execute(startDate, endDate, "week");
				} catch (Exception e) {
					log.error("doMetricWeekTask exception: ", e);
				}				
			}
		}
	}
	
	private static void doMetricMonthTask(Set<String> toCalcMetricMonthDateSet) {
		// 保存处理过区间的startDate，用来避免重复计算;
		Set<String> doneMonthSet = new HashSet<>();
		
		for (String date : toCalcMetricMonthDateSet) {
			String startDate = DateUtil.getMonthStartDay(date);
			String endDate = DateUtil.getMonthEndDay(date);
			// 判断是否计算过
			if (!doneMonthSet.contains(startDate)) {
				doneMonthSet.add(startDate);
				try {
					log.info("doMetricMonthTask with startDate: {}, endDate: {}", startDate, endDate);
					MetricMonthAndWeekTask.execute(startDate, endDate, "month");
				} catch (Exception e) {
					log.error("doMetricMonthTask exception: ", e);
				}				
			}
		}
	}
	
	private static Set<String> createDateSet(List<BsShopSales> salesList) {
		Set<String> set = new HashSet<>();
		for (BsShopSales bsShopSales : salesList) {
			set.add(bsShopSales.getDateId());	
		}
		return set;
	}
	
	private static Set<String> createDateProjectIdSet(List<BsShopSales> salesList) {
		Set<String> set = new HashSet<>();
		for (BsShopSales bsShopSales : salesList) {
			set.add(generateDateProjectIdKey(bsShopSales));	
		}
		return set;
	}
	
	private static Set<String> createDateIdAmountSet(List<BsShopSales> salesList) {
		Set<String> salesAmountSet = new HashSet<>();
		for (BsShopSales bsShopSales : salesList) {
			salesAmountSet.add(generateSalesAmountKey(bsShopSales));
		}
		return salesAmountSet;
	}
	
	/**
	 *  生成单点日销售数据的key dateId#projectId#salesAmount(取整)
	 */
	private static String generateSalesAmountKey(BsShopSales shopSales) {
		String dateId = shopSales.getDateId();
		Integer projectId = shopSales.getProjectId();
		Double saleAmount = shopSales.getSalesAmount();
		int saleAmountIntValue;
		if (saleAmount != null) {
			saleAmountIntValue= saleAmount.intValue();
		} else {
			saleAmountIntValue = 0;
		}
		String key = new StringBuilder().append(dateId).append("#").append(projectId).append("#")
				.append(saleAmountIntValue).toString();
		return key;
	}
	
	private static String generateDateProjectIdKey(BsShopSales shopSales) {
		String dateId = shopSales.getDateId();
		Integer projectId = shopSales.getProjectId();
		String key = new StringBuilder().append(dateId).append("#").append(projectId).toString();
		return key;
	}
	
	private static Set<String> clearTdMetricDaySalesData(List<BsShopSales> tdMetricDayShopSalesList,
			Set<String> tdMetricDayProjectIdSet) {

		Set<String> dateSet = new HashSet<>();
		List<BsShopSales> deletedShopSalesList = new ArrayList<>();
		// 把销售数据清空
		for (BsShopSales shopSales : tdMetricDayShopSalesList) {
			if (tdMetricDayProjectIdSet.contains(generateDateProjectIdKey(shopSales))) {
				BsShopSales bsShopSales = new BsShopSales();
				bsShopSales.setDateId(shopSales.getDateId());
				bsShopSales.setProjectId(shopSales.getProjectId());
				bsShopSales.setVipOrderCount(0);
				bsShopSales.setVipOrderCountGt1(0);
				bsShopSales.setVipSalesAmount(0.0);
				bsShopSales.setVipSalesCount(0.0);
				bsShopSales.setNonVipOrderCount(0);
				bsShopSales.setNonVipOrderCountGt1(0);
				bsShopSales.setNonVipSalesAmount(0.0);
				bsShopSales.setNonVipSalesCount(0.0);
				bsShopSales.setOrderCount(0);
				bsShopSales.setOrderCountGt1(0);
				bsShopSales.setSalesAmount(0.0);
				bsShopSales.setSalesCount(0.0);
				deletedShopSalesList.add(bsShopSales);
				dateSet.add(shopSales.getDateId());
			}
		}
		if (deletedShopSalesList.size() > 0) {
			batchUpdate(deletedShopSalesList);
		}
		return dateSet;
	}
	
	private static Set<String> updateTdMetricDaySalesData(List<BsShopSales> filterList,
			Set<String> bsShopSalesDateIdAmountSet) {
		Set<String> dateSet = new HashSet<>();
		List<BsShopSales> changedShopSalesList = new ArrayList<>();
		for (BsShopSales shopSales : filterList) {
			if (bsShopSalesDateIdAmountSet.contains(generateSalesAmountKey(shopSales))) {
				changedShopSalesList.add(shopSales);
				dateSet.add(shopSales.getDateId());
			}
		}

		if (changedShopSalesList.size() > 0) {
			batchUpdate(changedShopSalesList);
		}

		return dateSet;
	}
	
    public static void main(String[] args) throws Exception {
        Options options = new Options();
        options.addOption("r", "date", true, "运算日期");
        options.addOption("d", "days", true, "需要统计的天数");
        options.addOption("p", "basePath", true, "需要统计数据的路径");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            String date = line.getOptionValue("date");
            int days = Integer.parseInt(line.getOptionValue("days"));
            execute(date, days);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            sqlSession.close();
        }
    }
}

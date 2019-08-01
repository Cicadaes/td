package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.common.util.StringUtil;
import td.enterprise.dao.MetricMonthDao;
import td.enterprise.entity.MetricMonth;
import td.enterprise.page.MetricDayPage;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.MetricDayVM;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricMonthService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-09 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("metricMonthService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class MetricMonthService extends BaseService<MetricMonth> {
	public final static Logger logger = Logger.getLogger(MetricMonthService.class);
	public static SimpleDateFormat format = new SimpleDateFormat("yyyy-MM");
	public static Calendar calendar = Calendar.getInstance();

	@Autowired
	private MetricMonthDao dao;

	public MetricMonthDao getDao() {
		return dao;
	}

	public String getMinusDate(String date, int monthMinus) {
		try {
			calendar.setTime(format.parse(date));
			calendar.add(Calendar.MONTH, -1 * monthMinus);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return format.format(calendar.getTime());
	}
	// 时间段查询
	public List<MetricDayVM> queryByListWithChain(MetricDayPage page) {
		String umid = UserInfoUtil.getUser().getUmid();
		page.setUmid(umid);

		page.setTenantId(UserInfoUtil.getCurrentTenantId());

		Integer rowCount = getDao().queryByCountWithChain(page);
		page.getPager().setRowCount(rowCount);
		page.setOrder(StringUtil.camelToUnderline(page.getOrder()));
		page.setSort(StringUtil.camelToUnderline(page.getSort()));

		if (page.getStartDate() == null || "".equals(page.getStartDate())) {
			logger.error("查询参数缺少startDate 或 endDate！");
			return null;
		}
		List<MetricDayVM> currentList =null;

		if(page.getJoinFlag()!=1){
			currentList = dao.queryByListWithChain(page);
		}else{
			currentList = dao.queryByListWithChainFavorite(page);
		}

		int monthMinus = 1;
		try {

			calendar.setTime(format.parse(page.getEndDate()));
			int endYear = calendar.get(Calendar.YEAR);
			int endMonth = calendar.get(Calendar.MONTH);

			calendar.setTime(format.parse(page.getStartDate()));
			int startYear = calendar.get(Calendar.YEAR);
			int startMonth = calendar.get(Calendar.MONTH);

			monthMinus = (endYear-startYear)*12 + endMonth-startMonth +1;

		} catch (ParseException e) {
			e.printStackTrace();
		}

		// 获取 currentList 的 projectId 并存入projectIds 中
		List<Integer> projectIds = new ArrayList<>();
		for (int k = 0; k < currentList.size(); k++) {
			projectIds.add(currentList.get(k).getProjectId());
		}
		page.setList(projectIds);

//      设置要查询的环比日期的起止值
		page.setStartDate(getMinusDate(page.getStartDate(), monthMinus));
		page.setEndDate(getMinusDate(page.getEndDate(), monthMinus));

		List<MetricDayVM> oldList = null;

		if(page.getJoinFlag()!=1){
			oldList = dao.queryByListWithChain(page);
		}else{
			oldList = dao.queryByListWithChainFavorite(page);
		}

		Map<Integer, MetricDayVM> assistMap = new HashMap<>();
		for (MetricDayVM vm : oldList) {
			assistMap.put(vm.getProjectId(), vm);
		}


//        计算各种率值：
		for (int k = 0; k < currentList.size(); k++) {
			MetricDayVM historyMetricDayVM = assistMap.get(currentList.get(k).getProjectId());
			//  排除环比值为null 的情况
			if (historyMetricDayVM != null) {
//              周边客流量
				currentList.get(k).setFrontUsersChainRate(getRate(currentList.get(k).getFrontUsers(), historyMetricDayVM.getFrontUsers()));

//              入店客流
				currentList.get(k).setActiveUsersChainRate(getRate(currentList.get(k).getActiveUsers(), historyMetricDayVM.getActiveUsers()));

//              停留客流
				currentList.get(k).setStayUsersChainRate(getRate(currentList.get(k).getStayUsers(), historyMetricDayVM.getStayUsers()));

//              跳出客流
				currentList.get(k).setJumpUsersChainRate(getRate(currentList.get(k).getJumpUsers(), historyMetricDayVM.getJumpUsers()));

//           入店会员(短信认证数)
				currentList.get(k).setMemberCountChainRate(getRate(currentList.get(k).getMemberCount(), historyMetricDayVM.getMemberCount()));

//            微信认证数
				currentList.get(k).setPotentialCountChainRate(getRate(currentList.get(k).getPotentialCount(), historyMetricDayVM.getPotentialCount()));

//            新客占比
				currentList.get(k).setActiveUserNewRateChainRate(getRate(currentList.get(k).getActiveUserNewRate(), historyMetricDayVM.getActiveUserNewRate()));

//            老客占比
				currentList.get(k).setActiveUserOldRateChainRate(getRate(currentList.get(k).getActiveUserOldRate(), historyMetricDayVM.getActiveUserOldRate()));

				//         高活跃客占比
				currentList.get(k).setHighRateChainRate(getRate(currentList.get(k).getHighRate(), historyMetricDayVM.getHighRate()));

				//         中活跃客占比
				currentList.get(k).setMiddleRateChainRate(getRate(currentList.get(k).getMiddleRate(), historyMetricDayVM.getMiddleRate()));

//          低活跃客占比
				currentList.get(k).setLowRateChainRate(getRate(currentList.get(k).getLowRate(), historyMetricDayVM.getLowRate()));

//          沉睡客占比
				currentList.get(k).setSleepRateChainRate(getRate(currentList.get(k).getSleepRate(), historyMetricDayVM.getSleepRate()));

//            次均停留时长
				currentList.get(k).setStayDurationPerTimeChainRate(getRate(currentList.get(k).getStayDurationPerTime(), historyMetricDayVM.getStayDurationPerTime()));

//            入店率
				currentList.get(k).setEnterRateChainRate(getRate(currentList.get(k).getEnterRate(), historyMetricDayVM.getEnterRate()));

//           停留率
				currentList.get(k).setStayRateChainRate(getRate(currentList.get(k).getStayRate(), historyMetricDayVM.getStayRate()));

//            跳出率
				currentList.get(k).setJumpRateChainRate(getRate(currentList.get(k).getJumpRate(), historyMetricDayVM.getJumpRate()));

//            销售金额
				currentList.get(k).setSalesAmountChainRate(getRate(currentList.get(k).getSalesAmount(), historyMetricDayVM.getSalesAmount()));

//            订单数
				currentList.get(k).setOrderCountChainRate(getRate(currentList.get(k).getOrderCount(), historyMetricDayVM.getOrderCount()));

//            订单均价
				currentList.get(k).setOrderAveragePriceChainRate(getRate(currentList.get(k).getOrderAveragePrice(), historyMetricDayVM.getOrderAveragePrice()));

//            件单价
				currentList.get(k).setSingularPriceChainRate(getRate(currentList.get(k).getSingularPrice(), historyMetricDayVM.getSingularPrice()));
			}
		}

		return currentList;
	}


	//	计算各种环比值的函数,已经乘以100
	public Double getRate(Integer newVal, Integer oldVal) {
		if (oldVal == null || newVal == null || oldVal == 0) {
			return null;
		} else {
			return 100d * (newVal - oldVal) / oldVal;
		}
	}

	//	计算各种环比值的函数,已经乘以100
	public Double getRate(Double newVal, Double oldVal) {
		if (oldVal == null || newVal == null || oldVal == 0) {
			return null;
		} else {
			return 100d * (newVal - oldVal) / oldVal;
		}
	}

	public Double getRate(Long newVal, Long oldVal) {
		if (oldVal == null || newVal == null || oldVal == 0) {
			return null;
		} else {
			return 100d * (newVal - oldVal) / oldVal;
		}
	}
}

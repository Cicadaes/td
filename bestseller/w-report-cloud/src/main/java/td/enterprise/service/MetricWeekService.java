package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.common.util.StringUtil;
import td.enterprise.dao.MetricWeekDao;
import td.enterprise.entity.MetricWeek;
import td.enterprise.page.MetricDayPage;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.MetricDayVM;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricWeekService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-09 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("metricWeekService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class MetricWeekService extends BaseService<MetricWeek> {
	public final static Logger logger = Logger.getLogger(MetricWeekService.class);
	public static SimpleDateFormat format = new SimpleDateFormat("yyyy-ww");
	public static Calendar calendar = Calendar.getInstance();

	@Autowired
	private MetricWeekDao dao;

	public MetricWeekDao getDao() {
		return dao;
	}

	public String getMinusDate(String date, int weekMinus) {
		try {
			calendar.setTime(format.parse(date));
			calendar.add(Calendar.WEEK_OF_YEAR, -1 * weekMinus);
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


//        要环比的日期差值（先转换为毫秒，再相减，然后除以每天的毫秒数）
		int weekMinus = 1;
		try {
			calendar.setTime(format.parse(page.getEndDate()));
			int endYear = calendar.get(Calendar.YEAR);
			int endWeek = calendar.get(Calendar.WEEK_OF_YEAR);

			calendar.setTime(format.parse(page.getStartDate()));
			int startYear = calendar.get(Calendar.YEAR);
			int startWeek = calendar.get(Calendar.WEEK_OF_YEAR);

			weekMinus = (endYear-startYear)*52+endWeek-startWeek+1;

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
		page.setStartDate(getMinusDate(page.getStartDate(), weekMinus));
		page.setEndDate(getMinusDate(page.getEndDate(), weekMinus));

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
				Object[] obj_1=getRate(currentList.get(k).getFrontUsers(), historyMetricDayVM.getFrontUsers());
				currentList.get(k).setFrontUsersChainRate((Double)obj_1[0]);
				currentList.get(k).setFrontUsersChainRateFlag((String)obj_1[1]);

//              入店客流
				Object[] obj_2=getRate(currentList.get(k).getActiveUsers(), historyMetricDayVM.getActiveUsers());
				currentList.get(k).setActiveUsersChainRate((Double)obj_2[0]);
				currentList.get(k).setActiveUsersChainRateFlag((String)obj_2[1]);

//              停留客流
				Object[] obj_3=getRate(currentList.get(k).getStayUsers(), historyMetricDayVM.getStayUsers());
				currentList.get(k).setStayUsersChainRate((Double)obj_3[0]);
				currentList.get(k).setStayUsersChainRateFlag((String)obj_3[1]);

//              跳出客流
				Object[] obj_4 = getRate(currentList.get(k).getJumpUsers(), historyMetricDayVM.getJumpUsers());
				currentList.get(k).setJumpUsersChainRate((Double)obj_4[0]);
				currentList.get(k).setJumpUsersChainRateFlag((String)obj_4[1]);

//           入店会员(短信认证数)
				Object[] obj_5= getRate(currentList.get(k).getMemberCount(), historyMetricDayVM.getMemberCount());
				currentList.get(k).setMemberCountChainRate((Double)obj_5[0]);
				currentList.get(k).setMemberCountChainRateFlag((String)obj_5[1]);

//            微信认证数
				Object[] obj_6 = getRate(currentList.get(k).getPotentialCount(), historyMetricDayVM.getPotentialCount());
				currentList.get(k).setPotentialCountChainRate((Double)obj_6[0]);
				currentList.get(k).setPotentialCountChainRateFlag((String)obj_6[1]);

//            新客占比
				Object[] obj_7  = getRate(currentList.get(k).getActiveUserNewRate(), historyMetricDayVM.getActiveUserNewRate());
				currentList.get(k).setActiveUserNewRateChainRate((Double)obj_7[0]);
				currentList.get(k).setActiveUserNewRateChainRateFlag((String)obj_7[1]);

//            老客占比
				Object[] obj_8 = getRate(currentList.get(k).getActiveUserOldRate(), historyMetricDayVM.getActiveUserOldRate());
				currentList.get(k).setActiveUserOldRateChainRate((Double)obj_8[0]);
				currentList.get(k).setActiveUserOldRateChainRateFlag((String)obj_8[1]);

//         高活跃客占比
				Object[] obj_9 = getRate(currentList.get(k).getHighRate(), historyMetricDayVM.getHighRate());
				currentList.get(k).setHighRateChainRate((Double)obj_9[0]);
				currentList.get(k).setHighRateChainRateFlag((String)obj_9[1]);

//         中活跃客占比
				Object[] obj_10  = getRate(currentList.get(k).getMiddleRate(), historyMetricDayVM.getMiddleRate());
				currentList.get(k).setMiddleRateChainRate((Double)obj_10[0]);
				currentList.get(k).setMiddleRateChainRateFlag((String)obj_10[1]);

//          低活跃客占比
				Object[] obj_11 = getRate(currentList.get(k).getLowRate(), historyMetricDayVM.getLowRate());
				currentList.get(k).setLowRateChainRate((Double)obj_11[0]);
				currentList.get(k).setLowRateChainRateFlag((String)obj_11[1]);

//          沉睡客占比
				Object[] obj_12 =  getRate(currentList.get(k).getSleepRate(), historyMetricDayVM.getSleepRate());
				currentList.get(k).setSleepRateChainRate((Double)obj_12[0]);
				currentList.get(k).setSleepRateChainRateFlag((String)obj_12[1]);

//            次均停留时长
				Object[] obj_13 =  getRate(currentList.get(k).getStayDurationPerTime(), historyMetricDayVM.getStayDurationPerTime());
				currentList.get(k).setStayDurationPerTimeChainRate((Double)obj_13[0]);
				currentList.get(k).setStayDurationPerTimeChainRateFlag((String)obj_13[1]);

//            入店率
				Object[] obj_14 =   getRate(currentList.get(k).getEnterRate(), historyMetricDayVM.getEnterRate());
				currentList.get(k).setEnterRateChainRate((Double)obj_14[0]);
				currentList.get(k).setEnterRateChainRateFlag((String)obj_14[1]);

//           停留率
				Object[] obj_15 =  getRate(currentList.get(k).getStayRate(), historyMetricDayVM.getStayRate());
				currentList.get(k).setStayRateChainRate((Double)obj_15[0]);
				currentList.get(k).setStayRateChainRateFlag((String)obj_15[1]);

//            跳出率
				Object[] obj_16 =  getRate(currentList.get(k).getJumpRate(), historyMetricDayVM.getJumpRate());
				currentList.get(k).setJumpRateChainRate((Double)obj_16[0]);
				currentList.get(k).setJumpRateChainRateFlag((String)obj_16[1]);

//            销售金额
				Object[] obj_17 =  getRate(currentList.get(k).getSalesAmount(), historyMetricDayVM.getSalesAmount());
				currentList.get(k).setSalesAmountChainRate((Double)obj_17[0]);
				currentList.get(k).setSalesAmountChainRateFlag((String)obj_17[1]);

//            订单数
				Object[] obj_18 = getRate(currentList.get(k).getOrderCount(), historyMetricDayVM.getOrderCount());
				currentList.get(k).setOrderCountChainRate((Double)obj_18[0]);
				currentList.get(k).setOrderCountChainRateFlag((String)obj_18[1]);

//            订单均价
				Object[] obj_19 = getRate(currentList.get(k).getOrderAveragePrice(), historyMetricDayVM.getOrderAveragePrice());
				currentList.get(k).setOrderAveragePriceChainRate((Double)obj_19[0]);
				currentList.get(k).setOrderAveragePriceChainRateFlag((String)obj_19[1]);

//            件单价
				Object[] obj_20 = getRate(currentList.get(k).getSingularPrice(), historyMetricDayVM.getSingularPrice());
				currentList.get(k).setSingularPriceChainRate((Double)obj_20[0]);
				currentList.get(k).setSingularPriceChainRateFlag((String)obj_20[1]);
			}
		}
		return currentList;
	}


	//	计算各种环比值的函数,已经乘以100 , 保留一位小数
	//  返回的值是一个数组，第一个是比值的绝对值，第二个是比值的符号，符号为 UP 和 DOWN , 等于0 的时候算 DOWN
	private Object[] getRate(Integer newVal, Integer oldVal) {
		Object [] obj = new Object[2];
		if (oldVal == null || newVal == null || oldVal == 0) {
			obj[0]= 0.0 ;
			obj[1]= "UP";
		} else {
			obj[0]= Math.abs(Math.round (1000d * (newVal - oldVal) / oldVal)*1.0/10) ;
			obj[1]= newVal >= oldVal ? "UP":"DOWN";
		}
		return obj;
	}

	//	计算各种环比值的函数,已经乘以100
	//    返回的值是一个数组，第一个是比值的绝对值，第二个是比值的符号，符号为 UP 和 DOWN , 等于0 的时候算 DOWN
	private Object[]  getRate(Double newVal, Double oldVal) {
		Object [] obj = new Object[2];
		if (oldVal == null || newVal == null || oldVal == 0) {
			obj[0]= 0.0 ;
			obj[1]= "UP";
		} else {
			obj[0]= Math.abs(Math.round (1000d * (newVal - oldVal) / oldVal)*1.0/10) ;
			obj[1]= newVal >= oldVal ? "UP":"DOWN";
		}
		return obj;
	}

	//	计算各种环比值的函数,已经乘以100
	//    返回的值是一个数组，第一个是比值的绝对值，第二个是比值的符号，符号为 UP 和 DOWN , 等于0 的时候算 DOWN
	private Object[]  getRate(Long newVal, Long oldVal) {
		Object [] obj = new Object[2];
		if (oldVal == null || newVal == null || oldVal == 0) {
			obj[0]= 0.0 ;
			obj[1]= "UP";
		} else {
			obj[0]= Math.abs(Math.round (1000d * (newVal - oldVal) / oldVal)*1.0/10) ;
			obj[1]= newVal >= oldVal ? "UP":"DOWN";
		}
		return obj;
	}
}

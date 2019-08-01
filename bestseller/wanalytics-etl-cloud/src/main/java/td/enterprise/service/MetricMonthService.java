package td.enterprise.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import td.enterprise.dao.MetricMonthDao;
import td.enterprise.entity.MetricDay;
import td.enterprise.entity.MetricMonth;

/**
 * <br>
 * <b>功能：</b>TD_METRIC_MONTH MetricMonthService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-12-21 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class MetricMonthService {
	public final static Logger logger = Logger.getLogger(MetricMonthService.class);
	
	public static int insertOrUpdate(SqlSession session, String startDate, String endDate){
		MetricMonthDao dao = session.getMapper(MetricMonthDao.class);
		Map<String, Object> params = new HashMap<>();
	    params.put("startDate", startDate);
	    params.put("endDate", endDate);
	    int insert = dao.insertOrUpdate(params);
	    session.commit();
	    return insert;
	}
	
	public static List<MetricMonth> queryListByDate(SqlSession session, String startDate, String endDate) {
		MetricMonthDao dao = session.getMapper(MetricMonthDao.class);
	    Map<String, Object> params = new HashMap<>();
	    params.put("startDate", startDate);
	    params.put("endDate", endDate);
	    return dao.queryListByDate(params);
	}
	
	public static void updateBySelective(SqlSession session, MetricMonth metricMonth) {
		MetricMonthDao dao = session.getMapper(MetricMonthDao.class);
		dao.updateBySelective(metricMonth);
		session.commit();
	}
	
}

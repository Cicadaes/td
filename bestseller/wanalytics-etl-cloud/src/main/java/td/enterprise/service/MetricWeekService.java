package td.enterprise.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import td.enterprise.dao.MetricWeekDao;
import td.enterprise.entity.MetricWeek;

/**
 * <br>
 * <b>功能：</b>TD_METRIC_WEEK MetricWeekService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-12-21 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class MetricWeekService {
	public final static Logger logger = Logger.getLogger(MetricWeekService.class);
	
	public static int insertOrUpdate(SqlSession session, String startDate, String endDate){
	    MetricWeekDao dao = session.getMapper(MetricWeekDao.class);
	    Map<String, Object> params = new HashMap<>();
	    params.put("startDate", startDate);
	    params.put("endDate", endDate);
	    int insert = dao.insertOrUpdate(params);
	    session.commit();
	    return insert;
	}
	
	public static List<MetricWeek> queryListByDate(SqlSession session, String startDate, String endDate) {
		MetricWeekDao dao = session.getMapper(MetricWeekDao.class);
	    Map<String, Object> params = new HashMap<>();
	    params.put("startDate", startDate);
	    params.put("endDate", endDate);
	    return dao.queryListByDate(params);
	}
}

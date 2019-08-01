package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.MetricDayPartyDao;

/**
 * <br>
 * <b>功能：</b>一方数据日指标 MetricDayPartyService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-08 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("metricDayPartyService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class MetricDayPartyService {
	public final static Logger logger = Logger.getLogger(MetricDayPartyService.class);
	
	/**
	* <p>Description: 执行批量保存一方数据日指标(历史认证数据)</p>
	* @param sqlSession
	* @param bsShopList
	* @return
	* @author liyinglei 
	* @date 2017年11月8日下午1:59:41
	 */
	public static int batchInsertMetricDayParty(SqlSession sqlSession, String runDate) {
    	MetricDayPartyDao dao = sqlSession.getMapper(MetricDayPartyDao.class);
        return dao.batchInsert(runDate);
    }
	
	/**
	* <p>Description: 通过周期删除记录</p>
	* @param sqlSession
	* @param bsShopList
	* @return
	* @author liyinglei 
	* @date 2017年11月8日下午1:59:41
	 */
	public static int deleteByRunDate(SqlSession sqlSession, String runDate) {
    	MetricDayPartyDao dao = sqlSession.getMapper(MetricDayPartyDao.class);
        return dao.deleteByRunDate(runDate);
    }
}

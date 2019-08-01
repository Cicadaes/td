package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.MetricWeekActiveDao;
import td.enterprise.entity.MetricWeekActive;

/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricWeekActiveService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("metricWeekActiveService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class MetricWeekActiveService extends BaseService<MetricWeekActive> {
	public final static Logger logger = Logger.getLogger(MetricWeekActiveService.class);
	
	@Autowired
	private MetricWeekActiveDao dao;

	public MetricWeekActiveDao getDao() {
		return dao;
	}
}

package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.MetricMonthActiveDao;
import td.enterprise.entity.MetricMonthActive;

/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricMonthActiveService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("metricMonthActiveService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class MetricMonthActiveService extends BaseService<MetricMonthActive> {
	public final static Logger logger = Logger.getLogger(MetricMonthActiveService.class);
	
	@Autowired
	private MetricMonthActiveDao dao;

	public MetricMonthActiveDao getDao() {
		return dao;
	}
}

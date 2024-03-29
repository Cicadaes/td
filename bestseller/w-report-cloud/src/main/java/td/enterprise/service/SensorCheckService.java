package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.SensorCheckDao;
import td.enterprise.entity.SensorCheck;

/**
 * 
 * <br>
 * <b>功能：</b>探针检测配置 SensorCheckService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("sensorCheckService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SensorCheckService extends BaseService<SensorCheck> {
	public final static Logger logger = Logger.getLogger(SensorCheckService.class);
	
	@Autowired
	private SensorCheckDao dao;

	public SensorCheckDao getDao() {
		return dao;
	}
}

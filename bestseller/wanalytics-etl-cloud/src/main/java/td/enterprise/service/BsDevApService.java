package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.BsDevApDao;

/**
 * <br>
 * <b>功能：</b>绫致店铺AP设备 BsDevApService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-17 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("bsDevApService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BsDevApService {
	public final static Logger logger = Logger.getLogger(BsDevApService.class);
	
	@Autowired
	private BsDevApDao dao;

	public BsDevApDao getDao() {
		return dao;
	}
}

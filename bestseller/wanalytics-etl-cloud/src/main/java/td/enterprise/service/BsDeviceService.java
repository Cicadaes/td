package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.BsDeviceDao;

/**
 * <br>
 * <b>功能：</b>绫致店铺设备(AC、小贝) BsDeviceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-17 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("bsDeviceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BsDeviceService {
	public final static Logger logger = Logger.getLogger(BsDeviceService.class);
	
	@Autowired
	private BsDeviceDao dao;

	public BsDeviceDao getDao() {
		return dao;
	}
}

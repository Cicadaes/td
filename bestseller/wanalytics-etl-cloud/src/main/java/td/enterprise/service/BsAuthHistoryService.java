package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.BsAuthHistoryDao;

/**
 * <br>
 * <b>功能：</b>绫致店铺历史认证信息 BsAuthHistoryService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-18 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("bsAuthHistoryService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BsAuthHistoryService {
	public final static Logger logger = Logger.getLogger(BsAuthHistoryService.class);
	
	@Autowired
	private BsAuthHistoryDao dao;

	public BsAuthHistoryDao getDao() {
		return dao;
	}
}

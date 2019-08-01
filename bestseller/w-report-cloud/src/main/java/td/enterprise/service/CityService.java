package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.CityDao;
import td.enterprise.entity.City;

/**
 * <br>
 * <b>功能：</b>排行榜表 CityService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-24 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("cityService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CityService extends BaseService<City> {
	public final static Logger logger = Logger.getLogger(CityService.class);
	
	@Autowired
	private CityDao dao;

	public CityDao getDao() {
		return dao;
	}

	public String selectSonLevel(String province){
		 return dao.selectSonLevel(province);
	}
}

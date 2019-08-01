package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.CityAoiDao;
import td.enterprise.entity.CityAoi;

/**
 * <br>
 * <b>功能：</b>城市围栏 CityAoiService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("cityAoiService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CityAoiService extends BaseService<CityAoi> {
    public final static Logger logger = Logger.getLogger(CityAoiService.class);

    @Autowired
    private CityAoiDao dao;

    public CityAoiDao getDao() {
        return dao;
    }
}

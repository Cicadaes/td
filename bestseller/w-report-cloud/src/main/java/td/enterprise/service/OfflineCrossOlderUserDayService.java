package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.OfflineCrossOlderUserDayDao;
import td.enterprise.entity.OfflineCrossOlderUserDay;

/*
 *
 * <br>
 * <b>功能：</b>项目每天跨店老客 OfflineCrossOlderUserDayService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("offlineCrossOlderUserDayService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class OfflineCrossOlderUserDayService extends BaseService<OfflineCrossOlderUserDay> {
    public final static Logger logger = Logger.getLogger(OfflineCrossOlderUserDayService.class);

    @Autowired
    private OfflineCrossOlderUserDayDao dao;

    public OfflineCrossOlderUserDayDao getDao() {
        return dao;
    }

    public Integer querySumByList(OfflineCrossOlderUserDay userDay) {
        return dao.querySumByList(userDay);
    }
}

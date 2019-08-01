package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.OfflineCrossOldUserMonthDao;
import td.enterprise.entity.OfflineCrossOldUserMonth;
import td.enterprise.page.OfflineCrossOldUserMonthPage;

/**
 * <br>
 * <b>功能：</b>项目月度跨店老客 OfflineCrossOldUserMonthService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("offlineCrossOldUserMonthService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class OfflineCrossOldUserMonthService extends BaseService<OfflineCrossOldUserMonth> {
    public final static Logger logger = Logger.getLogger(OfflineCrossOldUserMonthService.class);

    @Autowired
    private OfflineCrossOldUserMonthDao dao;

    public OfflineCrossOldUserMonthDao getDao() {
        return dao;
    }

    public void deleteByProject(OfflineCrossOldUserMonth userMonth) {
        dao.deleteByProject(userMonth);
    }

    public void batchSelectAndInsert(String parentProjectId, String month) {
        OfflineCrossOldUserMonthPage page = new OfflineCrossOldUserMonthPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setMonth(month);
        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
    }
}

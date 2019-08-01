package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.OfflineOlderUserMonthDao;
import td.enterprise.entity.OfflineOlderUserMonth;
import td.enterprise.page.OfflineOlderUserMonthPage;

/**
 * <br>
 * <b>功能：</b>月度老客统计表 OfflineOlderUserMonthService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("offlineOlderUserMonthService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class OfflineOlderUserMonthService extends BaseService<OfflineOlderUserMonth> {
    public final static Logger logger = Logger.getLogger(OfflineOlderUserMonthService.class);

    @Autowired
    private OfflineOlderUserMonthDao dao;

    public OfflineOlderUserMonthDao getDao() {
        return dao;
    }

    public void batchSelectAndInsert(String parentProjectId, String month) {
        OfflineOlderUserMonthPage page = new OfflineOlderUserMonthPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setMonth(month);
        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
    }
}

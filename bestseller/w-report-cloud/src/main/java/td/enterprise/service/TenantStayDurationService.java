package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TenantStayDurationDao;
import td.enterprise.entity.TenantStayDuration;
import td.enterprise.page.TenantStayDurationPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目新老客停留时长 TenantStayDurationService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantStayDurationService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantStayDurationService extends BaseService<TenantStayDuration> {
    public final static Logger logger = Logger.getLogger(TenantStayDurationService.class);

    @Autowired
    private TenantStayDurationDao dao;

    public TenantStayDurationDao getDao() {
        return dao;
    }

    public void batchSelectAndInsert(String parentProjectId, String date) {
        TenantStayDurationPage page = new TenantStayDurationPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setDate(date);
        try {
            dao.batchDeleteByProjectAndDate(page);
            dao.batchSelectAndInsert(page);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<TenantStayDuration> queryList(TenantStayDurationPage page) {
        return dao.queryList(page);
    }
}


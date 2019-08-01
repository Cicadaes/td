package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TenantLookalikeJobHousingCountDao;
import td.enterprise.entity.TenantLookalikeJobHousingCount;
import td.enterprise.page.TenantLookalikeJobHousingCountPage;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>职住来源-客户围群 TenantLookalikeJobHousingCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantLookalikeJobHousingCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantLookalikeJobHousingCountService extends BaseService<TenantLookalikeJobHousingCount> {
    public final static Logger logger = Logger.getLogger(TenantLookalikeJobHousingCountService.class);

    @Autowired
    private TenantLookalikeJobHousingCountDao dao;

    public TenantLookalikeJobHousingCountDao getDao() {
        return dao;
    }

    public Integer queryCountByPage(TenantLookalikeJobHousingCountPage page) {
        List<TenantLookalikeJobHousingCount> list = dao.queryCountByPage(page);
        return list.size();
    }

    public List querySumByList(TenantLookalikeJobHousingCountPage page) throws Exception {
        page.getPager().setRowCount(0);
        List list = new ArrayList<>();
        list = getDao().querySumByList(page);
        Integer rowCount = queryCountByPage(page);
        page.getPager().setRowCount(rowCount.intValue());
        return list;
    }
}

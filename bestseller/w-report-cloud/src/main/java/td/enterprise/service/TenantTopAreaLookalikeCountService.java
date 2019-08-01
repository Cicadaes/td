package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TenantTopAreaLookalikeCountDao;
import td.enterprise.entity.TenantTopAreaLookalikeCount;

/**
 * <br>
 * <b>功能：</b>潜客挖掘TOP区域 TenantTopAreaLookalikeCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-25 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantTopAreaLookalikeCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantTopAreaLookalikeCountService extends BaseService<TenantTopAreaLookalikeCount> {
    public final static Logger logger = Logger.getLogger(TenantTopAreaLookalikeCountService.class);

    @Autowired
    private TenantTopAreaLookalikeCountDao dao;

    public TenantTopAreaLookalikeCountDao getDao() {
        return dao;
    }
}

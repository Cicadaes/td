package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TargetDao;
import td.enterprise.entity.Target;

/**
 * <br>
 * <b>功能：</b>目标管理标签类 TargetService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("targetService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TargetService extends BaseService<Target> {
    public final static Logger logger = Logger.getLogger(TargetService.class);

    @Autowired
    private TargetDao dao;

    public TargetDao getDao() {
        return dao;
    }
}

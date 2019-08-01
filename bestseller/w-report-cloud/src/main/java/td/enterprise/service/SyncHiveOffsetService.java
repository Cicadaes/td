package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.SyncHiveOffsetDao;
import td.enterprise.entity.SyncHiveOffset;

/**
 * <br>
 * <b>功能：</b>租户项目同步offset到hive 表中记录 SyncHiveOffsetService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-12 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("syncHiveOffsetService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SyncHiveOffsetService extends BaseService<SyncHiveOffset> {
    public final static Logger logger = Logger.getLogger(SyncHiveOffsetService.class);

    @Autowired
    private SyncHiveOffsetDao dao;

    public SyncHiveOffsetDao getDao() {
        return dao;
    }
}

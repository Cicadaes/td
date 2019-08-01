package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.DmkPositionDao;
import td.enterprise.entity.DmkPosition;

/**
 * <br>
 * <b>功能：</b>月聚集位置查询服务 DmkPositionService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("dmkPositionService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DmkPositionService extends BaseService<DmkPosition> {
    public final static Logger logger = Logger.getLogger(DmkPositionService.class);

    @Autowired
    private DmkPositionDao dao;

    public DmkPositionDao getDao() {
        return dao;
    }
}

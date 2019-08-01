package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.PoiBrandWifipixDao;
import td.enterprise.entity.PoiBrandWifipix;

/**
 * <br>
 * <b>功能：</b>品牌信息 PoiBrandWifipixService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("poiBrandWifipixService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PoiBrandWifipixService extends BaseService<PoiBrandWifipix> {
    public final static Logger logger = Logger.getLogger(PoiBrandWifipixService.class);

    @Autowired
    private PoiBrandWifipixDao dao;

    public PoiBrandWifipixDao getDao() {
        return dao;
    }
}

package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.AppBlackListDao;
import td.enterprise.entity.AppBlackList;

/**
 * <br>
 * <b>功能：</b>App黑名单 AppBlackListService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("appBlackListService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AppBlackListService extends BaseService<AppBlackList> {
    public final static Logger logger = Logger.getLogger(AppBlackListService.class);

    @Autowired
    private AppBlackListDao dao;

    public AppBlackListDao getDao() {
        return dao;
    }

}

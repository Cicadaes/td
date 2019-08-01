package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.AppTypesDao;
import td.enterprise.entity.AppTypes;

/**
 * <br>
 * <b>功能：</b>APP分类表 AppTypesService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-01 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("appTypesService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AppTypesService extends BaseService<AppTypes> {
    public final static Logger logger = Logger.getLogger(AppTypesService.class);

    @Autowired
    private AppTypesDao dao;

    public AppTypesDao getDao() {
        return dao;
    }

    public void cleanData() {
        dao.cleanData();
    }
}

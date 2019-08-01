package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.AppInfoDao;
import td.enterprise.entity.AppInfo;

/**
 * <br>
 * <b>功能：</b>App清单数据 AppInfoService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("appInfoService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AppInfoService extends BaseService<AppInfo> {
    public final static Logger logger = Logger.getLogger(AppInfoService.class);

    @Autowired
    private AppInfoDao dao;

    public AppInfoDao getDao() {
        return dao;
    }

    public AppInfo queryAppInfo(AppInfo appInfo) {
        return dao.queryAppInfo(appInfo);
    }
}

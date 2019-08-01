package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.CustomCrowdDao;
import td.enterprise.entity.CustomCrowd;

/**
 * <br>
 * <b>功能：</b>客户围群表 CustomCrowdService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("customCrowdService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CustomCrowdService extends BaseService<CustomCrowd> {
    public final static Logger logger = Logger.getLogger(CustomCrowdService.class);

    @Autowired
    private CustomCrowdDao dao;

    public CustomCrowdDao getDao() {
        return dao;
    }
}

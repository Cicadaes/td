package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.AzkabanJobConfigDao;
import td.enterprise.entity.AzkabanJobConfig;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>Azkaban任务配置表 AzkabanJobConfigService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("azkabanJobConfigService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AzkabanJobConfigService extends BaseService<AzkabanJobConfig> {
    public final static Logger logger = Logger.getLogger(AzkabanJobConfigService.class);

    @Autowired
    private AzkabanJobConfigDao dao;

    public AzkabanJobConfigDao getDao() {
        return dao;
    }

    public List<AzkabanJobConfig> queryByValidList(AzkabanJobConfig azkabanJobConfig) throws Exception {
        return getDao().queryByValidList(azkabanJobConfig);
    }

}

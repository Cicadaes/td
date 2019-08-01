package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ServiceConfDao;
import td.enterprise.entity.ServiceConf;

/**
 * <br>
 * <b>功能：</b>服务接口 ServiceConfService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("serviceConfService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ServiceConfService extends BaseService<ServiceConf> {
    public final static Logger logger = Logger.getLogger(ServiceConfService.class);

    @Autowired
    private ServiceConfDao dao;

    public ServiceConfDao getDao() {
        return dao;
    }

    public ServiceConf findServiceConfByCode(String serviceCode) {
        return dao.findServiceConfByCode(serviceCode);
    }

}

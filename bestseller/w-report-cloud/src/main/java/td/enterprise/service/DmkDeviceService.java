package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.DmkDeviceDao;
import td.enterprise.entity.DmkDevice;

/**
 * <br>
 * <b>功能：</b>DMK设备同步记录 DmkDeviceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("dmkDeviceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DmkDeviceService extends BaseService<DmkDevice> {
    public final static Logger logger = Logger.getLogger(DmkDeviceService.class);

    @Autowired
    private DmkDeviceDao dao;

    public DmkDeviceDao getDao() {
        return dao;
    }
}

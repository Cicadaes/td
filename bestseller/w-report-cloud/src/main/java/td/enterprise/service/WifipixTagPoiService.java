package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.WifipixTagPoiDao;
import td.enterprise.entity.WifipixTagPoi;

/**
 * <br>
 * <b>功能：</b>WiFiPix标签 WifipixTagPoiService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("wifipixTagPoiService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class WifipixTagPoiService extends BaseService<WifipixTagPoi> {
    public final static Logger logger = Logger.getLogger(WifipixTagPoiService.class);

    @Autowired
    private WifipixTagPoiDao dao;

    public WifipixTagPoiDao getDao() {
        return dao;
    }
}

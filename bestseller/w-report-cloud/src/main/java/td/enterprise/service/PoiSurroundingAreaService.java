package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.PoiSurroundingAreaDao;
import td.enterprise.entity.PoiSurroundingArea;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>区域来源 PoiSurroundingAreaService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("poiSurroundingAreaService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PoiSurroundingAreaService extends BaseService<PoiSurroundingArea> {
    public final static Logger logger = Logger.getLogger(PoiSurroundingAreaService.class);

    @Autowired
    private PoiSurroundingAreaDao dao;

    public PoiSurroundingAreaDao getDao() {
        return dao;
    }

    public List<PoiSurroundingArea> queryForList(PoiSurroundingArea poiSurroundingArea) {
        return dao.queryForList(poiSurroundingArea);
    }
}

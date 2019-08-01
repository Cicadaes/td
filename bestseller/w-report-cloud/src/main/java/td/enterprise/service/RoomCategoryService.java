package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.RoomCategoryDao;
import td.enterprise.entity.RoomCategory;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>房间分类表 RoomCategoryService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-07-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("roomCategoryService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class RoomCategoryService extends BaseService<RoomCategory> {
    public final static Logger logger = Logger.getLogger(RoomCategoryService.class);

    @Autowired
    private RoomCategoryDao dao;

    public RoomCategoryDao getDao() {
        return dao;
    }

    public List<RoomCategory> getList(int tenantId) {
        return dao.getList(tenantId);
    }
}

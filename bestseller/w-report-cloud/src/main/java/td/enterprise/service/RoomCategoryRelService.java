package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.RoomCategoryRelDao;
import td.enterprise.entity.RoomCategoryRel;
import td.enterprise.page.RoomCategoryRelPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>房间、分类关系表 RoomCategoryRelService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-07-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("roomCategoryRelService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class RoomCategoryRelService extends BaseService<RoomCategoryRel> {
    public final static Logger logger = Logger.getLogger(RoomCategoryRelService.class);

    @Autowired
    private RoomCategoryRelDao dao;

    public RoomCategoryRelDao getDao() {
        return dao;
    }

    public void deleteRelByRoomId(int roomId) {
        RoomCategoryRelPage page = new RoomCategoryRelPage();
        page.setRoomid(roomId);
        List<RoomCategoryRel> list = dao.queryByList(page);
        for (RoomCategoryRel rel : list) {
            dao.deleteByPrimaryKey(rel.getId());
        }
    }
}

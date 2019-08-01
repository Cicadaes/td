package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.RoomCategory;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>房间分类表 RoomCategoryDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-07-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface RoomCategoryDao extends BaseDao<RoomCategory> {
    List<RoomCategory> getList(int tenantId);

}

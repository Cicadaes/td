package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.PoiSurroundingArea;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>区域来源 PoiSurroundingAreaDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface PoiSurroundingAreaDao extends BaseDao<PoiSurroundingArea> {
    List<PoiSurroundingArea> queryForList(PoiSurroundingArea oiSurroundingArea);
}

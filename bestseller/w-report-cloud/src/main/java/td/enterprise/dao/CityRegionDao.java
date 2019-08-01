package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.CityRegion;
import td.enterprise.page.BasePage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>城市区域地理位置范围 CityRegionDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface CityRegionDao extends BaseDao<CityRegion> {
    List<CityRegion> queryRegionNameByType(CityRegion cityRegion);

    List<CityRegion> queryRegionList(CityRegion cityRegion);

    List querySumByList(BasePage basepage);
}

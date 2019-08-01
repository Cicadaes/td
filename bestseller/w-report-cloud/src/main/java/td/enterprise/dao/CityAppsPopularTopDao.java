package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.CityAppsPopularTop;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>App去流行表 CityAppsPopularTopDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface CityAppsPopularTopDao extends BaseDao<CityAppsPopularTop> {
    List<Map<String, Object>> getCityAppProportion(CityAppsPopularTop capp);

    List<CityAppsPopularTop> getAllLatestCityAppProportion(CityAppsPopularTop capp);
}

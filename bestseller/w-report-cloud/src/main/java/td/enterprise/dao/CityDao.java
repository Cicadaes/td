package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.City;

/**
 * <br>
 * <b>功能：</b>排行榜表 CityDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-24 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface CityDao extends BaseDao<City> {
    String selectSonLevel(String province);
}

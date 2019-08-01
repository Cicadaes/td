package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.CityAppIntrestCount;
import td.enterprise.page.CityAppIntrestCountPage;

/**
 * <br>
 * <b>功能：</b>应用偏好提升度 CityAppIntrestCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface CityAppIntrestCountDao extends BaseDao<CityAppIntrestCount> {

    CityAppIntrestCount queryLatestRow(CityAppIntrestCountPage page);
}

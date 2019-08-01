package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantLookalikeJobHousingCount;
import td.enterprise.page.BasePage;
import td.enterprise.page.TenantLookalikeJobHousingCountPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>职住来源-客户围群 TenantLookalikeJobHousingCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantLookalikeJobHousingCountDao extends BaseDao<TenantLookalikeJobHousingCount> {

    List querySumByList(BasePage basepage);

    List queryCountByPage(TenantLookalikeJobHousingCountPage page);
}

package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantJobHousingCount;
import td.enterprise.page.BasePage;
import td.enterprise.page.TenantJobHousingCountPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>职住来源 TenantJobHousingCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-25 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantJobHousingCountDao extends BaseDao<TenantJobHousingCount> {

    List querySumByList(BasePage basepage);

    TenantJobHousingCount queryLatestRow(TenantJobHousingCountPage page);

    void batchDeleteByProjectAndDate(TenantJobHousingCountPage page);

    void batchSelectAndInsert(TenantJobHousingCountPage page);

}

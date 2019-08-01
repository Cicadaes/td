package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantTopAreaCount;
import td.enterprise.page.TenantTopAreaCountPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TopN小区 TenantTopAreaCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantTopAreaCountDao extends BaseDao<TenantTopAreaCount> {
    TenantTopAreaCount queryLatestRow(TenantTopAreaCountPage page);

    List<TenantTopAreaCount> queryByListNew(TenantTopAreaCountPage page);

    Long queryByListNewSum(TenantTopAreaCountPage page);

    void batchDeleteByProjectAndDate(TenantTopAreaCountPage page);

    void batchSelectAndInsert(TenantTopAreaCountPage page);
}

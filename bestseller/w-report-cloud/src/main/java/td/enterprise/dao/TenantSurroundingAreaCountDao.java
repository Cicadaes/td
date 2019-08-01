package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantSurroundingAreaCount;
import td.enterprise.page.TenantSurroundingAreaCountPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>职住来源 TenantSurroundingAreaCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-04 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantSurroundingAreaCountDao extends BaseDao<TenantSurroundingAreaCount> {

    TenantSurroundingAreaCount queryLatestRow(TenantSurroundingAreaCountPage page);

    List<TenantSurroundingAreaCount> queryByListExcludeBlack(TenantSurroundingAreaCountPage page);

    int queryByCountExcludeBlack(TenantSurroundingAreaCountPage page);
}

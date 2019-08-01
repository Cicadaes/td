package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantTagsCount;
import td.enterprise.page.TenantTagsCountPage;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>人群设备 TenantTagsCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantTagsCountDao extends BaseDao<TenantTagsCount> {
    int insertList(List<TenantTagsCount> items);

    List<TenantTagsCount> selectByCodesIn(Map params);

    List<TenantTagsCount> selectForRadar(Map params);

    TenantTagsCount selectLatestDataByCodesIn(Map params);

    int deleteByParams(TenantTagsCount tenantTagsCount);

    TenantTagsCount queryLatestRow(TenantTagsCountPage tenantJobHousingCountPage);

    List<TenantTagsCount> queryChildrenSum(TenantTagsCountPage page);

    void batchDeleteByProjectAndDate(TenantTagsCountPage page);

    void batchInsert(List<TenantTagsCount> list);

    void batchSelectAndInsert(TenantTagsCountPage page);

}

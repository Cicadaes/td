package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantAppSignificance;
import td.enterprise.page.TenantAppSignificancePage;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>App显著性计算 TenantAppSignificanceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantAppSignificanceDao extends BaseDao<TenantAppSignificance> {

    List<TenantAppSignificance> queryAppByList(Map<String, Object> map);

    List<TenantAppSignificance> queryAppByList2(Map<String, Object> map);

    List<Map<String, Integer>> queryAppUseByList(Map<String, Object> map);

    TenantAppSignificance queryLatestRow(Map<String, Object> page);

    List<TenantAppSignificance> queryToSyncAppInfo();

    List<TenantAppSignificance> queryChildrenSum(TenantAppSignificancePage page);

    void batchDeleteByProjectAndDate(TenantAppSignificancePage page);

    void batchInsert(List<TenantAppSignificance> list);

    void batchSelectAndInsert(TenantAppSignificancePage page);

}

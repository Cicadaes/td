package td.enterprise.dao;

import td.enterprise.entity.TenantAppSignificance;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>App显著性计算 TenantAppSignificanceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantAppSignificanceDao extends BaseDao<TenantAppSignificance> {

    void batchDeleteByProjectAndDate(TenantAppSignificance page);
    void batchSelectAndInsert(TenantAppSignificance page);

}

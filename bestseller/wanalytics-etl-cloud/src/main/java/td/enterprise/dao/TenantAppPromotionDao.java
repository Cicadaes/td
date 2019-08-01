package td.enterprise.dao;

import td.enterprise.entity.TenantAppPromotion;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>App提升度计算 TenantAppPromotionDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantAppPromotionDao extends BaseDao<TenantAppPromotion> {

    void batchDeleteByProjectAndDate(TenantAppPromotion page);

    void batchSelectAndInsert(TenantAppPromotion page);

}

package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantAppPromotion;
import td.enterprise.page.TenantAppPromotionPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>App提升度计算 TenantAppPromotionDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantAppPromotionDao extends BaseDao<TenantAppPromotion> {

    List<TenantAppPromotion> queryChildrenSum(TenantAppPromotionPage page);

    void batchDeleteByProjectAndDate(TenantAppPromotionPage page);

    void batchInsert(List<TenantAppPromotion> list);

    void batchSelectAndInsert(TenantAppPromotionPage page);

}

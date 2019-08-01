package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantHousingCoverageCount;
import td.enterprise.page.TenantHousingCoverageCountPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>客群辐射范围 TenantHousingCoverageCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantHousingCoverageCountDao extends BaseDao<TenantHousingCoverageCount> {

    List<TenantHousingCoverageCount> queryCustomerDistribution(TenantHousingCoverageCountPage tenantHousingCoverageCountPage);

    List<TenantHousingCoverageCount> queryChildrenSum(TenantHousingCoverageCountPage page);

    void batchDeleteByProjectAndDate(TenantHousingCoverageCountPage page);

    void batchInsert(List<TenantHousingCoverageCount> list);

    void batchSelectAndInsert(TenantHousingCoverageCountPage page);

}

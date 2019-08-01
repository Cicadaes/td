package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantCorrelationCount;
import td.enterprise.page.TenantCorrelationCountPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>竞品关联度指标 TenantCorrelationCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantCorrelationCountDao extends BaseDao<TenantCorrelationCount> {
    List<TenantCorrelationCount> queryRelevancyIndex(TenantCorrelationCountPage tenantCorrelationCountPage);
}

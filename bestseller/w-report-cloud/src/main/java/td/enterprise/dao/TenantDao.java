package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import td.enterprise.entity.Tenant;
import td.enterprise.page.TenantPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>租户信息 TenantDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantDao extends BaseDao<Tenant> {

    List<Tenant> queryBytend(TenantPage page);

    Integer queryBytendCount(TenantPage page);

    List<Tenant> queryByUmid(@Param("umid") String umid);

    List<Tenant> queryById(@Param("id") String id);

    List<Tenant> queryByUmids(TenantPage page);

    Integer queryByUmidsCount(TenantPage page);

    List<Tenant> queryByUmidsSensorData(TenantPage page);

    List<Tenant> queryByUmidsSensorDataNoTenant(TenantPage page);

    List<Tenant> queryByUmidsSensorDataHaveTenant(TenantPage page);

}

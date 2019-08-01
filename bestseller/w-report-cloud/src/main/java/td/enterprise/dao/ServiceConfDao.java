package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ServiceConf;
import td.enterprise.entity.ServiceInterfaceCallLog;
import td.enterprise.page.ServiceInterfaceCallLogPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>服务接口 ServiceConfDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Mapper
public interface ServiceConfDao extends BaseDao<ServiceConf> {

    ServiceConf findServiceConfByCode(String serviceCode);

    List<ServiceInterfaceCallLog> queryByList(ServiceInterfaceCallLogPage page);

}

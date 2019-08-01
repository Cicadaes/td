package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ServiceInterfaceCallLog;

/**
 * <br>
 * <b>功能：</b>服务接口调用日志 ServiceInterfaceCallLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ServiceInterfaceCallLogDao extends BaseDao<ServiceInterfaceCallLog> {
    ServiceInterfaceCallLog getLastIDMappingTaskId(ServiceInterfaceCallLog serviceInterfaceCallLog);
}

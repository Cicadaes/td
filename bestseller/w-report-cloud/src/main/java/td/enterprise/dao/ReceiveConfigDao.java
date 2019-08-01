package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import td.enterprise.entity.ReceiveConfig;
import td.enterprise.page.ReceiveConfigPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>接收配置表 ReceiveConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ReceiveConfigDao extends BaseDao<ReceiveConfig> {
    List<String> checkPwd(@Param(value = "uniqueId") String uniqueId);

    List<ReceiveConfig> queryByAllList(ReceiveConfigPage page);

    List<ReceiveConfig> queryByTenantList(ReceiveConfigPage page);
}

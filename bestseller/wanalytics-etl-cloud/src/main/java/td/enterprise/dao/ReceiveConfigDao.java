package td.enterprise.dao;

import td.enterprise.wanalytics.etl.bean.ReceiveConfig;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>接收配置表 ReceiveConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ReceiveConfigDao extends BaseDao<ReceiveConfig> {

    List<ReceiveConfig> queryByAllList(ReceiveConfig page);

    List<ReceiveConfig> queryByTenantList(ReceiveConfig page);
}

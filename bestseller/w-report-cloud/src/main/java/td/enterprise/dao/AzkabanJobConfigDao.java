package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.AzkabanJobConfig;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>Azkaban任务配置表 AzkabanJobConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface AzkabanJobConfigDao extends BaseDao<AzkabanJobConfig> {

    List<AzkabanJobConfig> queryByValidList(AzkabanJobConfig azkabanJobConfig);

}

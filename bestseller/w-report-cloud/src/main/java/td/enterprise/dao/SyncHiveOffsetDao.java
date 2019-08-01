package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.SyncHiveOffset;

/**
 * <br>
 * <b>功能：</b>租户项目同步offset到hive 表中记录 SyncHiveOffsetDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-12 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface SyncHiveOffsetDao extends BaseDao<SyncHiveOffset> {

}

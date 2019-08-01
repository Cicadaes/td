package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.OfflineCrossOlderUserDay;

/**
 * <br>
 * <b>功能：</b>项目每天跨店老客 OfflineCrossOlderUserDayDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface OfflineCrossOlderUserDayDao extends BaseDao<OfflineCrossOlderUserDay> {
    Integer querySumByList(OfflineCrossOlderUserDay userDay);
}

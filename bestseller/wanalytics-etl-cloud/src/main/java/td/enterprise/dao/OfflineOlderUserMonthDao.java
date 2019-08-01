package td.enterprise.dao;

import td.enterprise.entity.OfflineOlderUserMonth;

/**
 * <br>
 * <b>功能：</b>月度老客统计表 OfflineOlderUserMonthDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface OfflineOlderUserMonthDao extends BaseDao<OfflineOlderUserMonth> {
    void batchDeleteByProjectAndDate(OfflineOlderUserMonth page);

    void batchSelectAndInsert(OfflineOlderUserMonth page);
}

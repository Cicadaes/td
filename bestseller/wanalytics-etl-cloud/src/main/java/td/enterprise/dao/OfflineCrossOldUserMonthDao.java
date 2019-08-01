package td.enterprise.dao;

import td.enterprise.entity.OfflineCrossOldUserMonth;

/**
 * <br>
 * <b>功能：</b>项目月度跨店老客 OfflineCrossOldUserMonthDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface OfflineCrossOldUserMonthDao extends BaseDao<OfflineCrossOldUserMonth> {

    void batchDeleteByProjectAndDate(OfflineCrossOldUserMonth page);

    void batchSelectAndInsert(OfflineCrossOldUserMonth page);
}

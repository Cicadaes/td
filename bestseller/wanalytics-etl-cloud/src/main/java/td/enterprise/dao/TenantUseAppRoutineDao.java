package td.enterprise.dao;

import td.enterprise.entity.TenantUseAppRoutine;

/**
 * <br>
 * <b>功能：</b>APP使用作息 TenantUseAppRoutineDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantUseAppRoutineDao extends BaseDao<TenantUseAppRoutine> {

    void batchDeleteByProjectAndDate(TenantUseAppRoutine page);

    void batchSelectAndInsert(TenantUseAppRoutine page);

}

package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantUseAppRoutine;
import td.enterprise.page.TenantUseAppRoutinePage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>APP使用作息 TenantUseAppRoutineDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantUseAppRoutineDao extends BaseDao<TenantUseAppRoutine> {

    TenantUseAppRoutine queryLatestRow(TenantUseAppRoutinePage page);

    List<TenantUseAppRoutine> queryChildrenSum(TenantUseAppRoutinePage page);

    void batchDeleteByProjectAndDate(TenantUseAppRoutinePage page);

    void batchInsert(List<TenantUseAppRoutine> list);

    void batchSelectAndInsert(TenantUseAppRoutinePage page);

}

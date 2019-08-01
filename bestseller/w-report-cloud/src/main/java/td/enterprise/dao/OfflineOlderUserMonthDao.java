package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.OfflineOlderUserMonth;
import td.enterprise.page.OfflineOlderUserMonthPage;

/**
 * <br>
 * <b>功能：</b>月度老客统计表 OfflineOlderUserMonthDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface OfflineOlderUserMonthDao extends BaseDao<OfflineOlderUserMonth> {
    OfflineOlderUserMonth findOne(OfflineOlderUserMonth offlineOlderUserMonth);

    void batchDeleteByProjectAndDate(OfflineOlderUserMonthPage page);

    void batchSelectAndInsert(OfflineOlderUserMonthPage page);
}

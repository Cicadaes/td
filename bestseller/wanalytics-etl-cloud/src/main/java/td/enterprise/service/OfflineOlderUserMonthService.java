package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.OfflineOlderUserMonthDao;
import td.enterprise.entity.OfflineOlderUserMonth;

/**
 * <br>
 * <b>功能：</b>月度老客统计表 OfflineOlderUserMonthService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class OfflineOlderUserMonthService{

    public static void batchSelectAndInsert(SqlSession sqlSession, String parentProjectId, String month) {
        OfflineOlderUserMonth page = new OfflineOlderUserMonth();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setMonth(month);
        OfflineOlderUserMonthDao dao = sqlSession.getMapper(OfflineOlderUserMonthDao.class);

        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
        sqlSession.commit(true);
    }
}

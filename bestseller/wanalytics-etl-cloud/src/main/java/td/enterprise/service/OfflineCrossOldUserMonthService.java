package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.OfflineCrossOldUserMonthDao;
import td.enterprise.entity.OfflineCrossOldUserMonth;

/**
 * <br>
 * <b>功能：</b>项目月度跨店老客 OfflineCrossOldUserMonthService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class OfflineCrossOldUserMonthService {

    public static void batchSelectAndInsert(SqlSession sqlSession, String parentProjectId, String month) {
        OfflineCrossOldUserMonth page = new OfflineCrossOldUserMonth();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setMonth(month);
        OfflineCrossOldUserMonthDao dao = sqlSession.getMapper(OfflineCrossOldUserMonthDao.class);

        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
        sqlSession.commit(true);
    }
}

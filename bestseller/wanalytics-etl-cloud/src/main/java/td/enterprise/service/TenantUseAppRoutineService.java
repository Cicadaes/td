package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.TenantUseAppRoutineDao;
import td.enterprise.entity.TenantUseAppRoutine;
/**
 * <br>
 * <b>功能：</b>APP使用作息 TenantUseAppRoutineService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantUseAppRoutineService {

    public static void batchSelectAndInsert(SqlSession sqlSession, String parentProjectId, String runDate) {
        TenantUseAppRoutine page = new TenantUseAppRoutine();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        TenantUseAppRoutineDao dao = sqlSession.getMapper(TenantUseAppRoutineDao.class);
        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
        sqlSession.commit(true);
    }
}
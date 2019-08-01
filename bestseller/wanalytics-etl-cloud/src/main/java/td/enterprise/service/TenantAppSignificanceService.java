package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.TenantAppSignificanceDao;
import td.enterprise.entity.TenantAppSignificance;

/**
 * <br>
 * <b>功能：</b>App显著性计算 TenantAppSignificanceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public class TenantAppSignificanceService {

    public static void batchSelectAndInsert(SqlSession sqlSession, String parentProjectId, String runDate) {
        TenantAppSignificance page = new TenantAppSignificance();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        TenantAppSignificanceDao dao = sqlSession.getMapper(TenantAppSignificanceDao.class);
        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
        sqlSession.commit(true);
    }
}

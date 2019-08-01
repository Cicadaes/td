package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.TenantAppPromotionDao;
import td.enterprise.entity.TenantAppPromotion;

/**
 * <br>
 * <b>功能：</b>App提升度计算 TenantAppPromotionService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantAppPromotionService {

    public static void batchSelectAndInsert(SqlSession sqlSession, String parentProjectId, String runDate) {
        TenantAppPromotion page = new TenantAppPromotion();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        TenantAppPromotionDao dao = sqlSession.getMapper(TenantAppPromotionDao.class);
        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
        sqlSession.commit(true);
    }
}

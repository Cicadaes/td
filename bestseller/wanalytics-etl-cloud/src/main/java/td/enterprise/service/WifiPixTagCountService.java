package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.WifiPixTagCountDao;
import td.enterprise.entity.WifiPixTagCount;

/**
 * <br>
 * <b>功能：</b>wifiPix标签统计 WifiPixTagCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class WifiPixTagCountService {

    public static void batchSelectAndInsert(SqlSession sqlSession, String parentProjectId, String runDate) {
        WifiPixTagCount page = new WifiPixTagCount();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        WifiPixTagCountDao dao = sqlSession.getMapper(WifiPixTagCountDao.class);
        dao.batchDeleteByProjectAndDate(page);
        dao.batchSelectAndInsert(page);
        sqlSession.commit(true);
    }
}
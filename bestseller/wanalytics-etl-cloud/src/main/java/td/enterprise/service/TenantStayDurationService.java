package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.dao.TenantStayDurationDao;
import td.enterprise.entity.TenantStayDuration;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 * Created by Administrator on 2017/5/8.
 */
public class TenantStayDurationService {

    public static void batchSelectAndInsert(String parentProjectId, String date){
        SqlSessionFactory  sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        SqlSession sqlSession = sqlSessionFactory.openSession();
        try {
            TenantStayDuration page = new TenantStayDuration();
            page.setProjectId(Integer.parseInt(parentProjectId));
            page.setDate(date);
            TenantStayDurationDao  dao = sqlSession.getMapper(TenantStayDurationDao.class);
            dao.batchDeleteByProjectAndDate(page);
            dao.batchSelectAndInsert(page);
            sqlSession.commit(true);
        }catch(Exception e){
            e.printStackTrace();
        }finally {
            sqlSession.close();
        }
    }
}

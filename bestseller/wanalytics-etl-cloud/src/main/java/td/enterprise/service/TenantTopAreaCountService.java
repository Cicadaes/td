package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.dao.TenantTopAreaCountDao;
import td.enterprise.entity.TenantTopAreaCount;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

/**
 * 
 * <br>
 * <b>功能：</b>TopN小区 TenantTopAreaCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantTopAreaCountService {

	public static void batchSelectAndInsert(String parentProjectId, String date){
		TenantTopAreaCount page = new TenantTopAreaCount();
		page.setProjectId(Integer.parseInt(parentProjectId));
		page.setRunDate(date);
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try{
			TenantTopAreaCountDao dao = sqlSession.getMapper(TenantTopAreaCountDao.class);
			dao.batchDeleteByProjectAndDate(page);
			dao.batchSelectAndInsert(page);
			sqlSession.commit(true);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			sqlSession.close();
		}
	}
}

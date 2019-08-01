package td.enterprise.service;


import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.dao.TenantRegionCountDao;
import td.enterprise.entity.TenantRegionCount;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

/**
 * 
 * <br>
 * <b>功能：</b>区域来源 TenantRegionCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

public class TenantRegionCountService  {
	public final static Logger logger = Logger.getLogger(TenantRegionCountService.class);

	public static void batchSelectAndInsert(String parentProjectId, String runDate){
		TenantRegionCount page = new TenantRegionCount();
		page.setProjectId(Integer.parseInt(parentProjectId));
		page.setRunDate(runDate);
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try{
			TenantRegionCountDao dao = sqlSession.getMapper(TenantRegionCountDao.class);
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

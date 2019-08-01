package td.enterprise.service;


import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.dao.TenantJobHousingCountDao;
import td.enterprise.entity.TenantJobHousingCount;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

/**
 * 
 * <br>
 * <b>功能：</b>职住来源 TenantJobHousingCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-25 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantJobHousingCountService  {
	public final static Logger logger = Logger.getLogger(TenantJobHousingCountService.class);

	
	public static void batchSelectAndInsert(String parentProjectId, String runDate){
		TenantJobHousingCount page = new TenantJobHousingCount();
		page.setProjectId(Integer.parseInt(parentProjectId));
		page.setRunDate(runDate);
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try{
			TenantJobHousingCountDao dao = sqlSession.getMapper(TenantJobHousingCountDao.class);
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

package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.dao.TenantTagsCountDao;
import td.enterprise.entity.TenantTagsCount;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>人群设备 TenantTagsCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantTagsCountService  {

	private void batchInsert(List<TenantTagsCount> list, String parentProjectId, String runDate){
		for(TenantTagsCount tenantTagsCount:list){
			tenantTagsCount.setProjectId(Integer.parseInt(parentProjectId));
			tenantTagsCount.setRunDate(runDate);
		}
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try{
			TenantTagsCountDao dao = sqlSession.getMapper(TenantTagsCountDao.class);
			dao.batchInsert(list);
			sqlSession.commit(true);
		}catch(Exception e){
			e.printStackTrace();
		}finally {
			sqlSession.close();
		}

	}
	
	public static void batchSelectAndInsert(String parentProjectId, String runDate){
		TenantTagsCount page = new TenantTagsCount();
		page.setProjectId(Integer.parseInt(parentProjectId));
		page.setRunDate(runDate);
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try{
			TenantTagsCountDao dao = sqlSession.getMapper(TenantTagsCountDao.class);
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

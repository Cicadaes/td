package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.dao.TenantHousingCoverageCountDao;
import td.enterprise.entity.TenantHousingCoverageCount;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>客群辐射范围 TenantHousingCoverageCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantHousingCoverageCountService  {

	
	public void queryAndInsertSum(String parentProjectId, String runDate){
		TenantHousingCoverageCount page = new TenantHousingCoverageCount();
		page.setProjectId(parentProjectId);
		page.setRunDate(runDate);
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<TenantHousingCoverageCount> list = null;
		try {
			TenantHousingCoverageCountDao dao = sqlSession.getMapper(TenantHousingCoverageCountDao.class);
			list = dao.queryChildrenSum(page);
			dao.batchDeleteByProjectAndDate(page);
		}catch (Exception e){
			e.printStackTrace();
		}finally {
			sqlSession.close();
		}

		if(null!=list && list.size()>0){
			int pointsDataLimit = 1000;//限制条数 
			int size = list.size();
			if(pointsDataLimit < size){
				int part = size/pointsDataLimit;//分批数 
				for (int i = 0; i < part; i++) {
					//1000条 
					List<TenantHousingCoverageCount> listTmp = list.subList(0, pointsDataLimit);
					batchInsert(listTmp, parentProjectId, runDate);
					//移除
					list.subList(0, pointsDataLimit).clear();
				}
				if(!list.isEmpty()){
					batchInsert(list, parentProjectId, runDate);
				}
			}else{
				batchInsert(list, parentProjectId, runDate);
			}
		}
	}
	
	private void batchInsert(List<TenantHousingCoverageCount> list, String parentProjectId, String runDate){
		for(TenantHousingCoverageCount tenantHousingCoverageCount:list){
			tenantHousingCoverageCount.setProjectId(parentProjectId);
			tenantHousingCoverageCount.setRunDate(runDate);
		}
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try {
			TenantHousingCoverageCountDao dao = sqlSession.getMapper(TenantHousingCoverageCountDao.class);
			dao.batchInsert(list);
			sqlSession.commit(true);
		}catch (Exception e){
			e.printStackTrace();
		}finally {
			sqlSession.close();
		}

	}
	
	public static void batchSelectAndInsert(String parentProjectId, String runDate){
		TenantHousingCoverageCount  page = new TenantHousingCoverageCount();
		page.setProjectId(parentProjectId);
		page.setRunDate(runDate);
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try {
			TenantHousingCoverageCountDao dao = sqlSession.getMapper(TenantHousingCoverageCountDao.class);
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

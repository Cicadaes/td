package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.dao.TenantDeviceCountDao;
import td.enterprise.entity.TenantDeviceCount;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>人群标签 TenantDeviceCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantDeviceCountService  {

	public final static Logger logger = Logger.getLogger(TenantDeviceCountService.class);
	

	private void batchInsert(List<TenantDeviceCount> list, String parentProjectId, String runDate){
		for(TenantDeviceCount tenantDeviceCount:list){
			tenantDeviceCount.setProjectId(Integer.parseInt(parentProjectId));
			tenantDeviceCount.setRunDate(runDate);
		}
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try{
			TenantDeviceCountDao dao = sqlSession.getMapper(TenantDeviceCountDao.class);
			dao.batchInsert(list);
			sqlSession.commit(true);
		}catch(Exception e){
			e.printStackTrace();
		}finally {
			sqlSession.close();
		}

	}
	
	public static void batchSelectAndInsert(String parentProjectId, String runDate){
		TenantDeviceCount page = new TenantDeviceCount();
		page.setProjectId(Integer.parseInt(parentProjectId));
		page.setRunDate(runDate);
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession = sqlSessionFactory.openSession();
		try{
			TenantDeviceCountDao dao = sqlSession.getMapper(TenantDeviceCountDao.class);
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

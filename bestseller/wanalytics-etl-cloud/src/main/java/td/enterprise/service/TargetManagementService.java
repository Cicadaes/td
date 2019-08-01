package td.enterprise.service;


import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.dao.TargetManagementDao;
import td.enterprise.entity.TargetManagement;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>目标管理 TargetManagementService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TargetManagementService  {
	public final static Logger logger = Logger.getLogger(TargetManagementService.class);


	public static List<TargetManagement> queryByNotFinishList(TargetManagement target) {
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession =  sqlSessionFactory.openSession();
		try {
			TargetManagementDao dao = sqlSession.getMapper(TargetManagementDao.class);
			return dao.queryByNotFinishList(target);
		} finally {
			sqlSession.close();
		}
	}
	
	public List<TargetManagement> queryByNotFinishListDesc(TargetManagement target) {
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession =  sqlSessionFactory.openSession();
		try {
			TargetManagementDao dao = sqlSession.getMapper(TargetManagementDao.class);
			return dao.queryByNotFinishListDesc(target);
		} finally {
			sqlSession.close();
		}
	}

	public static int updateByPrimaryKey(TargetManagement target){
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession =  sqlSessionFactory.openSession();
		try {
			TargetManagementDao dao = sqlSession.getMapper(TargetManagementDao.class);
			int i = dao.updateByPrimaryKey(target);
			sqlSession.commit(true);
			return i;
		} finally {
			sqlSession.close();
		}
	}

	public static void insert(TargetManagement target){
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession =  sqlSessionFactory.openSession();
		try {
			TargetManagementDao dao = sqlSession.getMapper(TargetManagementDao.class);
			dao.insert(target);
			sqlSession.commit(true);
		} finally {
			sqlSession.close();
		}
	}
}

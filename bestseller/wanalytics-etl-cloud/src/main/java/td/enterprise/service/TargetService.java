package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.entity.Target;
import td.enterprise.dao.TargetDao;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>目标管理标签类 TargetService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TargetService  {
	public final static Logger logger = Logger.getLogger(TargetService.class);
	
  public static List<Target> queryByList(Target target){
	  SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
	  SqlSession sqlSession =  sqlSessionFactory.openSession();
	  try {
		  TargetDao dao = sqlSession.getMapper(TargetDao.class);
		  return dao.queryByList(target);
	  } finally {
		  sqlSession.close();
	 }
  }


}

package td.enterprise.service;


import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.dao.LookalikeCrowdDao;
import td.enterprise.entity.LookalikeCrowd;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

/**
 * 
 * <br>
 * <b>功能：</b>相似人群 LookalikeCrowdService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class LookalikeCrowdService  {
	public final static Logger logger = Logger.getLogger(LookalikeCrowdService.class);
	

	public static LookalikeCrowd selectByPrimaryKey (Object id){
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		SqlSession sqlSession =  sqlSessionFactory.openSession();
		try {
			LookalikeCrowdDao dao = sqlSession.getMapper(LookalikeCrowdDao.class);
			return  dao.selectByPrimaryKey(id);
		}finally {
			sqlSession.close();
		}
	}
}

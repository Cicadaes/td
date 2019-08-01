package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.CustomizedMatchDataDao;
import td.enterprise.entity.CustomizedMatchData;

import java.util.List;

public class CustomizedMatchDataService {

	public static int batchInsert(SqlSession sqlSession, List<CustomizedMatchData> customizedMatchDatas) throws Exception {
		CustomizedMatchDataDao dao = sqlSession.getMapper(CustomizedMatchDataDao.class);
		return dao.batchInsert(customizedMatchDatas);
	}
	
	public static void batchDeleteByBusinessId(SqlSession sqlSession, CustomizedMatchData customizedMatchData) throws Exception {
		CustomizedMatchDataDao dao = sqlSession.getMapper(CustomizedMatchDataDao.class);
		dao.batchDeleteByBusinessId(customizedMatchData);
	}
}

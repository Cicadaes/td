package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.CrowdBlackListDao;
import td.enterprise.dao.DownloadDataDao;
import td.enterprise.entity.CrowdBlackList;
import td.enterprise.entity.DownloadData;

import java.util.List;

/**
 */
public class DownloadDataService {

    public static int insert(SqlSession sqlSession, DownloadData p) {
        DownloadDataDao dao = sqlSession.getMapper(DownloadDataDao.class);
        return dao.insert(p);
    }

    public static List<DownloadData> queryNeedRun(SqlSession sqlSession, DownloadData downloadData) {
        DownloadDataDao dao = sqlSession.getMapper(DownloadDataDao.class);
        return dao.queryNeedRun(downloadData);
    }

    public static void deleteByPrimaryKey(SqlSession sqlSession, String id) {
        DownloadDataDao dao = sqlSession.getMapper(DownloadDataDao.class);
        dao.deleteByPrimaryKey(id);
    }

    public static void updateByPrimaryKey(SqlSession sqlSession, DownloadData downloadData) {
        DownloadDataDao dao = sqlSession.getMapper(DownloadDataDao.class);
        dao.updateByPrimaryKey(downloadData);
    }
}

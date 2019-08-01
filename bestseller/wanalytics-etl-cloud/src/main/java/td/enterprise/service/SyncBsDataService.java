package td.enterprise.service;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

import org.apache.ibatis.session.SqlSession;

import td.enterprise.dao.BsAuthHistoryDao;
import td.enterprise.dao.BsDevApDao;
import td.enterprise.dao.BsDeviceDao;
import td.enterprise.dao.BsDeviceRltDao;
import td.enterprise.dao.BsExecLogDao;
import td.enterprise.dao.BsShopDao;
import td.enterprise.entity.BsAuthHistory;
import td.enterprise.entity.BsDevAp;
import td.enterprise.entity.BsDevice;
import td.enterprise.entity.BsDeviceRlt;
import td.enterprise.entity.BsExecLog;
import td.enterprise.entity.BsShop;

/**
 * TODO 待封装，封装为对dao 的代码，实现自动打开和关闭
 */
@Slf4j
public class SyncBsDataService {

	public static List<BsExecLog> queryLogByList(SqlSession sqlSession, BsExecLog execLog){
		BsExecLogDao dao = sqlSession.getMapper(BsExecLogDao.class);
		return dao.queryLogByList(execLog);
    }

    public static BsExecLog selectByPrimaryKey(SqlSession sqlSession, String id) {
    	BsExecLogDao dao = sqlSession.getMapper(BsExecLogDao.class);
        return dao.selectByPrimaryKey(id);
    }
    
    public static int insert(SqlSession sqlSession, BsExecLog execLog) {
    	BsExecLogDao dao = sqlSession.getMapper(BsExecLogDao.class);
        return dao.insert(execLog);
    }
    
    /**
    * <p>Description: 批量保存店铺数据</p>
    * @param sqlSession
    * @param bsShopList
    * @return
    * @author liyinglei 
    * @date 2017年10月16日下午7:48:57
     */
	public static int batchInsertShop(SqlSession sqlSession, List<BsShop> bsShopList) {
    	BsShopDao dao = sqlSession.getMapper(BsShopDao.class);
        return dao.batchInsert(bsShopList);
    }
    
    public static List<BsShop> queryShopByList(SqlSession sqlSession, String runDate) throws Exception{
    	BsShopDao dao = sqlSession.getMapper(BsShopDao.class);
    	return dao.queryListByRunDate(runDate);
    }
    
    /**
     * <p>Description: 批量保存店铺与设备关系数据</p>
     * @param sqlSession
     * @param bsDeviceRltList
     * @return
     * @author liyinglei 
     * @date 2017年10月16日下午7:48:57
      */
	public static int batchInsertDeviceRlt(SqlSession sqlSession, List<BsDeviceRlt> bsDeviceRltList) {
		BsDeviceRltDao dao = sqlSession.getMapper(BsDeviceRltDao.class);
		return dao.batchInsert(bsDeviceRltList);
	}
     
	/**
     * <p>Description: 批量保存设备数据</p>
     * @param sqlSession
     * @param bsDeviceList
     * @return
     * @author liyinglei 
     * @date 2017年10月17日上午11:39:17
      */
	public static int batchInsertDevice(SqlSession sqlSession, List<BsDevice> bsDeviceList) {
		BsDeviceDao dao = sqlSession.getMapper(BsDeviceDao.class);
		return dao.batchInsert(bsDeviceList);
	}
	
	/**
     * <p>Description: 批量保存AP设备数据</p>
     * @param sqlSession
     * @param bsDevApList
     * @return
     * @author liyinglei 
     * @date 2017年10月17日上午11:39:17
      */
	public static int batchInsertDevAp(SqlSession sqlSession, List<BsDevAp> bsDevApList) {
		BsDevApDao dao = sqlSession.getMapper(BsDevApDao.class);
		return dao.batchInsert(bsDevApList);
	}
	
	/**
     * <p>Description: 批量保存历史认证数据</p>
     * @param sqlSession
     * @param bsAuthHistoryList
     * @return
     * @author liyinglei 
     * @date 2017年10月17日上午11:39:17
      */
	public static int batchInsertAuthHistory(SqlSession sqlSession, List<BsAuthHistory> bsAuthHistoryList) {
		BsAuthHistoryDao dao = sqlSession.getMapper(BsAuthHistoryDao.class);
		return dao.batchInsert(bsAuthHistoryList);
	}
	
	/**
	* <p>Description: 获取执行日志</p>
	* @param sqlSession
	* @param execLog
	* @return
	* @author liyinglei 
	* @date 2017年10月15日下午11:17:35
	 */
	public static List<BsExecLog> getExecLog(SqlSession sqlSession, BsExecLog execLog) {
		List<BsExecLog> queryByList = SyncBsDataService.queryLogByList(sqlSession, execLog);
		if (queryByList==null || queryByList.size()==0) {
			log.info("没有查到"+execLog.getCode()+ "-" + execLog.getTerm() + "的执行日志");
		}
		return queryByList;
    }

	/**
	* <p>Description: 记录执行日志</p>
	* @throws Exception
	* @author liyinglei 
	* @date 2017年10月15日下午11:13:35
	 */
	public static int saveExecLog(SqlSession sqlSession, BsExecLog execLog) throws Exception {
		return insert(sqlSession, execLog);
	}
	
	public static List<BsShop> queryListByRecentShop(SqlSession sqlSession, String runDate) throws Exception {
		BsShopDao dao = sqlSession.getMapper(BsShopDao.class);
    	return dao.queryListByRecent(runDate);
	}
	
	public static List<BsDeviceRlt> queryListByRecentDeviceRlt(SqlSession sqlSession, String runDate) throws Exception {
		BsDeviceRltDao dao = sqlSession.getMapper(BsDeviceRltDao.class);
    	return dao.queryListByRecent(runDate);
	}
	
	public static List<BsDevice> queryListByRecentDevice(SqlSession sqlSession, String runDate) throws Exception {
		BsDeviceDao dao = sqlSession.getMapper(BsDeviceDao.class);
    	return dao.queryListByRecent(runDate);
	}
	
	public static int deleteShopByRunDate(SqlSession sqlSession, String runDate) throws Exception {
		BsShopDao dao = sqlSession.getMapper(BsShopDao.class);
    	return dao.deleteByRunDate(runDate);
	}
	
	public static int deleteDeviceRltByRunDate(SqlSession sqlSession, String runDate) throws Exception {
		BsDeviceRltDao dao = sqlSession.getMapper(BsDeviceRltDao.class);
    	return dao.deleteByRunDate(runDate);
	}
	
	public static int deleteDeviceByRunDate(SqlSession sqlSession, String runDate) throws Exception {
		BsDeviceDao dao = sqlSession.getMapper(BsDeviceDao.class);
    	return dao.deleteByRunDate(runDate);
	}
	
	public static int deleteDevApByRunDate(SqlSession sqlSession, String runDate) throws Exception {
		BsDevApDao dao = sqlSession.getMapper(BsDevApDao.class);
    	return dao.deleteByRunDate(runDate);
	}
	
	public static int deleteAuthHistoryByRunDate(SqlSession sqlSession, String runDate) throws Exception {
		BsAuthHistoryDao dao = sqlSession.getMapper(BsAuthHistoryDao.class);
    	return dao.deleteByRunDate(runDate);
	}

}

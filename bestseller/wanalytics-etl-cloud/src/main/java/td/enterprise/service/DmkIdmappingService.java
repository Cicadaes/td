package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.dao.DmkIdmappingDao;
import td.enterprise.dao.DmkLogDao;
import td.enterprise.entity.DmkIdmapping;
import td.enterprise.entity.DmkLog;
import td.enterprise.wanalytics.etl.bean.DmkEnum;
import td.enterprise.wanalytics.etl.bean.DmkResponse;
import td.enterprise.wanalytics.etl.common.tdid.TDIDCallable;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 * 查询dmk 日志表统一接口类
 */
public class DmkIdmappingService {
    public static Logger logger = Logger.getLogger(DmkIdmappingService.class);
    public  static DmkIdmapping getByMac(String mac ){
        try{
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            SqlSession sqlSession = sqlSessionFactory.openSession();
            DmkIdmappingDao dao = sqlSession.getMapper(DmkIdmappingDao.class);
            DmkIdmapping idmapping = new DmkIdmapping();
            idmapping.setMac(mac);
            List<DmkIdmapping> list = dao.queryByList(idmapping);
            if(list != null && !list.isEmpty()){
                return list.get(0);
            }
            sqlSession.commit(false);
            sqlSession.close();
        }catch (Exception e){
            logger.error("获取mac失败",e);
        }
        return null;
    }

    public  static void insert(String mac,String tdid,int httpStatus,String dmkCode){
        try{
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            SqlSession sqlSession = sqlSessionFactory.openSession();
            DmkIdmappingDao dao = sqlSession.getMapper(DmkIdmappingDao.class);
            DmkIdmapping idmapping = new DmkIdmapping();
            idmapping.setMac(mac);
            idmapping.setTdid(tdid);
            idmapping.setDmkCode(dmkCode);
            idmapping.setHttpStatus(httpStatus);
            dao.insert(idmapping);
            sqlSession.commit(false);
            sqlSession.close();
       }catch (Exception e){
            logger.error("添加mac tdid失败",e);}
     }

}

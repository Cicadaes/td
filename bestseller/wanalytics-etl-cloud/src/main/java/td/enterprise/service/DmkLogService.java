package td.enterprise.service;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.dao.DmkLogDao;
import td.enterprise.entity.DmkLog;
import td.enterprise.wanalytics.etl.bean.*;
import td.enterprise.wanalytics.etl.util.JacksonMapper;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 查询dmk 日志表统一接口类
 */
public class DmkLogService {
    public static Logger logger = Logger.getLogger(DmkLogService.class);

    public  static DmkLog getLogDataForTag(DmkInputTypeEnum inputType ,String id,DmkEnum dmkEnum ){
        try{
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            SqlSession sqlSession = sqlSessionFactory.openSession();
            DmkLogDao dao = sqlSession.getMapper(DmkLogDao.class);
            DmkLog dmkLog = new DmkLog();
            if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                dmkLog.setMac(id);
            }else {
                dmkLog.setTdid(id);
            }
            dmkLog.setType(dmkEnum.getCode());
            List<DmkLog> list = dao.queryByList(dmkLog);
            if(list != null && !list.isEmpty()){
                return list.get(0);
            }
            sqlSession.commit(false);
            sqlSession.close();
        }catch (Exception e){
            logger.error("获取标签失败",e);
        }
        return null;
    }

    public static  List<DmkLog> getLogDataForPosition(DmkInputTypeEnum inputType ,List<String> idList, String month, DmkEnum dmkEnum){
        List<DmkLog> list  = null;
        try{
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            SqlSession sqlSession = sqlSessionFactory.openSession();
            DmkLogDao dao = sqlSession.getMapper(DmkLogDao.class);
            DmkLog dmkLog = new DmkLog();
            if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                dmkLog.setMacList(idList);
            }else if(DmkInputTypeEnum.TDID.getCode().equals(inputType.getCode())){
                dmkLog.setTdidList(idList);
            }else {
                logger.error("不支持的类型查询：" + DmkInputTypeEnum.MAC);
            }
            dmkLog.setType(dmkEnum.getCode());
            dmkLog.setMonth(month);
            list = dao.batchPositionQuery(dmkLog);//批量查询
            sqlSession.commit(false);
            sqlSession.close();
        }catch (Exception e){
            logger.error("获取位置信息失败",e);
        }
        return list;
    }

    public static  void  insertTagData(DmkInputTypeEnum inputType,String id,DmkEnum dmkEnum ,DmkResponse response){
        try{
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            SqlSession sqlSession = sqlSessionFactory.openSession();
            DmkLogDao dao = sqlSession.getMapper(DmkLogDao.class);
            DmkLog dmkLog = new DmkLog();
            if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                dmkLog.setMac(id);
                String tdid = null;
                //这个地方可以存放tdid
                if(DmkEnum.TAG_DEVICE.getCode().equals(dmkEnum.getCode())){
                    if(StringUtils.isNotBlank(response.getData())){
                        DeviceBean bean = JacksonMapper.getObjectMapper().readValue(response.getData(), DeviceBean.class);
                        if(bean != null && bean.getData() != null){
                           tdid = bean.getTdid();
                        }
                    }
                }else {
                    if(StringUtils.isNotBlank(response.getData())){
                        TagsBean bean = JacksonMapper.getObjectMapper().readValue(response.getData(), TagsBean.class);
                        if(bean != null && bean.getData() != null){
                            tdid = bean.getData().getTdid();
                        }
                    }
                }
                dmkLog.setTdid(tdid);
            }else if(DmkInputTypeEnum.TDID.getCode().equals(inputType.getCode())){
                dmkLog.setTdid(id);
            }else {
                logger.error("不支持的类型查询：" + DmkInputTypeEnum.MAC);
            }
            dmkLog.setType(dmkEnum.getCode());
            dmkLog.setData(response.getData());
            dmkLog.setHttpStatus(response.getHttpStatus() + "");
            dao.insert(dmkLog);
            sqlSession.commit(true);
            sqlSession.close();
        }catch (Exception e){
            logger.error("添加标签失败",e);
        }
    }

    public static  void  insertPositionData(DmkInputTypeEnum inputType,DmkEnum dmkEnum ,String month,List<DmkResponse> responseList,List<String> idList){
        if(null == responseList) {
            return;
        }
        try{
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            SqlSession sqlSession = sqlSessionFactory.openSession();
            DmkLogDao dao = sqlSession.getMapper(DmkLogDao.class);
            List<DmkLog> list = new ArrayList<>();
            for(int i=0;i<responseList.size(); i++){
                DmkLog dmkLog = new DmkLog();
                DmkResponse response = responseList.get(i);
                if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                    dmkLog.setMac(idList.get(i));
                    String data = response.getData();
                    if(data != null ){
                        PositionBean bean = JacksonMapper.getObjectMapper().readValue(data, PositionBean.class);
                        if(bean.getData() != null && bean.getData() != null){
                            dmkLog.setTdid(bean.getData().getTdid());
                        }
                    }
                }else if(DmkInputTypeEnum.TDID.getCode().equals(inputType.getCode())){
                    dmkLog.setTdid(idList.get(i));
                }else {
                    logger.error("不支持的类型查询：" + DmkInputTypeEnum.MAC);
                }
                dmkLog.setType(dmkEnum.getCode());
                dmkLog.setData(response.getData());
                dmkLog.setMonth(month);
                dmkLog.setHttpStatus(response.getHttpStatus() + "");
                list.add(dmkLog);
            }
            if(list.size() > 0){
                dao.batchInsert(list);
            }
            sqlSession.commit(true);
            sqlSession.close();
        }catch (Exception e){
            logger.error("添加位置信息失败",e);
        }
    }
}

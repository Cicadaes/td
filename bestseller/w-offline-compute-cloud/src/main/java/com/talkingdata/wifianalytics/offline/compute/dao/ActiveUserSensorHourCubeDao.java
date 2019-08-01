package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.BitmapSensorHourCube;
import com.talkingdata.wifianalytics.offline.compute.dao.params.QueryParamsUtil;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;
import org.apache.log4j.Logger;
/**
 * junmin.li
 */
public class ActiveUserSensorHourCubeDao {

    private static Logger logger = Logger.getLogger(ActiveUserSensorHourCubeDao.class);

    public List<BitmapSensorHourCube> query(String tenant_id, int project_id,
                                              int place_id, int sensor_id, String start, String end) {
        final Map<String, Object> params = QueryParamsUtil.buildParams(tenant_id, project_id, place_id, sensor_id, start, end);

        return DaoHelper.doSql(new Function<SqlSession, List<BitmapSensorHourCube>>() {
            @Override
            public List<BitmapSensorHourCube> apply(SqlSession sqlSession) {
                return sqlSession.selectList("ActiveUserSensorHourCubeMapper.query", params);
            }
        });
    }
}

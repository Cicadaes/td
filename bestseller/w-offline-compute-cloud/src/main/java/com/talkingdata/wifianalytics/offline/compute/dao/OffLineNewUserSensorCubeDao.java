package com.talkingdata.wifianalytics.offline.compute.dao;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapSensorCube;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;
import org.apache.ibatis.session.SqlSession;

import java.util.List;

/**
 * Created by loong on 4/27/16.
 */
public class OffLineNewUserSensorCubeDao {
    public boolean insert(final List<OffLineBitmapSensorCube> offLineBitmapSensorCubes) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
            	if(null != offLineBitmapSensorCubes && offLineBitmapSensorCubes.isEmpty() == false){
                   return sqlSession.insert("OffLineNewUserSensorDayCubeMapper.insert", offLineBitmapSensorCubes) > 0;
            	}
            	return true;
            }
        });
    }
}

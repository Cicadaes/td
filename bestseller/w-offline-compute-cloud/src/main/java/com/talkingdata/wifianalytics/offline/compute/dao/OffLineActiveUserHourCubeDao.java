package com.talkingdata.wifianalytics.offline.compute.dao;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapHourCube;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;
import org.apache.ibatis.session.SqlSession;

import java.util.List;

/**
 * Created by loong on 4/27/16.
 */
public class OffLineActiveUserHourCubeDao {
    public boolean insert(final List<OffLineBitmapHourCube> offLineBitmapHourCubes) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
            	if(null != offLineBitmapHourCubes && offLineBitmapHourCubes.isEmpty() == false){
                   return sqlSession.insert("OffLineActiveUserHourCubeMapper.insert", offLineBitmapHourCubes) > 0;
            	}
            	return true;
            }
        });
    }
}

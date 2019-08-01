package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineNewUserSensorDayCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 探针到访老客
 * @author junmin.li
 *
 */
public class OffLineNewUserSensorDayCounterDao {

    public boolean insert(final List<OffLineNewUserSensorDayCounter> list) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                return sqlSession.insert("OffLineNewUserSensorDayCounterMapper.insert", list) > 0;
            }
        });
    }
}

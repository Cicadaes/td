package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineActiveUserSensorHourCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 探针每小时到访
 * @author junmin.li
 *
 */
public class OffLineActiveUserSensorHourCounterDao {

    public boolean insert(final List<OffLineActiveUserSensorHourCounter> list) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                return sqlSession.insert("OfflineActiveUserSensorHourCounterMapper.insert", list) > 0;
            }
        });
    }
}

package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineActiveUserHourCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 每小时到访用户 
 * @author junmin.li
 *
 */
public class OffLineActiveUserHourCounterDao {

    public boolean insert(final List<OffLineActiveUserHourCounter> offLineActiveUserHourCounters) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                return sqlSession.insert("OffLineActiveUserHourCounterMapper.insert", offLineActiveUserHourCounters) > 0;
            }
        });
    }
}

package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineOldUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 到访老客
 * @author junmin.li
 *
 */
public class OffLineOldUserDayCounterDao {

    public boolean insert(final List<OffLineOldUserDayCounter> offLineOldUserDayCounters) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                return sqlSession.insert("OffLineOldUserDayCounterMapper.insert", offLineOldUserDayCounters) > 0;
            }
        });
    }
}

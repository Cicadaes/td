package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineNewUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 到访老客
 * @author junmin.li
 *
 */
public class OffLineNewUserDayCounterDao {

    public boolean insert(final List<OffLineNewUserDayCounter> offLineActiveNewUserDayCounters) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                return sqlSession.insert("OffLineNewUserDayCounterMapper.insert", offLineActiveNewUserDayCounters) > 0;
            }
        });
    }
}

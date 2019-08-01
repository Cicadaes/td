package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineActiveUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 
 * @author junmin.li
 *
 */
public class OffLineActiveUserCounterDao {

    public boolean insert(final List<OffLineActiveUserDayCounter> OffLineActiveUserDayCounters) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                int c = sqlSession.insert("OffLineActiveUserDayCounterMapper.insert", OffLineActiveUserDayCounters);
                return  c > 0;
            }
        });
    }
}

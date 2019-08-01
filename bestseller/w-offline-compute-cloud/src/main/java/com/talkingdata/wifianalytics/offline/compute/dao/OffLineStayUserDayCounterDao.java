package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineStayUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 
 * @author WEI
 *
 */
public class OffLineStayUserDayCounterDao {

    public boolean insert(final List<OffLineStayUserDayCounter> offLineStayUserDayCounters) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                return sqlSession.insert("OffLineStayUserDayCounterMapper.insert", offLineStayUserDayCounters) > 0;
            }
        });
    }
}

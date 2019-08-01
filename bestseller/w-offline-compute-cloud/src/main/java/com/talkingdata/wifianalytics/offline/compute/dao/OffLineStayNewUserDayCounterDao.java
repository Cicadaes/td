package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 停留新客counter
 * @author lijunmin
 *
 */
public class OffLineStayNewUserDayCounterDao {

    public boolean insert(final List<OffLineUserDayCounter> offLineUserDayCounters) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
                return sqlSession.insert("OffLineStayNewUserDayCounterMapper.insert", offLineUserDayCounters) > 0;
            }
        });
    }

}

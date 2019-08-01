package com.talkingdata.wifianalytics.offline.compute.factory;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.dbsource.MysqlSourceFactory;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

/**
 * Created by xiaolong on 2015/9/24.
 */
public class DaoHelper {
    private static Logger logger = Logger.getLogger(DaoHelper.class);

    public static SqlSession getSqlSession(boolean autoCommit) {
        return MysqlSourceFactory.getSqlSessionFactory().openSession(autoCommit);
    }


    public static <T> T doSql(Function<SqlSession, T> action, boolean autoCommit) {
        SqlSession session = null;
        try {
            session = getSqlSession(autoCommit);
            return action.apply(session);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("发生错误:",e);
        } finally {
            if (session != null) {
                if (!autoCommit) {
                    session.commit();
                }
                session.close();
            }
        }
        return null;
    }

    public static <T> T doSql(Function<SqlSession, T> action) {
        return doSql(action, true);
    }

}

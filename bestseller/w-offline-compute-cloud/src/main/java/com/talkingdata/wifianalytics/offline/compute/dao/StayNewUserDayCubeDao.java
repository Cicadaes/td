package com.talkingdata.wifianalytics.offline.compute.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.dao.params.QueryParamsUtil;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;

/**
 * 停留老客
 * @author junmin.li
 *
 */
public class StayNewUserDayCubeDao {

    public List<BitmapDayCube> query(String tenant_id, int project_id, String start, String end) {
        final Map<String, Object> params = QueryParamsUtil.buildParams(tenant_id, project_id, start, end);

        return DaoHelper.doSql(new Function<SqlSession, List<BitmapDayCube>>() {
            @Override
            public List<BitmapDayCube> apply(SqlSession sqlSession) {
                return sqlSession.selectList("StayNewUserDayCubeMapper.query", params);
            }
        });
    }


}

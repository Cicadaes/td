package com.talkingdata.wifianalytics.offline.compute.dao;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.dao.params.QueryParamsUtil;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;
import org.apache.ibatis.session.SqlSession;

import java.util.List;
import java.util.Map;

/**
 * Created by loong on 4/26/16.
 */
public class OldUserDayCubeDao {


    public List<BitmapDayCube> query(String tenant_id, int project_id, String start, String end) {
        final Map<String, Object> params = QueryParamsUtil.buildParams(tenant_id, project_id, start, end);

        return DaoHelper.doSql(new Function<SqlSession, List<BitmapDayCube>>() {
            @Override
            public List<BitmapDayCube> apply(SqlSession sqlSession) {
                return sqlSession.selectList("OldUserDayCubeMapper.query", params);
            }
        });
    }


}

package com.talkingdata.wifianalytics.offline.compute.dao;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.BitmapHourCube;
import com.talkingdata.wifianalytics.offline.compute.dao.params.QueryParamsUtil;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;
import org.apache.ibatis.session.SqlSession;

import java.util.List;
import java.util.Map;

/**
 * Created by loong on 4/26/16.
 */
public class ActiveUserHourCubeDao {


    public List<BitmapHourCube> query(String tenant_id, int project_id, String start, String end) {
        final Map<String, Object> params = QueryParamsUtil.buildParams(tenant_id, project_id, start, end);

        return DaoHelper.doSql(new Function<SqlSession, List<BitmapHourCube>>() {
            @Override
            public List<BitmapHourCube> apply(SqlSession sqlSession) {
                return sqlSession.selectList("ActiveUserHourCubeMapper.query", params);
            }
        });
    }


}

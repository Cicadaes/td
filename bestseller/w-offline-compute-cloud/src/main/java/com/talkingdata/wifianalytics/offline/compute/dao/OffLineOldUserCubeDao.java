package com.talkingdata.wifianalytics.offline.compute.dao;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.dao.params.QueryParamsUtil;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;
import org.apache.ibatis.session.SqlSession;

import java.util.List;
import java.util.Map;

/**
 * Created by loong on 4/27/16.
 */
public class OffLineOldUserCubeDao implements OffLineDayCubeDao {
    @Override
    public boolean insert(final List<OffLineBitmapDayCube> offLineBitmapDayCubes) {
        return DaoHelper.doSql(new Function<SqlSession, Boolean>() {
            @Override
            public Boolean apply(SqlSession sqlSession) {
            	if(null != offLineBitmapDayCubes && offLineBitmapDayCubes.isEmpty() == false){
            		 return sqlSession.insert("OffLineOldUserDayCubeMapper.insert", offLineBitmapDayCubes) > 0;
           	    }
                return true;
            }
        });
    }

    @Override
    public OffLineBitmapDayCube query(String tenant_id, int project_id, String date, int data_type) {
        final Map<String, Object> params = QueryParamsUtil.buildParams(tenant_id, project_id, date, data_type);
        return DaoHelper.doSql(new Function<SqlSession, OffLineBitmapDayCube>() {
            @Override
            public OffLineBitmapDayCube apply(SqlSession sqlSession) {
                return sqlSession.selectOne("OffLineOldUserDayCubeMapper.query", params);
            }
        });
    }
}

package com.talkingdata.wifianalytics.offline.compute.dao;

import com.google.common.base.Function;
import com.talkingdata.wifianalytics.offline.compute.bean.TenantImportUserCube;
import com.talkingdata.wifianalytics.offline.compute.dao.params.QueryParamsUtil;
import com.talkingdata.wifianalytics.offline.compute.factory.DaoHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by loong on 4/28/16.
 */
public class TenantImportUserCubeDao {

    public TenantImportUserCube query(String tenant_id, int project_id, int crowd_id) {
        final Map<String, Object> params = new HashMap<String, Object>();
        if (StringUtils.isNotBlank(tenant_id)) {
            params.put(QueryParamsUtil.TENANT_ID, tenant_id);
        }
        if (project_id > 0) {
            params.put(QueryParamsUtil.PROJECT_ID, project_id);
        }
        if (crowd_id > 0) {
            params.put(QueryParamsUtil.CROWD_ID, crowd_id);
        }
        return DaoHelper.doSql(new Function<SqlSession, TenantImportUserCube>() {
            @Override
            public TenantImportUserCube apply(SqlSession sqlSession) {
                return sqlSession.selectOne("TenantImportUserCubeMapper.query", params);
            }
        });
    }
}

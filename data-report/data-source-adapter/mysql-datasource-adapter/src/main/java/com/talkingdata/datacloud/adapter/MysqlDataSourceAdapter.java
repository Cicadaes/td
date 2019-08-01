package com.talkingdata.datacloud.adapter;

import com.talkingdata.datacloud.adapter.common.AbstractMysqlAdapter;
import com.talkingdata.datacloud.adapter.common.JdbcBean;
import com.talkingdata.datacloud.adapter.entity.DataPreviewPage;
import com.talkingdata.datacloud.adapter.util.DataBaseUtil;
import com.talkingdata.datacloud.visual.util.Msg;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Ocean on 2017/4/11.
 */
public class MysqlDataSourceAdapter extends AbstractMysqlAdapter {
    private static final Logger logger = LoggerFactory.getLogger(MysqlDataSourceAdapter.class);

    /**
     * 获取元数据属性
     *
     * @param
     * @return
     */
    @Override
    public List<Map<String,Object>> viewMetadataPropertiesList(String dataSourceConnectionInfo,String dataSourceSql) {
        JdbcBean jdbcBean=JdbcBean.getJdbcBean(dataSourceConnectionInfo,dataSourceSql,DIRVERCLASSNAME);
        if(!dataSourceSql.toUpperCase().contains("FROM")){
            dataSourceSql=getQuerySQL(jdbcBean,0);
        }else{
            dataSourceSql+=" LIMIT 0";
        }
        List<Map<String, Object>> res = DataBaseUtil.queryAllMetaData(jdbcBean, dataSourceSql);
        return res;
    }

    @Override
    public Map<String, Object> viewDataSourceDataList(DataPreviewPage dataPreviewPage) {
        JdbcBean jdbcBean=JdbcBean.getJdbcBean(dataPreviewPage.getDataSourceConnectionInfo(),dataPreviewPage.getQuerySql(),DIRVERCLASSNAME);
        String querySql = getQuerySQL(jdbcBean, dataPreviewPage.getPager().getOrderCondition(), dataPreviewPage.getMysqlQueryCondition());
        List<Map<String, Object>> res;
        try {
            res=DataBaseUtil.queryForListThrowException(jdbcBean, querySql);
        }catch (DataAccessException e) {
            logger.error(e.getMessage());
            if (StringUtils.containsIgnoreCase(querySql, "delete") || StringUtils.containsIgnoreCase(querySql, "update")
                    || StringUtils.containsIgnoreCase(querySql, "alter") || StringUtils.containsIgnoreCase(querySql, "drop")
                    || StringUtils.containsIgnoreCase(querySql, "truncate") || StringUtils.containsIgnoreCase(querySql, "insert")
                    ) {
                return Msg.getFailureMessage("请输入正确的查询SQL语句");
            }
            return Msg.getFailureMessage("SQL语句语法不正确:"+e.getCause().getMessage());
        }catch (Exception e){
            return Msg.getFailureMessage("数据源连接错误");
        }
        Map<String, Object> result= Msg.getSuccessData(res);
        result.put("msg","SQL语句语法正确");
        return result;
    }

    @Override
    public List<String> viewDimensionList(String dataSourceConnectionInfo,String dataSourceSql) {
        JdbcBean jdbcBean=JdbcBean.getJdbcBean(dataSourceConnectionInfo,dataSourceSql,DIRVERCLASSNAME);
        String querySql=getQuerySQL(jdbcBean,0);
        List<Integer> columnTypeList = new ArrayList<>();
        columnTypeList.add(Types.BIT);
        columnTypeList.add(Types.TINYINT);
        columnTypeList.add(Types.SMALLINT);
        columnTypeList.add(Types.INTEGER);
        columnTypeList.add(Types.BIGINT);
        columnTypeList.add(Types.FLOAT);
        columnTypeList.add(Types.REAL);
        columnTypeList.add(Types.DOUBLE);
        columnTypeList.add(Types.NUMERIC);
        columnTypeList.add(Types.DECIMAL);
        return DataBaseUtil.querySomeMetaData(jdbcBean, querySql,columnTypeList,false);
    }

    @Override
    public List<String> viewDateDimensionList(String dataSourceConnectionInfo,String dataSourceSql) {
        JdbcBean jdbcBean=JdbcBean.getJdbcBean(dataSourceConnectionInfo,dataSourceSql,DIRVERCLASSNAME);
        String querySql=getQuerySQL(jdbcBean,0);
        List<Integer> columnTypeList = new ArrayList<>();
        columnTypeList.add(Types.DATE);
        columnTypeList.add(Types.TIME);
        columnTypeList.add(Types.TIMESTAMP);
        return DataBaseUtil.querySomeMetaData(jdbcBean, querySql,columnTypeList,true);
    }

    @Override
    public List<String> viewMetricList(String dataSourceConnectionInfo,String dataSourceSql) {
        JdbcBean jdbcBean=JdbcBean.getJdbcBean(dataSourceConnectionInfo,dataSourceSql,DIRVERCLASSNAME);
        String querySql=getQuerySQL(jdbcBean,0);
        List<Integer> columnTypeList = new ArrayList<>();
        columnTypeList.add(Types.BIT);
        columnTypeList.add(Types.TINYINT);
        columnTypeList.add(Types.SMALLINT);
        columnTypeList.add(Types.INTEGER);
        columnTypeList.add(Types.BIGINT);
        columnTypeList.add(Types.FLOAT);
        columnTypeList.add(Types.REAL);
        columnTypeList.add(Types.DOUBLE);
        columnTypeList.add(Types.NUMERIC);
        columnTypeList.add(Types.DECIMAL);
        return DataBaseUtil.querySomeMetaData(jdbcBean, querySql,columnTypeList,true);
    }

    private String getQuerySQL(JdbcBean jdbcBean,int limit){
        return getQuerySQL(jdbcBean,null,"limit "+limit);
    }


    private String getQuerySQL(JdbcBean jdbcBean,String orderCondition,String limitCondition) {
        String sql=jdbcBean.getTableName();
        StringBuilder sqlSb = new StringBuilder();
        if (sql.endsWith(";")) {
            sql = sql.substring(0, sql.length() -1);
        }
        sql = sql.replace("\\`", "`"); // 在jdbc执行时候，sql中的`这个符号不能转义，否则报错
        sqlSb.append("SELECT * FROM " + sql + " AS temp");


        if(StringUtils.isNotEmpty(orderCondition)){
            sqlSb.append(" "+orderCondition);
        }
        if(StringUtils.isNotEmpty(limitCondition)){
            sqlSb.append(" "+limitCondition);
        }
        return sqlSb.toString();
    }

}

package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.ApplicationContextManager;
import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.DataSourceMetadataDao;
import com.talkingdata.datacloud.visual.entity.report.DataSourceMetadata;
import com.talkingdata.datacloud.visual.page.report.DataSourceMetadataPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE_METADATA DataSourceMetadataService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("dataSourceMetadataService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DataSourceMetadataService extends BaseService<DataSourceMetadata, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceMetadataService.class);

    @Autowired
    private DataSourceMetadataDao dao;

    public DataSourceMetadataDao getDao() {
        return dao;
    }

    public Map<String, Object> getOrgnization(String orgTable, String orgUserIdColName, String orgUserIdValue){
        DataSource dataSource= ApplicationContextManager.getBean(DataSource.class);
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSource);
        String querySql="SELECT * FROM "+orgTable+" WHERE "+orgUserIdColName+" = '"+orgUserIdValue+"'";
        try{
            List<Map<String, Object>>resultMapList = jdbcTemplate.queryForList(querySql);
            if(resultMapList.size()==0){
                return null;
            }else{
                return resultMapList.get(0);
            }
        }catch (DataAccessException e){
            logger.error("查询语句："+querySql+"查询报错");
            return null;
        }
    }


    public List<DataSourceMetadata> getMetricList(Integer dataSourceId){
        DataSourceMetadataPage dataSourceMetadataPage=new DataSourceMetadataPage();
        dataSourceMetadataPage.setDataSourceId(dataSourceId);
        dataSourceMetadataPage.setAnalyticType(0);
        return dao.queryByList(dataSourceMetadataPage);
    }
    public List<DataSourceMetadata> getAllDimentsionList(Integer dataSourceId){
        DataSourceMetadataPage dataSourceMetadataPage=new DataSourceMetadataPage();
        dataSourceMetadataPage.setDataSourceId(dataSourceId);
        dataSourceMetadataPage.setAnalyticType(1);
        dataSourceMetadataPage.setAnalyticTypeOperator(">=");
        return dao.queryByList(dataSourceMetadataPage);
    }
    public List<DataSourceMetadata> getDateDimensionList(Integer dataSourceId){
        DataSourceMetadataPage dataSourceMetadataPage=new DataSourceMetadataPage();
        dataSourceMetadataPage.setDataSourceId(dataSourceId);
        dataSourceMetadataPage.setAnalyticType(2);
        return dao.queryByList(dataSourceMetadataPage);
    }

}

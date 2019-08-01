package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.DataSourceDao;
import com.talkingdata.datacloud.visual.entity.report.DataSource;
import com.talkingdata.datacloud.visual.entity.report.DataSourceConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE DataSourceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("dataSourceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DataSourceService extends BaseService<DataSource, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceService.class);

    @Autowired
    private DataSourceDao dao;
    @Autowired
    private DataSourceConnectionService dataSourceConnectionService;

    public DataSourceDao getDao() {
        return dao;
    }
    //通过dataSourceId查询dataSource、dataSourceConnection和Adapter信息，待优化
    public DataSource queryDataSourceConnectionByPrimaryKey(Integer id) throws Exception{
        DataSource dataSource=dao.selectByPrimaryKey(id);
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(dataSource.getDataSourceConnectionId());
        dataSource.setDataSourceConnection(dataSourceConnection);
        return dataSource;
    }
    //通过dataSourceId查询dataSource、dataSourceConnection和Adapter信息，待优化
    public DataSource queryAdapterByPrimaryKey(Integer id) throws Exception{
        DataSource dataSource=dao.selectByPrimaryKey(id);
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.queryAdapterByPrimaryKey(dataSource.getDataSourceConnectionId());
        dataSource.setDataSourceConnection(dataSourceConnection);
        return dataSource;
    }


    public List<DataSource> queryDataSourceByReportId(Integer reportId)throws Exception{
        List<DataSource> dataSourceList=dao.queryDataSourceByReportId(reportId);
        for(DataSource dataSource:dataSourceList){
            DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(dataSource.getDataSourceConnectionId());
            dataSource.setDataSourceConnection(dataSourceConnection);
        }
        return dataSourceList;
    }

}

package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.visual.entity.report.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.DataSourceSnapshotDao;
import com.talkingdata.datacloud.visual.entity.report.DataSourceSnapshot;
import com.talkingdata.datacloud.visual.entity.report.DataSourceSnapshotKey;

import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE_SNAPSHOT DataSourceSnapshotService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-31 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("dataSourceSnapshotService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DataSourceSnapshotService extends BaseService<DataSourceSnapshot, DataSourceSnapshotKey> {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceSnapshotService.class);

    @Autowired
    private DataSourceSnapshotDao dao;

    public DataSourceSnapshotDao getDao() {
        return dao;
    }

    @Autowired
    private DataSourceService dataSourceService;

    public void makeDataSourceSnapshot(int reportId)throws Exception{
        int count=dao.insertByReportId(reportId);
//        List<DataSource> dataSourceList = dataSourceService.queryDataSourceByReportId(reportId);
//        for(DataSource dataSource:dataSourceList){
//            DataSourceSnapshot dataSourceSnapshot=new DataSourceSnapshot();
//            dataSourceSnapshot.setReportId(reportId);
//            dataSourceSnapshot.setDataSourceId(dataSource.getId());
//            dataSourceSnapshot.setName(dataSource.getName());
//            dataSourceSnapshot.setMappedDataSource(dataSource.getMappedDataSource());
//            dataSourceSnapshot.setDescription(dataSource.getDescription());
//            dataSourceSnapshot.setParams(dataSource.getDataSourceConnection().getParams());
//            dataSourceSnapshot.setAdapterId(dataSource.getDataSourceConnection().getAdapterId());
//            dao.insert(dataSourceSnapshot);
//        }
    }
    public int deleteDataSourceSnapshotByreportId(int reportId)throws Exception{
        int count=dao.deleteDataSourceSnapshotByreportId(reportId);
        return count;
    }
}

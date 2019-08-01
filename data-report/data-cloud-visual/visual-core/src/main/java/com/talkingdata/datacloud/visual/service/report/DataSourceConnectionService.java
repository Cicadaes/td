package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.AdapterDao;
import com.talkingdata.datacloud.visual.dao.report.DataSourceConnectionDao;
import com.talkingdata.datacloud.visual.entity.report.Adapter;
import com.talkingdata.datacloud.visual.entity.report.DataSourceConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE_INFO DataSourceConnectionService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("dataSourceConnectionService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DataSourceConnectionService extends BaseService<DataSourceConnection, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConnectionService.class);

    @Autowired
    private DataSourceConnectionDao dao;
    @Autowired
    private AdapterDao adapterDao;

    public DataSourceConnectionDao getDao() {
        return dao;
    }
    //通过dataSourceConnectionId查询dataSourceConnection和Adapter信息，待优化
    public DataSourceConnection queryAdapterByPrimaryKey(Integer id){
        DataSourceConnection dataSourceConnection=dao.selectByPrimaryKey(id);
        Adapter adapter = adapterDao.selectByPrimaryKey(dataSourceConnection.getAdapterId());
        dataSourceConnection.setAdapter(adapter);
        dataSourceConnection.setAdapterName(adapter.getName());
        return dataSourceConnection;
    }

}

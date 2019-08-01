package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.DataDownloadConstants;
import com.talkingdata.marketing.core.dao.campaign.DataDownloadDao;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.DataDownload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_DATA_DOWNLOAD DataDownloadService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-06-05 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("dataDownloadService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DataDownloadService extends BaseService<DataDownload, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(DataDownloadService.class);

    @Autowired private DataDownloadDao dao;

    @Override public DataDownloadDao getDao() {
        return dao;
    }

    public List<DataDownload> getDataDownloadList(List<Integer> statusList) {
        return dao.getDataDownloadList(statusList);
    }

    public DataDownload buildDataDownload(Integer taskId, Crowd crowd) {
        DataDownload dataDownload = new DataDownload();

        dataDownload.setTaskId(taskId);
        dataDownload.setRefId(crowd.getRefId());
        dataDownload.setRefName(crowd.getRefName());
        dataDownload.setStatus(DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_WAITING);
        dataDownload.setTenantId(crowd.getTenantId());
        dataDownload.setCreateTime(new Date());
        return dataDownload;
    }
}

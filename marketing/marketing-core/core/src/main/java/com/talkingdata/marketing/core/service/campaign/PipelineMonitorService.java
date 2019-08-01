package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.dto.PipelineMonitorDto;
import com.talkingdata.marketing.core.page.campaign.PipelineMonitorPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.PipelineMonitorDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineMonitor;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_MONITOR PipelineMonitorService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-08 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineMonitorService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineMonitorService extends BaseService<PipelineMonitor, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineMonitorService.class);

    @Autowired
    private PipelineMonitorDao dao;

    @Override
    public PipelineMonitorDao getDao() {
        return dao;
    }

    public PipelineMonitorDto findMetricValueByPipelineId(Integer pipelineId) throws Exception {
        PipelineMonitorPage page = new PipelineMonitorPage();
        page.setPageSize(Integer.MAX_VALUE);
        page.setPipelineId(pipelineId.toString());
        List<PipelineMonitor> pipelineMonitorList = getDao().queryByList(page);
        PipelineMonitorDto pipelineMonitorDto = new PipelineMonitorDto(pipelineMonitorList);
        return pipelineMonitorDto;
    }

}

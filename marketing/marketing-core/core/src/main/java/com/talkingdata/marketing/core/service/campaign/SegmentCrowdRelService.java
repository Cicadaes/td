package com.talkingdata.marketing.core.service.campaign;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.SegmentCrowdRelDao;
import com.talkingdata.marketing.core.entity.campaign.SegmentCrowdRel;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_SEGMENT_CROWD_REL SegmentCrowdRelService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-05 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("segmentCrowdRelService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SegmentCrowdRelService extends BaseService<SegmentCrowdRel, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SegmentCrowdRelService.class);

    @Autowired
    private SegmentCrowdRelDao dao;

    @Override
    public SegmentCrowdRelDao getDao() {
        return dao;
    }

}

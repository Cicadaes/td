package com.talkingdata.datacloud.visual.service.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.AdapterAttachmentDao;
import com.talkingdata.datacloud.visual.entity.report.AdapterAttachment;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_ADAPTER_ATTACHMENT AdapterAttachmentService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("adapterAttachmentService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AdapterAttachmentService extends BaseService<AdapterAttachment, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(AdapterAttachmentService.class);

    @Autowired
    private AdapterAttachmentDao dao;

    public AdapterAttachmentDao getDao() {
        return dao;
    }

}

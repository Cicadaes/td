package com.talkingdata.marketing.core.service.admin;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.EmailSendJobInputDao;
import com.talkingdata.marketing.core.entity.admin.EmailSendJobInput;
import org.springframework.util.Assert;

import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_EMAIL_SEND_JOB_INPUT EmailSendJobInputService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("emailSendJobInputService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class EmailSendJobInputService extends BaseService<EmailSendJobInput, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(EmailSendJobInputService.class);

    @Autowired
    private EmailSendJobInputDao dao;

    @Override
    public EmailSendJobInputDao getDao() {
        return dao;
    }

    /**
     *
     * @return status=1的记录
     */
    public List<EmailSendJobInput> findValid(){
        return dao.findValid();
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

}

package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.AttachmentDao;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.util.FileUtil;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_ATTACHMENT AttachmentService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 * @author armeng
 */
@Service("attachmentService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AttachmentService extends BaseService<Attachment, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(AttachmentService.class);

    @Autowired
    private AttachmentDao dao;

    @Override
    public AttachmentDao getDao() {
        return dao;
    }

    public String getContentByRefId(Integer refId) throws Exception {
        String content = null;
        Attachment attachment = dao.selectByCrowdId(refId);
        if (null != attachment && StringUtils.isNotBlank(attachment.getPath())) {
            String filePath = attachment.getPath();
            try(InputStream in = new FileInputStream(filePath)) {
                content = new String(FileUtil.removeUTF8BOM(IOUtils.toByteArray(in)), StandardCharsets.UTF_8);
            }
        }
        return content;
    }

    public File getFileById(Integer id) throws Exception {
        File file = null;
        Attachment attachment = dao.selectByPrimaryKey(id);
        if (null != attachment && StringUtils.isNotBlank(attachment.getPath())) {
            String filePath = attachment.getPath();
            file = new File(filePath);
            if (!file.exists()) {
                logger.error("文件不存在或者已经被清理.filePath={}",filePath);
                throw new MktException("文件不存在或已被清理.");
            }
        }
        return file;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    public Attachment getByCrowdId(Integer crowdId) throws Exception {
        return dao.selectByCrowdId(crowdId);
    }
}

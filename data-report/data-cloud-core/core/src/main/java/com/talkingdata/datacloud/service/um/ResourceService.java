package com.talkingdata.datacloud.service.um;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.um.ResourceDao;
import com.talkingdata.datacloud.entity.um.Resource;


/**
 *
 * <br>
 * <b>功能：</b>UM_RESOURCE ResourceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("resourceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ResourceService extends BaseService<Resource, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(ResourceService.class);

    @Autowired
    private ResourceDao dao;

    public ResourceDao getDao() {
        return dao;
    }

}

package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.marketing.core.page.admin.ChannelDefinitionPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.ChannelDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_CHANNEL_DEFINITION ChannelDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("channelDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ChannelDefinitionService extends BaseService<ChannelDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(ChannelDefinitionService.class);

    @Autowired
    private ChannelDefinitionDao dao;

    @Override
    public ChannelDefinitionDao getDao() {
        return dao;
    }

    public Map<Integer, ChannelDefinition> loadChannelDefinition() {
        ChannelDefinitionPage page = new ChannelDefinitionPage();
        page.getPager().setPageEnabled(false);
        Map<Integer, ChannelDefinition> channelDefinitionMap = new HashMap(16);
        List<ChannelDefinition> channelDefinitionList = getDao().queryByList(page);
        for (ChannelDefinition channelDefinition:channelDefinitionList) {
            channelDefinitionMap.put(channelDefinition.getId(), channelDefinition);
        }
        return channelDefinitionMap;

    }

}

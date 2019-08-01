package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.CampaignTargetCubeItem;
import com.talkingdata.marketing.core.middleware.UserCloudApi;
import com.talkingdata.marketing.core.page.admin.EffectIndexDefinitionPage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.EffectIndexDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.EffectIndexDefinition;
import org.springframework.util.Assert;

import java.util.*;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_EFFECT_INDEX_DEFINITION EffectIndexDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("effectIndexDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class EffectIndexDefinitionService extends BaseService<EffectIndexDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(EffectIndexDefinitionService.class);

    @Autowired
    private EffectIndexDefinitionDao dao;

    @Override
    public EffectIndexDefinitionDao getDao() {
        return dao;
    }

    @Autowired
    private UserCloudApi userCloudApi;

    public List<EffectIndexDefinition> findNewDefinitions(String tenantId) throws Exception {
        List<EffectIndexDefinition> oldEffectIndexDefinitions = getOldDefinition(tenantId);
        List<EffectIndexDefinition> totalEffectIndexDefinitions = getTotalDefinition(tenantId);
        List<EffectIndexDefinition> result = getNewDefinition(oldEffectIndexDefinitions, totalEffectIndexDefinitions);
        return result;
    }

    private List<EffectIndexDefinition> getNewDefinition(List<EffectIndexDefinition> old,
                      List<EffectIndexDefinition> total) throws Exception {
        if(old.isEmpty() || total.isEmpty()) {
            return total;
        }
        for (int i = total.size() - 1; i >= 0; i--) {
            EffectIndexDefinition t = total.get(i);
            for (EffectIndexDefinition index : old) {
                if(index.getIndexId().equals(t.getIndexId())) {
                    total.remove(i);
                    break;
                }
            }
        }
        return total;

    }

    private List<EffectIndexDefinition> getTotalDefinition(String tenantId) throws Exception {
        List<EffectIndexDefinition> result = parse(userCloudApi.getCampaignTargetCube(tenantId));
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private List<EffectIndexDefinition> parse(List<CampaignTargetCubeItem> campaignTargetCubeItems) throws Exception {
        List<EffectIndexDefinition> result = new ArrayList<>();
        for (CampaignTargetCubeItem item : campaignTargetCubeItems) {
            result.add(getInstance(item));
        }
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private EffectIndexDefinition getInstance(CampaignTargetCubeItem item) throws Exception {
        EffectIndexDefinition effectIndexDefinition = new EffectIndexDefinition();
        effectIndexDefinition.setIndexId(item.getCubeId());
        effectIndexDefinition.setName(item.getCubeName());
        effectIndexDefinition.setTenantId(item.getTenantId());
        effectIndexDefinition.setCode(item.getCubeCode());
        return effectIndexDefinition;
    }

    private List<EffectIndexDefinition> getOldDefinition(String tenantId) throws Exception {
        EffectIndexDefinitionPage page = new EffectIndexDefinitionPage();
        page.setTenantId(tenantId);
        page.setPageSize(Constant.QUERY_PAGE_SIZE);
        List<EffectIndexDefinition> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    /**
     * 1001-1004分别表示：概览图，折线图，柱状图，饼状图。
     * 后续确认使用次功能后改为枚举类型
     */
    public Map<Integer, List<EffectIndexDefinition>> getOwnDefinitions(String tenantId) throws Exception {
        Map<Integer, List<EffectIndexDefinition>> result = new HashMap<>(16);

        List<EffectIndexDefinition> list = getOldDefinition(tenantId);
        if (list.isEmpty()) {
            return Collections.EMPTY_MAP;
        }

        List<EffectIndexDefinition> overview = new ArrayList<>();
        List<EffectIndexDefinition> line = new ArrayList<>();
        List<EffectIndexDefinition> histogram = new ArrayList<>();
        List<EffectIndexDefinition> pie = new ArrayList<>();

        for (EffectIndexDefinition instance :list) {
            if (1001 == instance.getType()) {
                overview.add(instance);
            }
            if (1002 == instance.getType()) {
                line.add(instance);
            }
            if (1003 == instance.getType()) {
                histogram.add(instance);
            }
            if (1004 == instance.getType()) {
                pie.add(instance);
            }
        }

        result.put(1001, overview);
        result.put(1002, line);
        result.put(1003, histogram);
        result.put(1004, pie);
        return result;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

}

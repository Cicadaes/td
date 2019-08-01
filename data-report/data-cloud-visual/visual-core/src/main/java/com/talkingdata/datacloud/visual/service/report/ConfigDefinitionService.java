package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.ConfigDefinitionDao;
import com.talkingdata.datacloud.visual.dao.report.ConfigDefinitionFieldDao;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionField;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionFieldPage;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_CONFIG_DEFINITION ConfigDefinitionService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("configDefinitionService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ConfigDefinitionService extends BaseService<ConfigDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(ConfigDefinitionService.class);

    @Autowired
    private ConfigDefinitionDao dao;
    @Autowired
    private ConfigDefinitionFieldDao configDefinitionFieldDao;

    public ConfigDefinitionDao getDao() {
        return dao;
    }

    public List<ConfigDefinition> queryByType(Integer type){
        ConfigDefinitionPage configDefinitionPage=new ConfigDefinitionPage();
        configDefinitionPage.setType(type);
        configDefinitionPage.setPageSize(100);
        configDefinitionPage.setOrderBy("order_num");
        List<ConfigDefinition> configDefinitionList= getDao().queryByList(configDefinitionPage);

        for(ConfigDefinition configDefinition:configDefinitionList){
            List<ConfigDefinitionField> configDefinitionFieldList=queryFieldByConfigDefinitionId(configDefinition.getId(),null);
            configDefinition.setConfigDefinitionFieldList(configDefinitionFieldList);
        }

        return configDefinitionList;
    }
//    @Cacheable(value="configDefinitionGroup",key="\"configDefinitionGroup_\"+#groupId")
    public List<ConfigDefinition> queryByGroupId(Integer groupId){
        ConfigDefinitionPage configDefinitionPage=new ConfigDefinitionPage();
        configDefinitionPage.setGroupId(groupId);
        configDefinitionPage.setPageSize(100);
        configDefinitionPage.setOrderBy("order_num");
        List<ConfigDefinition> configDefinitionList= getDao().queryByList(configDefinitionPage);

        for(ConfigDefinition configDefinition:configDefinitionList){
            List<ConfigDefinitionField> configDefinitionFieldList=queryFieldByConfigDefinitionId(configDefinition.getId(),null);
            configDefinition.setConfigDefinitionFieldList(configDefinitionFieldList);
        }

        return configDefinitionList;
    }

    public ConfigDefinition queryById(Integer id){
        ConfigDefinition configDefinition= getDao().selectByPrimaryKey(id);
        List<ConfigDefinitionField> configDefinitionFieldList=queryFieldByConfigDefinitionId(id,null);

        configDefinition.setConfigDefinitionFieldList(configDefinitionFieldList);
        return configDefinition;
    }
    /**
     * 通过AdapterId查询TD_DC_CONFIG_DEFINITION
     * @param AdapterId
     * @return ConfigDefinition
     * @throws
     */
    public ConfigDefinition queryByAdapterId(Integer AdapterId){
        ConfigDefinition configDefinition= getDao().queryByAdapterId(AdapterId);
        List<ConfigDefinitionField> configDefinitionFieldList=queryFieldByConfigDefinitionId(configDefinition.getId(),null);

        configDefinition.setConfigDefinitionFieldList(configDefinitionFieldList);
        return configDefinition;
    }

    private List<ConfigDefinitionField> queryFieldByConfigDefinitionId(Integer configDefinitionId,Integer parentId){

        List<ConfigDefinitionField> configDefinitionFieldList=null;
        if(parentId==null)
            configDefinitionFieldList=configDefinitionFieldDao.queryRootFieldByConfigDefinitionId(configDefinitionId);
        else {
            ConfigDefinitionFieldPage configDefinitionFieldPage = new ConfigDefinitionFieldPage();
            configDefinitionFieldPage.setConfigDefinitionId(configDefinitionId);
            configDefinitionFieldPage.setParentId(parentId);
            configDefinitionFieldPage.setPageSize(100);
            configDefinitionFieldList = configDefinitionFieldDao.queryByList(configDefinitionFieldPage);
        }
        for(ConfigDefinitionField configDefinitionField:configDefinitionFieldList){
            List<ConfigDefinitionField> childFieldList=queryFieldByConfigDefinitionId(configDefinitionId,configDefinitionField.getId());
            if(childFieldList.size()==0)continue;
            configDefinitionField.setChildFieldList(childFieldList);
        }
        return  configDefinitionFieldList;
    }

    public int insertDefinition(ConfigDefinition configDefinition){
        int result=dao.insert(configDefinition);
        insertFieldList(configDefinition.getId(),null,configDefinition.getConfigDefinitionFieldList());
        return result;
    }

    public int updateDefinition(ConfigDefinition configDefinition){
        int count=dao.updateByPrimaryKey(configDefinition);
        configDefinitionFieldDao.deleteByConfigDefinitionId(configDefinition.getId());
        insertFieldList(configDefinition.getId(),null,configDefinition.getConfigDefinitionFieldList());
        return count;
    }

    private void insertFieldList(Integer configDefinitionId,Integer parentFieldId,List<ConfigDefinitionField> configDefinitionFieldList){
        for(ConfigDefinitionField configDefinitionField:configDefinitionFieldList) {
            configDefinitionField.setConfigDefinitionId(configDefinitionId);
            configDefinitionField.setParentId(parentFieldId);
            configDefinitionFieldDao.insert(configDefinitionField);
            insertFieldList(configDefinitionId, configDefinitionField.getId(), configDefinitionField.getChildFieldList());
        }
    }
}

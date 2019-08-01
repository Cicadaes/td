package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.AdapterAttachmentDao;
import com.talkingdata.datacloud.visual.dao.report.AdapterDao;
import com.talkingdata.datacloud.visual.dao.report.ConfigDefinitionDao;
import com.talkingdata.datacloud.visual.dao.report.ConfigDefinitionFieldDao;
import com.talkingdata.datacloud.visual.entity.report.Adapter;
import com.talkingdata.datacloud.visual.entity.report.AdapterAttachment;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionField;
import com.talkingdata.datacloud.visual.page.report.AdapterAttachmentPage;
import com.talkingdata.datacloud.visual.page.report.AdapterPage;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_ADAPTER AdapterService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("adapterService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AdapterService extends BaseService<Adapter, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(AdapterService.class);

    @Autowired
    private AdapterDao dao;
    @Autowired
    private AdapterAttachmentDao adapterAttachmentDao;
    @Autowired
    private ConfigDefinitionDao configDefinitionDao;
    @Autowired
    private ConfigDefinitionFieldDao configDefinitionFieldDao;

    public AdapterDao getDao() {
        return dao;
    }

    public boolean saveAdapterAndDataSourceConfigDefinition(Adapter adapter, ConfigDefinition dataSourceConfigDefinition)throws Exception{
        //保存adapter的渲染面板
        int apapterCount=saveConfigDefinition(adapter.getConfigDefinition());
        //保存dataSource的渲染面板
        int dataSourceCount=saveConfigDefinition(dataSourceConfigDefinition);
        if(apapterCount==1&&dataSourceCount==1){
            adapter.setConfigDefinitionId(adapter.getConfigDefinition().getId());
            adapter.setDataDefinitionId(dataSourceConfigDefinition.getId());
            //删除旧信息
            AdapterPage adapterPage=new AdapterPage();
            adapterPage.setConfigDefinitionId(adapter.getConfigDefinitionId());
            Adapter oldAdapter=queryBySingle(adapterPage);
            if(oldAdapter!=null){
                adapter.setId(oldAdapter.getId());
                adapterAttachmentDao.deleteByConfigDefinitionId(adapter.getConfigDefinitionId());
                dao.updateByPrimaryKey(adapter);
            }else{
                dao.insert(adapter);
            }

            adapter.getMainAttachment().setAdapterId(adapter.getId());
            saveAdapterAttachment(adapter.getMainAttachment());
        }

        return true;
    }

    private int saveAdapterAttachment(AdapterAttachment adapterAttachment){
        int count=adapterAttachmentDao.insert(adapterAttachment);
        if(count==1){
            for(AdapterAttachment dependencyAttachment:adapterAttachment.getDependencyAttachmentList()){
                dependencyAttachment.setAdapterId(adapterAttachment.getAdapterId());
                dependencyAttachment.setParentId(adapterAttachment.getId());
                saveAdapterAttachment(dependencyAttachment);
            }
        }
        return count;
    }

    private int saveConfigDefinition(ConfigDefinition configDefinition)throws Exception{
        //删除旧信息
        ConfigDefinitionPage configDefinitionPage=new ConfigDefinitionPage();
        configDefinitionPage.setName(configDefinition.getName());
        List<ConfigDefinition> configDefinitionList=configDefinitionDao.queryByList(configDefinitionPage);
        int count;
        if(configDefinitionList.size()>0){
            configDefinition.setId(configDefinitionList.get(0).getId());
            count=configDefinitionDao.updateByPrimaryKey(configDefinition);
            configDefinitionFieldDao.deleteByConfigDefinitionId(configDefinition.getId());
        }else{
            for(int i=1;i<configDefinitionList.size();i++){
                ConfigDefinition oldConfigDefinition=configDefinitionList.get(i);
                configDefinitionDao.deleteByPrimaryKey(oldConfigDefinition.getId());
                configDefinitionFieldDao.deleteByConfigDefinitionId(oldConfigDefinition.getId());
            }
            count=configDefinitionDao.insert(configDefinition);
        }

        if(count==1){
            saveConfigDefinitionFieldList(configDefinition.getConfigDefinitionFieldList(),configDefinition.getId(),null);
        }
        return count;
    }

    private void saveConfigDefinitionFieldList(List<ConfigDefinitionField> configDefinitionFieldList,Integer configDefinitionId,Integer parentId)throws Exception{
        for(ConfigDefinitionField configDefinitionField:configDefinitionFieldList){
            configDefinitionField.setConfigDefinitionId(configDefinitionId);
            configDefinitionField.setParentId(parentId);
            configDefinitionFieldDao.insert(configDefinitionField);
            saveConfigDefinitionFieldList(configDefinitionField.getChildFieldList(),configDefinitionId,configDefinitionField.getId());
        }
    }


    /**
     * 通过AdapterID查询
     * @param adapterId
     * @return ConfigDefinition
     * @throws
     */
    public Adapter selectAdapterAndAttachment(Integer adapterId)throws Exception{
        Adapter adapter= getDao().selectByPrimaryKey(adapterId);
        //查询主Jar包
        AdapterAttachmentPage adapterAttachmentPage=new AdapterAttachmentPage();
        adapterAttachmentPage.setAdapterId(adapterId);
        adapterAttachmentPage.setType(1);

        List<AdapterAttachment> adapterAttachmentList=adapterAttachmentDao.queryByList(adapterAttachmentPage);
        AdapterAttachment mainAttachment=adapterAttachmentList.get(0);
        adapter.setMainAttachment(mainAttachment);
        //查询依赖包
        adapterAttachmentPage.setAdapterId(adapterId);
        adapterAttachmentPage.setType(2);
        adapterAttachmentPage.setParentId(mainAttachment.getId());
        List<AdapterAttachment> dependencyAttachmentList=adapterAttachmentDao.queryByList(adapterAttachmentPage);
        mainAttachment.setDependencyAttachmentList(dependencyAttachmentList);

        return adapter;
    }
}

package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.marketing.core.entity.admin.InputDataOption;
import com.talkingdata.marketing.core.page.admin.InputDataOptionPage;
import com.talkingdata.marketing.core.page.admin.InputDataSchemaPage;
import com.talkingdata.marketing.core.page.dto.InputDataSchemaDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.InputDataSchemaDao;
import com.talkingdata.marketing.core.entity.admin.InputDataSchema;

import java.util.*;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_INPUT_DATA_SCHEMA InputDataSchemaService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("inputDataSchemaService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class InputDataSchemaService extends BaseService<InputDataSchema, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(InputDataSchemaService.class);

    @Autowired
    private InputDataSchemaDao dao;

    @Autowired
    private InputDataOptionService inputDataOptionService;

    @Override
    public InputDataSchemaDao getDao() {
        return dao;
    }

    /**
     * 检索当前租户配置的维度数据
     * @param tenantId 租户
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<InputDataSchema> findByTenantId(String tenantId) throws Exception {
        InputDataSchemaPage page = new InputDataSchemaPage();
        page.setTenantId(tenantId);
        page.setPageSize(Integer.MAX_VALUE);
        List<InputDataSchema> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public List<InputDataSchemaDto> getDataSchemaList() throws Exception {
        Map<Integer, List<InputDataOption>> dataOptionMap = loadAndBuildDataOptionMap();
        List<InputDataSchema> schemaList = loadDataSchema();
        List<InputDataSchemaDto> schemaDtoList = new ArrayList();
        for (InputDataSchema schema : schemaList) {
            InputDataSchemaDto schemaDto = new InputDataSchemaDto();
            BeanUtils.copyProperties(schema, schemaDto);
            List<InputDataOption> inputDataOptionList = dataOptionMap.get(schema.getId());
            if (inputDataOptionList != null) {
                schemaDto.setInputDataOptionList(inputDataOptionList);
            }
            schemaDtoList.add(schemaDto);
        }
        return schemaDtoList;
    }

    private Map<Integer, List<InputDataOption>> loadAndBuildDataOptionMap() throws Exception{
        Map<Integer, List<InputDataOption>> dataOptionMap = new HashMap(16);
        List<InputDataOption> dataOptionList = loadDataOption();
        for (InputDataOption dataOption : dataOptionList) {
            List<InputDataOption> optionList = dataOptionMap.get(dataOption.getSchemaId());
            if (optionList == null) {
                optionList = new ArrayList();
            }
            optionList.add(dataOption);
            dataOptionMap.put(dataOption.getSchemaId(), optionList);
        }
        return dataOptionMap;
    }

    private List<InputDataSchema> loadDataSchema() throws Exception {
        InputDataSchemaPage page = new InputDataSchemaPage();
        page.setPageSize(Integer.MAX_VALUE);
        return getDao().queryByList(page);
    }

    private List<InputDataOption> loadDataOption() throws Exception{
        InputDataOptionPage page = new InputDataOptionPage();
        page.setPageSize(Integer.MAX_VALUE);
        return inputDataOptionService.queryByList(page);
    }

}

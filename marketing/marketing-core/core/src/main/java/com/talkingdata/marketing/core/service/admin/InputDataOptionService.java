package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.page.admin.InputDataOptionPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.InputDataOptionDao;
import com.talkingdata.marketing.core.entity.admin.InputDataOption;

import java.util.Collections;
import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_INPUT_DATA_OPTION InputDataOptionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("inputDataOptionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class InputDataOptionService extends BaseService<InputDataOption, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(InputDataOptionService.class);

    @Autowired
    private InputDataOptionDao dao;

    @Override
    public InputDataOptionDao getDao() {
        return dao;
    }

    /**
     * 检查Schema对应的Option
     * @param schemaId Schema的ID
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<InputDataOption> findBySchemaId(Integer schemaId) throws Exception {
        InputDataOptionPage page = new InputDataOptionPage();
        page.setSchemaId(String.valueOf(schemaId));
        page.setPageSize(Constant.QUERY_PAGE_SIZE);
        List<InputDataOption> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

}

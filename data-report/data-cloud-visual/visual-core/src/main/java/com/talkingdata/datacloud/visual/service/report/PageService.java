package com.talkingdata.datacloud.visual.service.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.PageDao;
import com.talkingdata.datacloud.visual.entity.report.Page;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_PAGE CustomPageService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pageService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PageService extends BaseService<Page, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PageService.class);

    @Autowired
    private PageDao dao;

    public PageDao getDao() {
        return dao;
    }

}

package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ProjectAppTypesDao;
import td.enterprise.entity.ProjectAppTypes;

/**
 * <br>
 * <b>功能：</b>项目APP分类表 ProjectAppTypesService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-01 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectAppTypesService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectAppTypesService extends BaseService<ProjectAppTypes> {
    public final static Logger logger = Logger.getLogger(ProjectAppTypesService.class);

    @Autowired
    private ProjectAppTypesDao dao;

    public ProjectAppTypesDao getDao() {
        return dao;
    }
}

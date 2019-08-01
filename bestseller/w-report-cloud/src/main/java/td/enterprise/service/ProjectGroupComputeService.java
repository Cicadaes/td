package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ProjectGroupComputeDao;
import td.enterprise.entity.ProjectGroupCompute;

/**
 * <br>
 * <b>功能：</b>项目店组计算配置 ProjectGroupComputeService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectGroupComputeService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectGroupComputeService extends BaseService<ProjectGroupCompute> {
    public final static Logger logger = Logger.getLogger(ProjectGroupComputeService.class);

    @Autowired
    private ProjectGroupComputeDao dao;

    public ProjectGroupComputeDao getDao() {
        return dao;
    }
}

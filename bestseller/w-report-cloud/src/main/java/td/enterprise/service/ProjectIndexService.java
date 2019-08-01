package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ProjectIndexDao;
import td.enterprise.entity.ProjectIndex;
import td.enterprise.page.ProjectIndexPage;
import td.enterprise.web.vm.ProjectIndexVM;

import java.util.List;


/**
 * <br>
 * <b>功能：</b>项目指标 ProjectIndexService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectIndexService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectIndexService extends BaseService<ProjectIndex> {
    public final static Logger logger = Logger.getLogger(ProjectIndexService.class);

    @Autowired
    private ProjectIndexDao dao;

    public ProjectIndexDao getDao() {
        return dao;
    }

    public List<ProjectIndex> queryListByOrder(ProjectIndexPage page) {
        Integer rowCount = dao.queryListByOrderCount(page);
        page.getPager().setRowCount(rowCount);
        return dao.queryListByOrder(page);
    }

    public List<ProjectIndexVM> queryByListWithUserRelation(ProjectIndexPage page){
        Integer rowCount = dao.queryByListWithUserRelationCount(page);
        page.getPager().setRowCount(rowCount);
        List<ProjectIndexVM> projectIndexVMS = dao.queryByListWithUserRelation(page);
        return projectIndexVMS;
    }

    public int queryByListWithUserRelationCount(ProjectIndexPage page){
        return dao.queryByListWithUserRelationCount(page);
    }

}

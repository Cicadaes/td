package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ProjectRelationDao;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.page.ProjectRelationPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目关系表 ProjectRelationService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectRelationService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectRelationService extends BaseService<ProjectRelation> {
    public final static Logger logger = Logger.getLogger(ProjectRelationService.class);

    @Autowired
    private ProjectRelationDao dao;

    public ProjectRelationDao getDao() {
        return dao;
    }

    // public List<ProjectRelation> queryChildrenProject(String projectParentId) {
    //     return dao.queryChildrenProject(projectParentId);
    // }

    public boolean deleteByParentId(ProjectRelationPage page) {
        return dao.deleteByParentId(page);
    }

    public boolean deleteByChildId(String id) {
        return dao.deleteByChildId(id);
    }

    public List<ProjectRelation> getAllProjectRelations(ProjectRelationPage page) {
        return dao.getAllProjectRelations(page);
    }

    public List<String> getAllTopParentProjectIds(ProjectRelationPage page) {
        return dao.getAllTopParentProjectIds(page);
    }

}

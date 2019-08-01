package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.ProjectUserRelationDao;
import td.enterprise.entity.ProjectUserRelation;
import td.enterprise.page.ProjectUserRelationPage;
import td.enterprise.page.mapper.ProjectUserRelationMapper;
import td.enterprise.web.util.UserInfoUtil;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>用户项目关系表 ProjectUserRelationService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectUserRelationService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectUserRelationService extends BaseService<ProjectUserRelation> {
    public final static Logger logger = Logger.getLogger(ProjectUserRelationService.class);

    @Autowired
    private ProjectUserRelationDao dao;
    @Autowired
    private ProjectUserRelationMapper projectUserRelationMapper;

    private final static String DEFULT_INDEX = "group&picture&all";

    public ProjectUserRelationDao getDao() {
        return dao;
    }

    /**
     * 校验并自增创建
     *
     * @param projectUserRelation
     * @return
     * @throws Exception
     */
    public ProjectUserRelation create(ProjectUserRelation projectUserRelation) throws Exception {
        User user = UserInfoUtil.getUser();
        String umid = user.getUmid();
        projectUserRelation.setLogin(umid);

        //校验该用户项目此类是否已存在
        ProjectUserRelationPage page = new ProjectUserRelationPage();
        page.setLogin(projectUserRelation.getLogin());
        page.setProjectId(projectUserRelation.getProjectId());
        page.setType(projectUserRelation.getType());
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);

        List<ProjectUserRelation> projectUserRelations = dao.queryByList(page);
        //更新
        if (null != projectUserRelations && projectUserRelations.size() == 1) {
            //更新
            projectUserRelation = projectUserRelations.get(0);
            projectUserRelation = update(projectUserRelation);
            return projectUserRelation;
        }

        //删除
        if (null != projectUserRelations && projectUserRelations.size() > 1) {

            for (ProjectUserRelation pur : projectUserRelations) {
                dao.deleteByPrimaryKey(pur.getId());
            }
        }

        //添加
        projectUserRelation = setMaxOrderIndex(projectUserRelation);

        projectUserRelation.setCreateBy(umid);
        projectUserRelation.setCreator(user.getName());
        dao.insert(projectUserRelation);

        return projectUserRelation;
    }

    /**
     * 自增更新
     *
     * @param projectUserRelation
     * @return
     * @throws Exception
     */
    public ProjectUserRelation update(ProjectUserRelation projectUserRelation) throws Exception {
        if (!projectUserRelation.getType().equals(ReportConstants.ProjectUserRelationType.INDEX)) {
            projectUserRelation = setMaxOrderIndex(projectUserRelation);
        }

        User user = UserInfoUtil.getUser();
        String umid = user.getUmid();
        projectUserRelation.setLogin(umid);
        projectUserRelation.setUpdateBy(umid);
        projectUserRelation.setUpdater(user.getName());
        dao.updateByPrimaryKeySelective(projectUserRelation);
        return projectUserRelation;
    }

    /**
     * 赋予该用户项目此类行最大orderIndex
     *
     * @param projectUserRelation
     * @return
     * @throws Exception
     */
    private ProjectUserRelation setMaxOrderIndex(ProjectUserRelation projectUserRelation) throws Exception {

        //查询该用户项目此类行最大orderIndex
        ProjectUserRelation userRelation = new ProjectUserRelation();
        userRelation.setLogin(projectUserRelation.getLogin());
        userRelation.setType(projectUserRelation.getType());
        Integer maxOrderIndex = dao.queryMaxOrderIndex(userRelation);
        if (maxOrderIndex == null) {
            maxOrderIndex = 0;
        }
        //设置最大值
        projectUserRelation.setOrderIndex(maxOrderIndex + 1);

        return projectUserRelation;
    }

    /**
     * 按顺序查找用户设置
     *
     * @param page
     * @return
     */
//    public List<ProjectUserRelation> queryListByOrder(ProjectUserRelationPage page) {
//        return dao.queryListByOrder(page);
//    }

    /**
     * 查找莫个用户的一个历史页面记录
     *
     * @param page
     * @return
     * @throws Exception
     */
    public ProjectUserRelation queryForIndex(ProjectUserRelationPage page) throws Exception {
        ProjectUserRelation projectUserRelation = projectUserRelationMapper.projectUserRelationPageToProjectUserRelation(page);

//        page.setLogin(UserInfoUtil.getUser().getUmid());
//        List<ProjectUserRelation> rows = queryByList(page);
//
//        //若为页面，赋予默认值
//        if (page.getType().equals(ReportConstants.ProjectUserRelationType.INDEX)) {
//            if (null == rows || rows.size() != 1) {
//                if (null != rows && rows.size() > 1) {
//                    for (ProjectUserRelation pur : rows) {
//                        dao.deleteByPrimaryKey(pur.getId());
//                    }
//                }
//                projectUserRelation.setProjectId(DEFULT_INDEX);//默认值
//                projectUserRelation.setOrderIndex(0);
////				User user = UserInfoUtil.getUser();
////				projectUserRelation.setCreateBy(user.getUmid());
////				projectUserRelation.setCreator(user.getName());
//                dao.insert(projectUserRelation);
//            } else {
//                projectUserRelation = rows.get(0);
//            }
//        }
        return projectUserRelation;
    }

    // author :youyu.dong
    // 针对绫致项目 收藏功能只有最爱一种，即 type=1 ,不存在别的情况,故点击五角星时是切换功能，在最爱和非最爱之间切换
    // 对应的数据库操作为增加一条或删除一条，返回的是字符串添加成功或删除成功，传入的是 项目id
    public ProjectUserRelation  switchFavorite(ProjectUserRelation projectUserRelation) throws Exception {
        User user = UserInfoUtil.getUser();
        projectUserRelation.setLogin(user.getUmid());
        projectUserRelation.setType(1);

        //检查该用户是否已经添加该项目为最爱
        ProjectUserRelationPage page = new ProjectUserRelationPage();
        page.setLogin(projectUserRelation.getLogin());
        page.setProjectId(projectUserRelation.getProjectId());
        page.setType(projectUserRelation.getType());
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);

        List<ProjectUserRelation> projectUserRelations = dao.queryByList(page);

        //删除
        if (null != projectUserRelations && projectUserRelations.size() > 1) {

            for (ProjectUserRelation pur : projectUserRelations) {
                dao.deleteByPrimaryKey(pur.getId());

                pur.setType(-1);
                return pur;
            }

        }else{
            //添加
            projectUserRelation = setMaxOrderIndex(projectUserRelation);

            projectUserRelation.setCreateBy(user.getUmid());
            projectUserRelation.setCreator(user.getName());
            dao.insert(projectUserRelation);
            return projectUserRelation;
        }
        return null;
    }
}


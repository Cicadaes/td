package td.enterprise.wanalytics.etl.task.group;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.entity.ProjectRelation;
import td.enterprise.service.ProjectRelationService;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

@Slf4j
public class ProjectRelationUtils {
    private static SqlSession sqlSession;

    static {
        try {
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            sqlSession = sqlSessionFactory.openSession();
        } catch (Exception e) {
            log.error("ProjectRelationUtils init Error:", e);
        }
    }

    /**
     * 根据parentParjectId获取所有根节点
     * @param parentProjectId
     * @return
     *
     */
    public static List<String> getRootProjectIdList(int parentProjectId) {
        List<String> rootProjectIdList = new ArrayList<>();
        if (parentProjectId == -1) {
            rootProjectIdList = getAllTopParentProjectIds();
        } else {
            rootProjectIdList.add(String.valueOf(parentProjectId));
        }
        return rootProjectIdList;
    }

    /**
     * 获取所有根结点
     * @return
     */
    private static List<String> getAllTopParentProjectIds() {
        long start = System.currentTimeMillis();
        List<String> parentProjectIds = ProjectRelationService.getAllTopParentProjectIds(sqlSession, new ProjectRelation());
        long end = System.currentTimeMillis();
        log.info("getAllTopParentProjectIds size:{},spend time:{}", parentProjectIds.size(), (end - start) + " Minlls");
        return parentProjectIds;
    }

    /**
     * 获取所有店铺的关系
     * @return
     */
    public static List<ProjectRelation> getAllProjectRelations() {
        long start = System.currentTimeMillis();
        List<ProjectRelation> projectRelations = ProjectRelationService.getAllProjectRelations(sqlSession, new ProjectRelation());
        long end = System.currentTimeMillis();
        log.info("getAllProjectRelations size:{},spend time:{}", projectRelations.size(), (end - start) + " Minlls");
        return projectRelations;
    }
}

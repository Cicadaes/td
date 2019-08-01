/**
 * Created by Yan on 2017/5/8.
 */

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.dao.ProjectRelationDao;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import org.apache.commons.collections.map.ListOrderedMap;
@Slf4j
public class TestMyBatis {
    static SqlSessionFactory sqlSessionFactory = null;
    static {
        sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
    }

    public static void main(String[] args) {
        //testGet();
        String t = "imi's";
        t = t.replaceAll("'","");
        t = t.replaceAll("‘","");
        log.info(t);
    }


    public static void testGet() {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        try {
            ProjectRelationDao projectRelationDao = sqlSession.getMapper(ProjectRelationDao.class);
            ProjectRelation projectRelation = (ProjectRelation)projectRelationDao.selectByPrimaryKey(5);
            log.info("project_id: " + projectRelation.getProjectId() + "parent_id: "
                    + projectRelation.getProjectParentId());
        } finally {
            sqlSession.close();
        }
    }
}
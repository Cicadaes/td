package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.ProjectAttributeDao;
import td.enterprise.entity.ProjectAttribute;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目属性表 ProjectAttributeService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ProjectAttributeService {

	public static ProjectAttribute queryBySingle(SqlSession sqlSession, ProjectAttribute projectAttribute) {
		ProjectAttributeDao dao = sqlSession.getMapper(ProjectAttributeDao.class);
		List <ProjectAttribute> projectAttributes = dao.queryByList(projectAttribute);
		return null == projectAttributes || projectAttributes.size() == 0 ? null : projectAttributes.get(0);
	}

}

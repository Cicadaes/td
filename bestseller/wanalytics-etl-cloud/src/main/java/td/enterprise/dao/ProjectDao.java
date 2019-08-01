package td.enterprise.dao;


import java.util.List;

import td.enterprise.entity.Project;

/**
 * <br>
 * <b>功能：</b>项目 ProjectDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ProjectDao extends BaseDao<Project> {
 List<String> findProjectNumByType(List<Integer> types);

 List<Integer> findProjectIdsByType(List<Integer> types);
 
 List<Project> findProjectsByType(List<Integer> types);
}


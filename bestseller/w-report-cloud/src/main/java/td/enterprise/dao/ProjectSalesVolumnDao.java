package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ProjectSalesVolumn;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目销售额 ProjectSalesVolumnDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectSalesVolumnDao extends BaseDao<ProjectSalesVolumn> {

    void updateValue(ProjectSalesVolumn projectSalesVolumn);

    List<ProjectSalesVolumn> queryByListRoll(ProjectSalesVolumn projectSalesVolumn);

}

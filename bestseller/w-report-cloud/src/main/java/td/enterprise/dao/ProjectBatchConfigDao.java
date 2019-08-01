package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ProjectBatchConfig;
import td.enterprise.page.ProjectBatchConfigPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>批量设置 ProjectBatchConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectBatchConfigDao extends BaseDao<ProjectBatchConfig> {

    int updateByProjectId(ProjectBatchConfig projectBatchConfig);

    List<ProjectBatchConfig> queryByListWithProjectIds(ProjectBatchConfigPage page);

    int queryByListWithProjectIdsCount(ProjectBatchConfigPage page);

}

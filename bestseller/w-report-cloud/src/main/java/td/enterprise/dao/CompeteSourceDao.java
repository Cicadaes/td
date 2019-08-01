package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.CompeteSource;
import td.enterprise.page.CompeteSourcePage;

/**
 * <br>
 * <b>功能：</b>竞品数据源表 CompeteSourceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface CompeteSourceDao extends BaseDao<CompeteSource> {

    String queryDataSources(CompeteSourcePage sourcePage);

    int updateById(CompeteSource competeSource);
}

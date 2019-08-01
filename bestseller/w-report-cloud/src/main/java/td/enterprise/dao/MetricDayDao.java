package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.MetricDay;
import td.enterprise.page.MetricDayPage;
import td.enterprise.web.vm.MetricDayVM;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>排行榜表 MetricDayDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-22 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface MetricDayDao extends BaseDao<MetricDay> {
    List<MetricDayVM> queryByListWithChain(MetricDayPage page);

    List<MetricDayVM> queryByListWithChainFavorite(MetricDayPage page);

    int queryByCountWithChain(MetricDayPage page);
}

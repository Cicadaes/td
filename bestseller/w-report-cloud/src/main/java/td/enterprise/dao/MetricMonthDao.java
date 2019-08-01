package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.MetricMonth;
import td.enterprise.page.MetricDayPage;
import td.enterprise.web.vm.MetricDayVM;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricMonthDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-09 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface MetricMonthDao extends BaseDao<MetricMonth> {
    List<MetricDayVM> queryByListWithChain(MetricDayPage page);

    List<MetricDayVM> queryByListWithChainFavorite(MetricDayPage page);

    int queryByCountWithChain(MetricDayPage page);
}

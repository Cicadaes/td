package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.BehaviorCrowdResult;
import td.enterprise.page.BehaviorCrowdResultPage;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>自定义行为客群计算结果表 BehaviorCrowdResultDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface BehaviorCrowdResultDao extends BaseDao<BehaviorCrowdResult> {
    List<BehaviorCrowdResult> selectByCodesIn(Map params);

    List<BehaviorCrowdResult> selectForRadar(Map params);

    int selectForRadarPeopleNum(Map params);

    BehaviorCrowdResult queryLatestRow(BehaviorCrowdResultPage page);
}

package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.BehaviorCrowdResultDevice;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>自定义行为客群-人群消费结果表 BehaviorCrowdResultDeviceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface BehaviorCrowdResultDeviceDao extends BaseDao<BehaviorCrowdResultDevice> {
    List<BehaviorCrowdResultDevice> selectByCodesIn(Map params);
}

package td.enterprise.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import td.enterprise.entity.Threshold;
import td.enterprise.page.ThresholdPage;
import td.enterprise.web.vm.ThresholdVM;

/**
 * <br>
 * <b>功能：</b>阈值表 ThresholdDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ThresholdDao extends BaseDao<Threshold> {
	List<ThresholdVM> queryThresholdByList(ThresholdPage page);
	List<ThresholdVM> queryThresholdByProjectIds(Map<String,Object> param);
}

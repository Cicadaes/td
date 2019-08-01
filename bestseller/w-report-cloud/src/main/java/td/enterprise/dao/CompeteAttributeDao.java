package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.CompeteAttribute;

/**
 * <br>
 * <b>功能：</b>竞品项目属性 CompeteAttributeDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-01 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface CompeteAttributeDao extends BaseDao<CompeteAttribute> {

    int deleteByCompeteId(String competeId);

    int updateById(CompeteAttribute competeAttribute);
}

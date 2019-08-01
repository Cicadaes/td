package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.AppTypes;

/**
 * <br>
 * <b>功能：</b>APP分类表 AppTypesDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-01 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface AppTypesDao extends BaseDao<AppTypes> {
    void cleanData();
}

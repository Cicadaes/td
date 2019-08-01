package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.AppWhiteList;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>App白名单 AppWhiteListDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface AppWhiteListDao extends BaseDao<AppWhiteList> {
    List<AppWhiteList> queryExist(AppWhiteList appWhiteList);
}

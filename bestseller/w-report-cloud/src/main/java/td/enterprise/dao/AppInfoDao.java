package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.AppInfo;

/**
 * <br>
 * <b>功能：</b>App清单数据 AppInfoDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface AppInfoDao extends BaseDao<AppInfo> {
    /**
     * 根据apphash和platform 查询app 信息
     *
     * @param appInfo
     * @return
     */
    AppInfo queryAppInfo(AppInfo appInfo);
}

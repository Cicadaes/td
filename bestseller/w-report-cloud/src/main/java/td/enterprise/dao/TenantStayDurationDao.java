package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TenantStayDuration;
import td.enterprise.page.TenantStayDurationPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目新老客停留时长 TenantStayDurationDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TenantStayDurationDao extends BaseDao<TenantStayDuration> {

    void batchDeleteByProjectAndDate(TenantStayDurationPage page);

    void batchSelectAndInsert(TenantStayDurationPage page);

    List<TenantStayDuration> queryList(TenantStayDurationPage page);

}

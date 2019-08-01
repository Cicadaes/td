package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ChangeLog;
import td.enterprise.page.ChangeLogPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>变更历史表 ChangeLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ChangeLogDao extends BaseDao<ChangeLog> {

    List<ChangeLog> queryByUpdateDescList(ChangeLogPage page);

}

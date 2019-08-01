package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TargetManagement;
import td.enterprise.page.BasePage;
import td.enterprise.page.TargetManagementPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>目标管理 TargetManagementDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TargetManagementDao extends BaseDao<TargetManagement> {

    List<TargetManagement> queryByNotFinishList(TargetManagementPage page);

    List<TargetManagement> queryByNotFinishListDesc(TargetManagementPage page);

    int queryByNotFinishListDescCount(BasePage page);

    List<TargetManagement> queryFinishList(TargetManagementPage page);

    int queryFinishListCount(BasePage page);

    Integer querybiggerIndex(TargetManagementPage page);

}

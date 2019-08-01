package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.InstallInfo;
import td.enterprise.entity.Project;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.web.vm.InstallInfoWithInfoVM;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>安装归属表 InstallInfoDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface InstallInfoDao extends BaseDao<InstallInfo> {

    List <InstallInfoWithInfoVM> queryByListWithInfo(InstallInfoPage page);

    List <InstallInfoWithInfoVM> queryByListSensor4Shop(InstallInfoPage page);

    void cleanInstallOfShop(Project project);

    int getCount4JudgeUpdatePermissions(Object object);

}

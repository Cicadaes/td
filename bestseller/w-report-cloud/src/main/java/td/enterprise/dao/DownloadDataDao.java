package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.DownloadData;
import td.enterprise.page.DownloadDataPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>数据下载 DownloadDataDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface DownloadDataDao extends BaseDao<DownloadData> {

    List<DownloadData> queryNeedRun(DownloadDataPage downloadDataPage);

    Integer selectbiggersequence();

    List<DownloadData> queryByprojectList(DownloadDataPage downloadDataPage);

    Integer queryCountByprojectList(DownloadDataPage downloadDataPage);
}

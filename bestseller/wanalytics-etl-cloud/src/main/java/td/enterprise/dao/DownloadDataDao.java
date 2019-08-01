package td.enterprise.dao;

import td.enterprise.entity.DownloadData;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>数据下载 DownloadDataDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DownloadDataDao extends BaseDao<DownloadData> {

    List<DownloadData> queryNeedRun(DownloadData downloadData);

    Integer selectbiggersequence();

    List<DownloadData> queryByprojectList(DownloadData downloadData);

    Integer queryCountByprojectList(DownloadData downloadData);
}

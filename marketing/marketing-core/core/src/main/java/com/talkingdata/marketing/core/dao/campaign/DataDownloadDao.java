package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.DataDownload;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_DATA_DOWNLOAD DataDownloadDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-06-05 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DataDownloadDao extends BaseDao<DataDownload> {
    /**
     * Gets data download list.
     *
     * @param statusList the status list
     * @return the data download list
     */
    List<DataDownload> getDataDownloadList(List<Integer> statusList);
}

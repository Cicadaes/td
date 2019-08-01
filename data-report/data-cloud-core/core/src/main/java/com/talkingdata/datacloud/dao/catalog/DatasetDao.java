package com.talkingdata.datacloud.dao.catalog;

import java.util.Map;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.catalog.Dataset;
/**
 *
 * <br>
 * <b>功能：</b>dict_dataset DatasetDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DatasetDao extends BaseDao<Dataset> {

    int updateUrn(Map<String, String> param);
    void updateNullStorageTypeByID(Dataset dataset);
}

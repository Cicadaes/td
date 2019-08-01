package com.talkingdata.datacloud.dao.catalog;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.catalog.FieldDetail;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>dict_field_detail FieldDetailDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface FieldDetailDao extends BaseDao<FieldDetail> {
    int deleteByDatasetId(Integer id);

    void batchInsert(List<FieldDetail> fieldDetailList);
}

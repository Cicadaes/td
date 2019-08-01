package com.talkingdata.datacloud.dao.catalog;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.catalog.DatasetPartitionValue;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>dataset_partition_value DatasetPartitionValueDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DatasetPartitionValueDao extends BaseDao<DatasetPartitionValue> {

   int batchInsert(List<DatasetPartitionValue> list);
}

package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.BatchRecord;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>调用批处理任务记录表 BatchRecordDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface BatchRecordDao extends BaseDao<BatchRecord> {

    List<BatchRecord> findAll(BatchRecord batchRecord);

}

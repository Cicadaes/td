package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.BatchRecordDao;
import td.enterprise.entity.BatchRecord;

/**
 * <br>
 * <b>功能：</b>调用批处理任务记录表 BatchRecordService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("batchRecordService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BatchRecordService extends BaseService<BatchRecord> {
    public final static Logger logger = Logger.getLogger(BatchRecordService.class);

    @Autowired
    private BatchRecordDao dao;

    public BatchRecordDao getDao() {
        return dao;
    }
}

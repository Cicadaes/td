package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TenantUseAppRoutineDao;
import td.enterprise.entity.TenantUseAppRoutine;
import td.enterprise.page.TenantUseAppRoutinePage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>APP使用作息 TenantUseAppRoutineService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantUseAppRoutineService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantUseAppRoutineService extends BaseService<TenantUseAppRoutine> {
    public final static Logger logger = Logger.getLogger(TenantUseAppRoutineService.class);

    @Autowired
    private TenantUseAppRoutineDao dao;

    public TenantUseAppRoutineDao getDao() {
        return dao;
    }

    public void queryAndInsertSum(String parentProjectId, String runDate) {
        TenantUseAppRoutinePage page = new TenantUseAppRoutinePage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        List<TenantUseAppRoutine> list = dao.queryChildrenSum(page);
        dao.batchDeleteByProjectAndDate(page);

        if (null != list && list.size() > 0) {
            int pointsDataLimit = 1000;//限制条数
            int size = list.size();
            if (pointsDataLimit < size) {
                int part = size / pointsDataLimit;//分批数
                for (int i = 0; i < part; i++) {
                    //1000条
                    List<TenantUseAppRoutine> listTmp = list.subList(0, pointsDataLimit);
                    batchInsert(listTmp, parentProjectId, runDate);
                    //移除
                    list.subList(0, pointsDataLimit).clear();
                }
                if (!list.isEmpty()) {
                    batchInsert(list, parentProjectId, runDate);
                }
            } else {
                batchInsert(list, parentProjectId, runDate);
            }
        }
    }

    private void batchInsert(List<TenantUseAppRoutine> list, String parentProjectId, String runDate) {
        for (TenantUseAppRoutine tenantUseAppRoutine : list) {
            tenantUseAppRoutine.setProjectId(Integer.parseInt(parentProjectId));
            tenantUseAppRoutine.setRunDate(runDate);
        }
        dao.batchInsert(list);
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        TenantUseAppRoutinePage page = new TenantUseAppRoutinePage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        try {
            dao.batchDeleteByProjectAndDate(page);
            dao.batchSelectAndInsert(page);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
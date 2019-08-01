package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TenantDeviceCountDao;
import td.enterprise.entity.TenantDeviceCount;
import td.enterprise.page.TenantDeviceCountPage;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>人群标签 TenantDeviceCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantDeviceCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantDeviceCountService extends BaseService<TenantDeviceCount> {
    public final static Logger logger = Logger.getLogger(TenantDeviceCountService.class);

    @Autowired
    private TenantDeviceCountDao dao;

    public TenantDeviceCountDao getDao() {
        return dao;
    }

    public int insertList(List<TenantDeviceCount> items) throws Exception {
        return getDao().insertList(items);
    }

    public List<TenantDeviceCount> selectByCodesIn(Map params) {
        return getDao().selectByCodesIn(params);
    }

    public int deleteByParams(TenantDeviceCount tenantDeviceCount) {
        return getDao().deleteByParams(tenantDeviceCount);
    }

    public void queryAndInsertSum(String parentProjectId, String runDate) {
        TenantDeviceCountPage page = new TenantDeviceCountPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        List<TenantDeviceCount> list = dao.queryChildrenSum(page);
        dao.batchDeleteByProjectAndDate(page);

        if (null != list && list.size() > 0) {
            int pointsDataLimit = 1000;//限制条数
            int size = list.size();
            if (pointsDataLimit < size) {
                int part = size / pointsDataLimit;//分批数
                for (int i = 0; i < part; i++) {
                    //1000条
                    List<TenantDeviceCount> listTmp = list.subList(0, pointsDataLimit);
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

    private void batchInsert(List<TenantDeviceCount> list, String parentProjectId, String runDate) {
        for (TenantDeviceCount tenantDeviceCount : list) {
            tenantDeviceCount.setProjectId(Integer.parseInt(parentProjectId));
            tenantDeviceCount.setRunDate(runDate);
        }
        dao.batchInsert(list);
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        TenantDeviceCountPage page = new TenantDeviceCountPage();
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

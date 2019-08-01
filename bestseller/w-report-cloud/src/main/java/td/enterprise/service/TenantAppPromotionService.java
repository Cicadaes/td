package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TenantAppPromotionDao;
import td.enterprise.entity.TenantAppPromotion;
import td.enterprise.page.TenantAppPromotionPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>App提升度计算 TenantAppPromotionService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantAppPromotionService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantAppPromotionService extends BaseService<TenantAppPromotion> {
    public final static Logger logger = Logger.getLogger(TenantAppPromotionService.class);

    @Autowired
    private TenantAppPromotionDao dao;

    public TenantAppPromotionDao getDao() {
        return dao;
    }

    public void queryAndInsertSum(String parentProjectId, String runDate) {
        TenantAppPromotionPage page = new TenantAppPromotionPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        List<TenantAppPromotion> list = dao.queryChildrenSum(page);
        dao.batchDeleteByProjectAndDate(page);

        if (null != list && list.size() > 0) {
            int pointsDataLimit = 1000;//限制条数
            int size = list.size();
            if (pointsDataLimit < size) {
                int part = size / pointsDataLimit;//分批数
                for (int i = 0; i < part; i++) {
                    //1000条
                    List<TenantAppPromotion> listTmp = list.subList(0, pointsDataLimit);
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

    private void batchInsert(List<TenantAppPromotion> list, String parentProjectId, String runDate) {
        for (TenantAppPromotion tenantAppPromotion : list) {
            tenantAppPromotion.setProjectId(Integer.parseInt(parentProjectId));
            tenantAppPromotion.setRunDate(runDate);
        }
        dao.batchInsert(list);
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        TenantAppPromotionPage page = new TenantAppPromotionPage();
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

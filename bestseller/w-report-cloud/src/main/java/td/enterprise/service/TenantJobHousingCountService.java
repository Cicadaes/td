package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.dao.TenantJobHousingCountDao;
import td.enterprise.entity.TenantJobHousingCount;
import td.enterprise.page.TenantJobHousingCountPage;

import java.util.*;

/**
 * <br>
 * <b>功能：</b>职住来源 TenantJobHousingCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-25 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantJobHousingCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantJobHousingCountService extends BaseService<TenantJobHousingCount> {
    public final static Logger logger = Logger.getLogger(TenantJobHousingCountService.class);
    public final static String pattern = "yyyy-MM-dd";
    @Autowired
    private TenantJobHousingCountDao dao;

    public TenantJobHousingCountDao getDao() {
        return dao;
    }

    public List querySumByList(TenantJobHousingCountPage page)
            throws Exception {
        page.setRunDate(DateUtil.monthChange(page.getRunDate(), pattern, 1));
        page.getPager().setRowCount(0);
        List list = new ArrayList<>();
        list = getDao().querySumByList(page);
        if (list.size() == 0) {
            page = filter(page);
            list = getDao().querySumByList(page);
        }
        Integer rowCount = Integer.valueOf(queryByCount(page));
        page.getPager().setRowCount(rowCount.intValue());
        return list;
    }


    //去数据库中检索有数据的有效日期区间
    private TenantJobHousingCountPage filter(TenantJobHousingCountPage page) {
        try {
            Map<String, String> map = new HashMap<>();
            //runDate 是endDate的前一天
            Date runDate = DateUtil.format(page.getRunDate(), pattern);
            map = getValiableRunDate(runDate, page.getCycleStatistics(), page.getTenantId(), page.getProjectId(), page.getCrowdId(), page.getHourType());
            if (map.size() > 0) {
                //page.setStartDate(map.get("startDate"));
                //page.setEndDate(map.get("endDate"));
                page.setRunDate(map.get("runDate"));
                // if (map.containsKey("cycleStatistics")) {
                //     page.setCycleStatistics(Integer.valueOf(map.get("cycleStatistics")));
                // }
                logger.info(" ####### filter之后 runDate=" + map.get("runDate") + " #######");
            }
        } catch (Exception e) {
            logger.error("getValiableRunDate方法异常, ");
        }

        return page;
    }

    /**
     * 去数据库中检索有数据的有效日期区间。
     * <p>
     * 前端如果当天数据没有找到，需要减一天重新取数，直到取到为止
     * * @param runDate
     *
     * @param cycleStatistics
     * @param tenantId
     * @param projectId
     * @param crowdId
     * @param hourType
     * @return
     */
    @SuppressWarnings("finally")
    public Map<String, String> getValiableRunDate(Date runDate, Integer cycleStatistics, String tenantId, int projectId, int crowdId, int hourType) {
        TenantJobHousingCountPage page = new TenantJobHousingCountPage();
        Map<String, String> map = new HashMap<>();
        //map.put("startDate", sdf.format(startDate));
        //map.put("endDate", sdf.format(endDate));
        try {
            int dateLength = cycleStatistics;
            if (dateLength != 30 &&
                    dateLength != 60 &&
                    dateLength != 90 &&
                    dateLength != 180) {
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
            TenantJobHousingCountPage tenantJobHousingCountPage = new TenantJobHousingCountPage();
            tenantJobHousingCountPage.setRunDate(DateUtil.format(runDate, pattern));
            tenantJobHousingCountPage.setCycleStatistics(dateLength);
            tenantJobHousingCountPage.setCrowdId(crowdId);
            tenantJobHousingCountPage.setProjectId(projectId);
            tenantJobHousingCountPage.setTenantId(tenantId);
            tenantJobHousingCountPage.setHourType(hourType);
            //查找同等计算周期下，计算日期在当前参数run_date之前记录
            TenantJobHousingCount count = dao.queryLatestRow(tenantJobHousingCountPage);
            if (count != null) {
                //map.put("startDate", count.getStartDate());
                //map.put("endDate",  count.getEndDate());
                map.put("runDate", count.getRunDate());
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
        } catch (Exception e) {
            throw new BusinessException(e);
        } finally {
            return map;
        }
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        TenantJobHousingCountPage page = new TenantJobHousingCountPage();
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

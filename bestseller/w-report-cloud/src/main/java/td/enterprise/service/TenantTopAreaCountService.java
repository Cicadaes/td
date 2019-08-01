package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.dao.TenantTopAreaCountDao;
import td.enterprise.entity.TenantTopAreaCount;
import td.enterprise.page.TenantTopAreaCountPage;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>TopN小区 TenantTopAreaCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantTopAreaCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantTopAreaCountService extends BaseService<TenantTopAreaCount> {
    public final static Logger logger = Logger.getLogger(TenantTopAreaCountService.class);
    public final static String pattern = "yyyy-MM-dd";
    public final DecimalFormat df = new java.text.DecimalFormat("#.##");

    @Autowired
    private TenantTopAreaCountDao dao;

    public TenantTopAreaCountDao getDao() {
        return dao;
    }

    public List<TenantTopAreaCount> queryTopByListNew(TenantTopAreaCountPage page) {
        page.setRunDate(DateUtil.monthChange(page.getRunDate(), pattern, 1));
        List<TenantTopAreaCount> result = dao.queryByListNew(page);
        Long sum = dao.queryByListNewSum(page);
        //计算百分比
        if (null != result && !result.isEmpty()) {
            if (sum == null) {
                sum = 0L;
            }
            for (TenantTopAreaCount ttc : result) {
                ttc.setMetricTotal(sum);
                if (sum != 0) {
                    String precent = df.format(new Double(ttc.getMetricValue() * 100) / sum);
                    ttc.setMetricPercent(precent);
                }
            }
        }
        return result;
    }

    //效率低，已废弃
    public List<TenantTopAreaCount> queryTopByList(TenantTopAreaCountPage page) {
        List<TenantTopAreaCount> result = dao.queryByList(page);
        if (result.size() == 0) {
            page = filter(page);
            result = dao.queryByList(page);
        }
        return result;
    }

    //去数据库中检索有数据的有效日期区间
    private TenantTopAreaCountPage filter(TenantTopAreaCountPage page) {
        try {
            Map<String, String> map = new HashMap<>();
            //runDate 是endDate的前一天
            Date runDate = DateUtil.format(page.getRunDate(), pattern);
            page.setRunDate(DateUtil.format(runDate, pattern));

            int dateLength = page.getCycleStatistics();
            if (dateLength != 30 &&
                    dateLength != 60 &&
                    dateLength != 90 &&
                    dateLength != 180) {
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                page.setCycleStatistics(dateLength);
            }

            //查找同等计算周期下，计算日期在当前参数run_date之前记录
            TenantTopAreaCount count = dao.queryLatestRow(page);

            if (count != null) {
                page.setRunDate(count.getRunDate());
                page.setCycleStatistics(count.getCycleStatistics());
                logger.info(" ####### filter之后 runDate=" + map.get("runDate") + " #######");
            }
        } catch (Exception e) {
            logger.error("getValiableRunDate方法异常, ");
        }
        return page;
    }


    public void batchSelectAndInsert(String parentProjectId, String date) {
        TenantTopAreaCountPage page = new TenantTopAreaCountPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(date);
        try {
            dao.batchDeleteByProjectAndDate(page);
            dao.batchSelectAndInsert(page);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

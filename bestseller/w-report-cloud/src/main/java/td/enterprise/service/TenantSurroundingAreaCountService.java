package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.PositionUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.dao.TenantSurroundingAreaCountDao;
import td.enterprise.entity.TenantSurroundingAreaCount;
import td.enterprise.page.TenantSurroundingAreaCountPage;

import java.util.*;

/**
 * <br>
 * <b>功能：</b>职住来源 TenantSurroundingAreaCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-04 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantSurroundingAreaCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantSurroundingAreaCountService extends BaseService<TenantSurroundingAreaCount> {
    public final static Logger logger = Logger.getLogger(TenantSurroundingAreaCountService.class);
    public final static String pattern = "yyyy-MM-dd";

    @Autowired
    private TenantSurroundingAreaCountDao dao;

    public TenantSurroundingAreaCountDao getDao() {
        return dao;
    }

    //去数据库中检索有数据的有效日期区间
    private TenantSurroundingAreaCountPage filter(TenantSurroundingAreaCountPage page) {
        try {
            Map<String, String> map = new HashMap<>();
            //runDate 是endDate的前一天
            Date runDate = DateUtil.format(page.getRunDate(), pattern);
            map = getValiableRunDate(runDate, page.getCycleStatistics(), page.getTenantId(), page.getProjectId(), page.getCrowdId(), page.getPoiType());
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
     *
     * @param runDate
     * @param cycleStatistics
     * @param tenantId
     * @return
     */
    @SuppressWarnings("finally")
    public Map<String, String> getValiableRunDate(Date runDate, Integer cycleStatistics, String tenantId, int projectId, int crowdId, String poiType) {
        TenantSurroundingAreaCountPage page = new TenantSurroundingAreaCountPage();
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
            TenantSurroundingAreaCountPage tenantSurroundingAreaCountPage = new TenantSurroundingAreaCountPage();
            tenantSurroundingAreaCountPage.setRunDate(DateUtil.format(runDate, pattern));
            tenantSurroundingAreaCountPage.setCycleStatistics(dateLength);
            tenantSurroundingAreaCountPage.setTenantId(tenantId);
            tenantSurroundingAreaCountPage.setProjectId(projectId);
            tenantSurroundingAreaCountPage.setCrowdId(crowdId);
            tenantSurroundingAreaCountPage.setPoiType(poiType);
            //查找同等计算周期下，计算日期在当前参数run_date之前记录
            TenantSurroundingAreaCount count = dao.queryLatestRow(tenantSurroundingAreaCountPage);
            if (count != null) {
                //map.put("startDate", count.getStartDate());
                //map.put("endDate",  count.getEndDate());
                map.put("runDate", count.getRunDate());
                // map.put("cycleStatistics", String.valueOf(dateLength));
            } else {
//				map.put("startDate", sdf.format(startDate));
//  			map.put("endDate", sdf.format(endDate));
                map.put("runDate", DateUtil.format(runDate, pattern));
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
        } catch (Exception e) {
            throw new BusinessException(e);
        } finally {
            return map;
        }
    }

    public List<TenantSurroundingAreaCount> findByPoiInfo(TenantSurroundingAreaCountPage page) throws Exception {

        String poiWid = page.getPoiWid();
        page.setPoiWid(null);
        Map<String, Object> map = queryByList(page);
        @SuppressWarnings("unchecked")
        List<TenantSurroundingAreaCount> rows = (List<TenantSurroundingAreaCount>) map.get("rows");

        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        TenantSurroundingAreaCount me = null;
        for (TenantSurroundingAreaCount tenantSurroundingAreaCount : rows) {
            if (poiWid.equals(tenantSurroundingAreaCount.getPoiWid())) {
                me = tenantSurroundingAreaCount;
                break;
            }
        }

        if (me != null) {
            Double bd09_lng = Double.valueOf(me.getLongitude());
            Double bd09_lat = Double.valueOf(me.getLatitude());

            Map<String, Object> deDoubleMap = new HashMap<>();
            for (TenantSurroundingAreaCount tenantSurroundingAreaCount : rows) {
                if (poiWid.equals(tenantSurroundingAreaCount.getPoiWid())) {
                    continue;
                }
                Object name = tenantSurroundingAreaCount.getAreaName();
                Double bd09_lng_ = Double.valueOf(tenantSurroundingAreaCount.getLongitude());
                Double bd09_lat_ = Double.valueOf(tenantSurroundingAreaCount.getLatitude());
                double longitudeDist = PositionUtil.lantitudeLongitudeDist(bd09_lng, bd09_lat, bd09_lng_, bd09_lat_);
                if (longitudeDist < 500 && deDoubleMap.get(tenantSurroundingAreaCount.getPoiWid()) == null) {
                    Map<String, Object> res = new HashMap<String, Object>();
                    res.put("poi_name", name);
                    res.put("poi_from", Integer.valueOf(String.format("%.0f", longitudeDist)));
                    result.add(res);

                    deDoubleMap.put(tenantSurroundingAreaCount.getPoiWid(), 1);
                }
            }
        }
        return rows;
    }

    public Map<String, Object> queryByList(TenantSurroundingAreaCountPage page) {
        Map<String, Object> map = new HashMap<String, Object>();
        List<TenantSurroundingAreaCount> list = dao.queryByList(page);
        int total = dao.queryByCount(page);
        if (list == null || list.size() == 0) {
            page = filter(page);
            list = dao.queryByList(page);
            total = dao.queryByCount(page);
            page.getPager().setRowCount(total);
        }
        map.put("rows", list);
        map.put("total", total);
        return map;
    }

    public Map<String, Object> queryByListExcludeBlack(TenantSurroundingAreaCountPage page) {
        Map<String, Object> map = new HashMap<String, Object>();
        List<TenantSurroundingAreaCount> list = dao.queryByListExcludeBlack(page);
        int total = dao.queryByCountExcludeBlack(page);
        if (list == null || list.size() == 0) {
            page = filter(page);
            list = dao.queryByListExcludeBlack(page);
            total = dao.queryByCountExcludeBlack(page);
        }
        map.put("rows", list);
        map.put("total", total);
        return map;
    }
}

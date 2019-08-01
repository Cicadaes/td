package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TenantCorrelationCountDao;
import td.enterprise.entity.TenantCorrelationCount;
import td.enterprise.page.TenantCorrelationCountPage;
import td.enterprise.web.vm.RelativeVM;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>竞品关联度指标 TenantCorrelationCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantCorrelationCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantCorrelationCountService extends BaseService<TenantCorrelationCount> {
    public final static Logger logger = Logger.getLogger(TenantCorrelationCountService.class);

    @Autowired
    private TenantCorrelationCountDao dao;

    public TenantCorrelationCountDao getDao() {
        return dao;
    }

    public List<RelativeVM> queryRelevancyIndex(TenantCorrelationCountPage tenantCorrelationCountPage) {
        String[] compareProjectIds = tenantCorrelationCountPage.getProjectIds();
        List<TenantCorrelationCount> list = new ArrayList<TenantCorrelationCount>();
        for (String compareProjectId : compareProjectIds) {
            tenantCorrelationCountPage.setCompareProjectId(Integer.parseInt(compareProjectId));
            List<TenantCorrelationCount> competeList = dao.queryRelevancyIndex(tenantCorrelationCountPage);
            if (competeList != null && competeList.size() > 0) {
                list.add(competeList.get(0));
            }
        }

        List<RelativeVM> resultList = new ArrayList<RelativeVM>();
        for (TenantCorrelationCount tcc : list) {
            RelativeVM vm = new RelativeVM();
            double out = 0.0;
            if(tcc.getActiveCount() != 0){
                out = ((tcc.getCommonCount() * 1.0) / (tcc.getActiveCount() / 8.0)) * 100.0;
            }

            BigDecimal bout = new BigDecimal(out);
            double fout = bout.setScale(1, RoundingMode.HALF_UP).doubleValue();
            vm.setProjectId(tcc.getCompareProjectId());
            vm.setOutRate(String.valueOf(fout));
            double in = 0.0;
            if(tcc.getCompareActiveCount() != 0){
                in = ((tcc.getCommonCount() * 1.0) / (tcc.getCompareActiveCount() * 1.0)) * 100.0;
            }
            BigDecimal bin = new BigDecimal(in);
            double fin = bin.setScale(1, RoundingMode.HALF_UP).doubleValue();
            vm.setInRate(String.valueOf(fin));
            resultList.add(vm);
        }
        return resultList;
    }
}

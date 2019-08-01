package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ProjectDao;
import td.enterprise.dao.TenantHousingCoverageCountDao;
import td.enterprise.entity.TenantHousingCoverageCount;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.TenantHousingCoverageCountPage;
import td.enterprise.web.vm.ProjectDetailVM;
import td.enterprise.web.vm.TenantHousingCoverageCountVM;

import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;


/**
 * <br>
 * <b>功能：</b>客群辐射范围 TenantHousingCoverageCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantHousingCoverageCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantHousingCoverageCountService extends BaseService<TenantHousingCoverageCount> {
    public final static Logger logger = Logger.getLogger(TenantHousingCoverageCountService.class);

    @Autowired
    private TenantHousingCoverageCountDao dao;

    @Autowired
    private ProjectDao projectDao;

    public TenantHousingCoverageCountDao getDao() {
        return dao;
    }

    public List<TenantHousingCoverageCountVM> queryCustomerDistribution(TenantHousingCoverageCountPage tenantHousingCoverageCountPage) {
        List<TenantHousingCoverageCount> list = dao.queryCustomerDistribution(tenantHousingCoverageCountPage);
        //计算总和
        Map<String, String> projectMap = new HashMap<String, String>();

        for (TenantHousingCoverageCount thc : list) {
            if (projectMap.get("value_" + thc.getProjectId()) != null) {
                projectMap.put("value_" + thc.getProjectId(), String.valueOf(Integer.parseInt(projectMap.get("value_" + thc.getProjectId())) + thc.getMetricValue()));
            } else {
                int a = 0;
                if (thc.getMetricValue() != null) a = thc.getMetricValue();
                projectMap.put("value_" + thc.getProjectId(), String.valueOf(a));
            }
        }

        List<TenantHousingCoverageCountVM> resultList = new ArrayList<TenantHousingCoverageCountVM>();
        for (TenantHousingCoverageCount thc2 : list) {

            int distanceType = thc2.getDistance();
            String a = "0";
            String b = projectMap.get("value_" + thc2.getProjectId());
            if (b != null && !b.equals("0")) {
                BigDecimal bd = new BigDecimal((thc2.getMetricValue() * 100.00 / Integer.parseInt(b)));
                a = String.valueOf(bd.setScale(1, RoundingMode.HALF_UP).doubleValue());
            }
            TenantHousingCoverageCountVM countVM = new TenantHousingCoverageCountVM();
            countVM.setProjectId(Integer.parseInt(thc2.getProjectId()));
            int index = resultList.indexOf(countVM);
            if (index == -1) {
                resultList.add(countVM);
            } else {
                countVM = resultList.get(index);
            }
            if (distanceType == 1) {
                countVM.setKm1Rate(a);
            } else if (distanceType == 3) {
                countVM.setKm3Rate(a);
            } else if (distanceType == 5) {
                countVM.setKm5Rate(a);
            } else if (distanceType == 10) {
                countVM.setKm10Rate(a);
            }
            if (index != -1) {
                resultList.set(index, countVM);
            }
        }

        //本项目的覆盖度放在第一位，如果本项目没有数据，不做修改
        //根据项目类型进行判断
        ProjectPage page = new ProjectPage() ;
        page.setProjectIds(Arrays.asList(tenantHousingCoverageCountPage.getProjectIds()));
        List <ProjectDetailVM> projectDetailVMS = projectDao.queryProjectPrincipalList(page);
        //找到本项目id
        String projectId = null;
        if(null != projectDetailVMS){
            for(ProjectDetailVM detailVM : projectDetailVMS){
                if(!(ProjectTypeEnum.PROJECT_ERROR.getCode() + "").equals(detailVM.getProjectType())){
                    projectId = detailVM.getProjectId() + "";
                    break;
                }
            }
        }

        TenantHousingCoverageCountVM tempVm = null;
        if(projectId != null){
            for(int i=0;i<resultList.size(); i ++){
                if((resultList.get(i).getProjectId() + "").equals(projectId)){
                    tempVm = resultList.get(i);
                    resultList.remove(i);
                    break;
                }
            }
        }

        if(null != tempVm){
            resultList.add(tempVm);
        }
        return resultList;
    }

    public void queryAndInsertSum(String parentProjectId, String runDate) {
        TenantHousingCoverageCountPage page = new TenantHousingCoverageCountPage();
        page.setProjectId(parentProjectId);
        page.setRunDate(runDate);
        List<TenantHousingCoverageCount> list = dao.queryChildrenSum(page);
        dao.batchDeleteByProjectAndDate(page);

        if (null != list && list.size() > 0) {
            int pointsDataLimit = 1000;//限制条数
            int size = list.size();
            if (pointsDataLimit < size) {
                int part = size / pointsDataLimit;//分批数
                for (int i = 0; i < part; i++) {
                    //1000条
                    List<TenantHousingCoverageCount> listTmp = list.subList(0, pointsDataLimit);
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

    private void batchInsert(List<TenantHousingCoverageCount> list, String parentProjectId, String runDate) {
        for (TenantHousingCoverageCount tenantHousingCoverageCount : list) {
            tenantHousingCoverageCount.setProjectId(parentProjectId);
            tenantHousingCoverageCount.setRunDate(runDate);
        }
        dao.batchInsert(list);
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        TenantHousingCoverageCountPage page = new TenantHousingCoverageCountPage();
        page.setProjectId(parentProjectId);
        page.setRunDate(runDate);
        try {
            dao.batchDeleteByProjectAndDate(page);
            dao.batchSelectAndInsert(page);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

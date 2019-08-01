package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.DictConstants;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.dao.LookalikeCrowdDao;
import td.enterprise.entity.*;
import td.enterprise.entity.type.ProjectGroupComputeEnum;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.LookalikeCrowdPage;
import td.enterprise.page.ProjectGroupComputePage;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.TenantLookalikeJobHousingCountPage;
import td.enterprise.service.manager.DicService;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.olap.query.QueryServiceVisitDepth;

import javax.inject.Inject;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>相似人群 LookalikeCrowdService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("lookalikeCrowdService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class LookalikeCrowdService extends BaseService<LookalikeCrowd> {

    public final static Logger logger = Logger.getLogger(LookalikeCrowdService.class);

    @Autowired
    private LookalikeCrowdDao dao;

    @Autowired
    private ProjectService projectService;
    @Autowired
    private CrowdService crowdService;
    @Autowired
    private TenantLookalikeJobHousingCountService tenantLookalikeJobHousingCountService;
    @Autowired
    private CustomCrowdService customCrowdService;

    @Inject
    AzkabanRestUtil azkabanRestUtil;

    @Autowired
    private ParamService paramService;

    @Autowired
    private DicService dicService;

    @Autowired
    private ProjectGroupComputeService projectGroupComputeService;

    public LookalikeCrowdDao getDao() {
        return dao;
    }

    public List<LookalikeCrowd> queryByListWithOtherCrowd(LookalikeCrowdPage page) {
        Integer rowCount = dao.queryByCountWithOtherCrowd(page);
        page.getPager().setRowCount(rowCount);
        return getDao().queryByListWithOtherCrowd(page);
    }

    /**
     * 创建相似客群
     *
     * @param lookalikeCrowd
     * @return
     * @throws Exception
     */
    public LookalikeCrowd create(LookalikeCrowd lookalikeCrowd) throws Exception {
        User user = UserInfoUtil.getUser();
        int projectId = lookalikeCrowd.getProjectId();
        int seedCrowdId = lookalikeCrowd.getSeedCrowdId();
        Crowd seedCrowd = crowdService.selectByPrimaryKey(seedCrowdId);
        Project project = projectService.selectByPrimaryKey(projectId);
        if (lookalikeCrowd.getIsExcludeSeedCrowdBoolean() != null &&
                lookalikeCrowd.getIsExcludeSeedCrowdBoolean()) {
            lookalikeCrowd.setIsExcludeSeedCrowd(1);
        } else {
            lookalikeCrowd.setIsExcludeSeedCrowd(0);

        }
        List<DicItem> dicItemList = dicService.queryDicItemsByDicName(DictConstants.MAGNIFYING_RATE);
        for (DicItem dicItem : dicItemList) {
            if (lookalikeCrowd.getPredictNum() != null &&
                    String.valueOf(lookalikeCrowd.getPredictNum()).equals(dicItem.getDicItemKey())) {
                lookalikeCrowd.setPredictRate(dicItem.getDicItemValue());
            }
        }

        Long startTimeLong = Long.valueOf(lookalikeCrowd.getSeedCrowdStartDate());
        Long endTimeLong = Long.valueOf(lookalikeCrowd.getSeedCrowdEndDate());

        String startDate = DateUtil.format(new Date(startTimeLong), "yyyy-MM-dd");
        String endDate  = DateUtil.format(new Date(endTimeLong), "yyyy-MM-dd");
        long seedCrowdNum = getMacCount(projectId,seedCrowd.getType(),startDate,endDate);

        lookalikeCrowd.setSeedCrowdStartDate(startDate);
        lookalikeCrowd.setSeedCrowdEndDate(endDate);
        lookalikeCrowd.setSeedCrowdNum(Integer.parseInt(seedCrowdNum  + "" )); //设置种子人群数量
        lookalikeCrowd.setProjectCityName(project.getCity());
        lookalikeCrowd.setSeedCrowdName(seedCrowd.getName());
        lookalikeCrowd.setSeedType(seedCrowd.getType());
        lookalikeCrowd.setTenantId(UserInfoUtil.getCurrentUserTenantId());
        lookalikeCrowd.setCreateBy(user.getUmid());
        lookalikeCrowd.setCreator(user.getUmid());
        lookalikeCrowd.setStatus(ReportConstants.CustomCrowd.STATUS_AVALIABLE);
        lookalikeCrowd.setCalcStatus(ReportConstants.CustomCrowd.CALC_STATUS_COUNT_ING);
        dao.insert(lookalikeCrowd);

        String azakbanProject = "WifiAnalyticsLookAlikeMasterTask";
        String flow = "WifiAnalyticsLookAlikeMasterTask";
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("taskId", lookalikeCrowd.getId());
        String execId = azkabanRestUtil.callAzkabanRestAPI(paramMap, azakbanProject, flow);
        lookalikeCrowd.setExecId(execId);
        dao.updateByPrimaryKey(lookalikeCrowd);

        //同步写入CustomCrowd 记录
        CustomCrowd customCrowd = new CustomCrowd();
        customCrowd.setProjectId(lookalikeCrowd.getProjectId());
        customCrowd.setCrowdRecordId(lookalikeCrowd.getId());
        customCrowd.setCalcStatus(ReportConstants.CustomCrowd.CALC_STATUS_COUNT_ING);
        customCrowd.setCreator(user.getUmid());
        customCrowd.setCrowdName(lookalikeCrowd.getCrowdName());
        customCrowd.setExecId(Integer.valueOf(execId));
        customCrowd.setRecordType(ReportConstants.CustomCrowd.CROWD_TYPE_LOOKALIKE);
        customCrowd.setStatus(ReportConstants.CustomCrowd.STATUS_AVALIABLE);
        customCrowdService.insert(customCrowd);
        return lookalikeCrowd;
    }

    /**
     * 获取某个相似客群
     *
     * @param lookalikeCrowdId
     * @return
     * @throws Exception
     */
    public LookalikeCrowd find(String lookalikeCrowdId) throws Exception {
        LookalikeCrowd lookalikeCrowd = dao.selectByPrimaryKey(lookalikeCrowdId);
        TenantLookalikeJobHousingCountPage countPage = new TenantLookalikeJobHousingCountPage();
        int newSeedCrowdNum = 0;
        if (lookalikeCrowd != null && lookalikeCrowd.getSeedCrowdNum() != null && lookalikeCrowd.getPredictNum() != null) {
//			countPage.setProjectId(lookalikeCrowd.getProjectId());
//			countPage.setTenantId(lookalikeCrowd.getTenantId());
//			countPage.setCaclId(lookalikeCrowd.getId().toString());
//			newSeedCrowdNum = tenantLookalikeJobHousingCountService.queryByCount(countPage);
            newSeedCrowdNum = lookalikeCrowd.getSeedCrowdNum() * lookalikeCrowd.getPredictNum();
        }
        lookalikeCrowd.setNewSeedCrowdNum(newSeedCrowdNum);
        logger.info(lookalikeCrowd.getId().toString() + "," + newSeedCrowdNum);
        return lookalikeCrowd;
    }

    /**
     * 删除相似客群
     *
     * @param lookalikeCrowdId
     * @return
     * @throws Exception
     */
    public void delete(String lookalikeCrowdId) throws Exception {
        LookalikeCrowd lookalikeCrowd = dao.selectByPrimaryKey(lookalikeCrowdId);
        String execid = lookalikeCrowd.getExecId();
        if (execid == null || execid.isEmpty()) {
//    		throw new Exception("azkaban任务id为null");
            logger.info("azkaban任务id为null");
        } else {
//    		if(ReportConstants.LookalikeCrowd.CALC_STATUS_COUNT_ING == lookalikeCrowd.getCalcStatus()){
            //计算中，则终止任务
            azkabanRestUtil.cancel(execid);
//    		}
        }

        lookalikeCrowd.setStatus(ReportConstants.CustomCrowd.STATUS_DELETE);
        dao.updateByPrimaryKey(lookalikeCrowd);

        //删除客群扩大数据表中此次计算任务的数据
        TenantLookalikeJobHousingCountPage page = new TenantLookalikeJobHousingCountPage();
        page.setCaclId(String.valueOf(lookalikeCrowd.getId()));
        List<TenantLookalikeJobHousingCount> list = tenantLookalikeJobHousingCountService.queryByList(page);
        for (TenantLookalikeJobHousingCount record : list) {
            tenantLookalikeJobHousingCountService.deleteByPrimaryKey(record.getId());
        }
    }

    /**
     * 获取项目下这段时间内的mac 数，
     * 如果是单独计算客流的店组，用店组下合并后的用户进行计算
     *
     * @return
     */
    private long getMacCount(int projectId ,String crowdType,String startDate,String endDate){
        String projectIds = projectId +  "";
        Project project = projectService.selectByPrimaryKey(projectId);

        String cubeName = "" ;
        crowdType = crowdType.toUpperCase();
        switch (crowdType){
            case "AU" :
                cubeName = "active_user_day_cube";
                break;
            case "OU" :
                cubeName = "old_user_day_cube";
                break;
            case "NU" :
                cubeName = "new_user_day_cube";
                break;
            case "CU" :
                break;
            default:
                cubeName = "active_user_day_cube";
                break;
        }

        //如果是店组，是合并客流，mac 地址要从店铺总获取
        if(null != project && project.getProjectType() != null && project.getProjectType() == ProjectTypeEnum.PROJECT_ERROR.getCode() ){
            //查询是否是单独计算客流
            ProjectGroupComputePage page = new ProjectGroupComputePage();
            page.setGroupId(projectId);
            page.setComputeType(ProjectGroupComputeEnum.EXCLUSION.getCode());
            int c =  projectGroupComputeService.queryByCount(page);
            if(c == 0){
                ProjectPage childPage = new ProjectPage();
                childPage.setId(projectId);
                childPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                childPage.setProjectType(ProjectTypeEnum.PROJECT_SHOP.getCode());
                Map<String,Project>  childProjectMap = projectService.queryAllChildrenByParam(childPage,new HashMap<String,Project>());
                if(null != childProjectMap && ! childProjectMap.isEmpty()) {
                    StringBuffer buffer = new StringBuffer();
                    for(String tempId: childProjectMap.keySet()){
                        buffer.append(tempId).append(",");
                    }
                    buffer.deleteCharAt(buffer.length()-1);
                    projectIds = buffer.toString();
                }
            }
        }

        long count =  QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCube(projectIds,startDate,endDate,cubeName);

        return count;

    }
}

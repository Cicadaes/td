package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.BehaviorCrowdDao;
import td.enterprise.entity.BehaviorCrowd;
import td.enterprise.entity.CustomCrowd;
import td.enterprise.web.util.UserInfoUtil;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>行为客群计算参数 BehaviorCrowdService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("behaviorCrowdService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BehaviorCrowdService extends BaseService<BehaviorCrowd> {
    public final static Logger logger = Logger.getLogger(BehaviorCrowdService.class);

    @Autowired
    private CustomCrowdService customCrowdService;
    @Autowired
    private BehaviorCrowdDao dao;
    @Inject
    private AzkabanRestUtil azkabanRestUtil;

    public BehaviorCrowdDao getDao() {
        return dao;
    }

    /**
     * 新建自定义客群
     *
     * @param behaviorCrowd
     * @return
     * @throws Exception
     */
    public BehaviorCrowd createCrowds(BehaviorCrowd behaviorCrowd) throws Exception {
        User user = UserInfoUtil.getUser();
        behaviorCrowd.setTenantId(UserInfoUtil.getCurrentUserTenantId().toString());
        behaviorCrowd.setCreator(user.getUmid());
        behaviorCrowd.setCreateBy(user.getUmid());
        behaviorCrowd.setStatus(ReportConstants.CustomCrowd.STATUS_AVALIABLE);
        dao.insert(behaviorCrowd);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("taskId", behaviorCrowd.getId().toString());
        String project = "CustomerGroup";
        String flow = "CustomerGroup";
        String execId = "0";
        try {
            execId = azkabanRestUtil.callAzkabanRestAPI(paramMap, project, flow);
            behaviorCrowd.setExecId(Integer.valueOf(execId));
            dao.updateByPrimaryKeySelective(behaviorCrowd);

            //同步写入CustomCrowd 记录
            CustomCrowd customCrowd = new CustomCrowd();
            customCrowd.setProjectId(behaviorCrowd.getProjectId());
            customCrowd.setCrowdRecordId(behaviorCrowd.getId());
            customCrowd.setCalcStatus(ReportConstants.CustomCrowd.CALC_STATUS_COUNT_ING);
            customCrowd.setCreator(user.getUmid());
            customCrowd.setCrowdName(behaviorCrowd.getCrowdName());
            customCrowd.setExecId(Integer.valueOf(execId));
            customCrowd.setRecordType(ReportConstants.CustomCrowd.CROWD_TYPE_BEHAVIOR);
            customCrowd.setStatus(ReportConstants.CustomCrowd.STATUS_AVALIABLE);
            customCrowdService.insert(customCrowd);
        } catch (Exception e) {
            logger.error("自定义客群异常信息", e);
        }
        return behaviorCrowd;
    }

    public void delete(@PathVariable String behaviorCrowdId) throws Exception {
        BehaviorCrowd crowd = dao.selectByPrimaryKey(behaviorCrowdId);
        crowd.setStatus(ReportConstants.CustomCrowd.STATUS_DELETE);
        dao.updateByPrimaryKey(crowd);
    }
}

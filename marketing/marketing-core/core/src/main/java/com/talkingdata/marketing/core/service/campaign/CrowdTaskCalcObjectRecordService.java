package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.CrowdTaskCalcObjectRecordConstants;
import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.dao.campaign.CrowdTaskCalcObjectRecordDao;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.Date;
import java.util.List;


/**
 * <br>
 * <b>功能：</b>TD_MKT_CROWD_TASK_CALC_OBJECT_RECORD CrowdTaskCalcObjectRecordService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("crowdTaskCalcObjectRecordService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CrowdTaskCalcObjectRecordService extends BaseService<CrowdTaskCalcObjectRecord, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(CrowdTaskCalcObjectRecordService.class);

    @Autowired
    private CrowdTaskCalcObjectRecordDao dao;

    @Autowired
    private ConfigApi configApi;

    @Override
    public CrowdTaskCalcObjectRecordDao getDao() {
        return dao;
    }

    public List<CrowdTaskCalcObjectRecord> queryByCalcStatus(Integer clacStatus) {
        return dao.queryByCalcStatus(clacStatus);
    }

    public CrowdTaskCalcObjectRecord queryByCrowdId(Integer crowdId) {
        return dao.queryByCrowdId(crowdId);
    }

    public List<CrowdTaskCalcObjectRecord> queryAllByCrowdId(Integer crowdId) {
        return dao.queryAllByCrowdId(crowdId);
    }

    public CrowdTaskCalcObjectRecord querylatestByCrowdId(Integer crowdId) {
        return dao.querylatestByCrowdId(crowdId);
    }

    public CrowdTaskCalcObjectRecord insertByCrowd(Crowd crowd, int calcStatus) throws Exception {
        Date now = new Date();
        int maxRetry = Integer.parseInt(configApi.getParam(ParamConstants.TASK_MAXRETRY, ParamConstants.SYSTEM_CODE));
        CrowdTaskCalcObjectRecord crowdTaskCalcObjectRecord = new CrowdTaskCalcObjectRecord();
        crowdTaskCalcObjectRecord.setCrowdId(crowd.getId());
        crowdTaskCalcObjectRecord.setCrowdName(crowd.getRefName());
        crowdTaskCalcObjectRecord.setCrowdType(crowd.getCrowdType());
        crowdTaskCalcObjectRecord.setStatus(calcStatus);
        crowdTaskCalcObjectRecord.setStartTime(now);
        crowdTaskCalcObjectRecord.setCreateTime(now);
        crowdTaskCalcObjectRecord.setRefId(crowd.getRefId());
        crowdTaskCalcObjectRecord.setRetry(0);
        crowdTaskCalcObjectRecord.setMaxRetry(maxRetry);
        crowdTaskCalcObjectRecord.setTenantId(crowd.getTenantId() + "");
        crowdTaskCalcObjectRecord.setCreator(crowd.getCreator());
        crowdTaskCalcObjectRecord.setCreateBy(crowd.getCreateBy());
        getDao().insert(crowdTaskCalcObjectRecord);
        return crowdTaskCalcObjectRecord;
    }

    public List<CrowdTaskCalcObjectRecord> findSceneByRefId(List<Integer> refIds) {
        return getDao().findSceneByRefId(refIds);
    }

    public List<CrowdTaskCalcObjectRecord> getTodayAlreadyCalcRecord(Date date) {
        return getDao().getTodayAlreadyCalcRecord(date);
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    /**
     * @param record
     * @param status
     * @throws Exception
     */
    public void updateCalcObjectRecordStatusById(CrowdTaskCalcObjectRecord record, Integer status) throws Exception {
        CrowdTaskCalcObjectRecord updateObjectRecord = new CrowdTaskCalcObjectRecord();
        updateObjectRecord.setId(record.getId());
        updateObjectRecord.setStatus(status);
        if (CrowdTaskCalcObjectRecordConstants.FAIL == status) {
            updateObjectRecord.setErrorInfo(record.getErrorInfo());
            updateObjectRecord.setRetry(updateObjectRecord.getRetry() == null ? 1 : updateObjectRecord.getRetry() + 1);
        } else if (CrowdTaskCalcObjectRecordConstants.FINISHED == status) {
            updateObjectRecord.setFinishTime(new Date());
        }
        dao.updateByPrimaryKeySelective(updateObjectRecord);
    }

}

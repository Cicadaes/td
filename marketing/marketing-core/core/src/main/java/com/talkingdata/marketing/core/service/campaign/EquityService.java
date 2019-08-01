package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.constant.EquityRecordConstants;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import com.talkingdata.marketing.core.entity.campaign.EquityRecord;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import com.talkingdata.marketing.core.entity.dto.PipelineEquityRecordCacheDto;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.page.campaign.EquityRecordPage;
import com.talkingdata.marketing.core.page.campaign.PipelineEquityConfigDefinitionPage;
import com.talkingdata.marketing.core.service.common.RedisUtils;
import com.talkingdata.marketing.core.util.FileUtil;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * The type Equity service.
 * @author armeng
 */
@Service("equityService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class EquityService {
    @Autowired
    private CampaignService campaignService;

    @Autowired
    private EquityRecordService equityRecordService;

    @Autowired
    private EquityConfigService equityConfigService;

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private PipelineEquityConfigDefinitionService pipelineEquityConfigDefinitionService;

    @Autowired
    private ExceptionBuilder exceptionBuilder;

    /**
     * Allocate equity.
     *权益分配，按照权益配置，在equity record表中生成相应的数据
     * @param campaignId           the campaign id
     * @param pipelineDefinitionId the pipeline definition id
     * @throws Exception the exception
     */
    public void allocateEquity(Integer campaignId, Integer pipelineDefinitionId) throws Exception {
        List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitionList = loadEquityConfigDefinition(pipelineDefinitionId);
        Set<String> allocatedEquity = loadAllocatedEquity(campaignId);
        //todo 判断同一个活动不同权益不能重复
        for (PipelineEquityConfigDefinition p : pipelineEquityConfigDefinitionList) {
            EquityConfig equityConfig = equityConfigService.selectByPrimaryKey(p.getEquityConfigId());
            Attachment attachment = attachmentService.selectByPrimaryKey(equityConfig.getAttachmentId());
            if (attachment == null || StringUtils.isBlank(attachment.getPath())) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_ATTACH_NOT_EXIST);
            }
            Set<String> equitySet = new HashSet<>();
            try(FileInputStream in = new FileInputStream(attachment.getPath())){
                 equitySet = equityConfigService.parseEquity(FileUtil.removeUTF8BOM(IOUtils.toByteArray(in)));
            }

            Integer allocatedCount = getAllocatedCount(pipelineDefinitionId, equityConfig.getId());
            List<EquityRecord> equityRecordList = new ArrayList();

            if (allocatedCount > p.getCount()) {
                //权益数量设置比之前减少,删除前allocatedCount-p.getCount条未发放的权益
                equityRecordService.deleteExtraEquity(pipelineDefinitionId, p.getEquityConfigId(), allocatedCount - p.getCount());
            } else {
                for (String equity : equitySet) {
                    if (allocatedCount >= p.getCount()) {
                        break;
                    }
                    if (!allocatedEquity.contains(equity)) {
                        EquityRecord equityRecord = buildEquityRecord(equity, campaignId, pipelineDefinitionId, p);
                        equityRecordList.add(equityRecord);
                        allocatedCount++;
                    }
                }
                if (!equityRecordList.isEmpty()) {
                    equityRecordService.insertBatch(equityRecordList);
                }
            }
        }
    }

    private Integer getAllocatedCount(Integer pipelineDefinitionId, Integer equityConfigId) throws Exception {
        EquityRecordPage page = new EquityRecordPage();
        page.setPipelineDefinitionId(String.valueOf(pipelineDefinitionId));
        page.setEquityConfigId(String.valueOf(equityConfigId));
        page.setPageSize(Integer.MAX_VALUE);
        return equityRecordService.queryByCount(page);
    }

    private Set<String> loadAllocatedEquity(Integer campaignId) throws Exception {
        EquityRecordPage page = new EquityRecordPage();
        page.setCampaignId(String.valueOf(campaignId));
        page.setPageSize(Integer.MAX_VALUE);
        List<EquityRecord> equityRecordList = equityRecordService.queryByList(page);
        Set<String> equitySet = new HashSet();
        for (EquityRecord record : equityRecordList) {
            equitySet.add(record.getEquityValue());
        }
        return equitySet;
    }

    private EquityRecord buildEquityRecord(String equity,
                                           Integer campaignId,
                                           Integer pipelineDefinitionId,
                                           PipelineEquityConfigDefinition p) {
        EquityRecord equityRecord = new EquityRecord();
        equityRecord.setCampaignId(campaignId);
        equityRecord.setEquityCode(p.getCode());
        equityRecord.setEquityConfigId(p.getEquityConfigId());
        equityRecord.setPipelineDefinitionId(pipelineDefinitionId);
        equityRecord.setEquityValue(equity);
        equityRecord.setStatus(EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_NOT_USED);
        equityRecord.setCreateTime(new Date());
        return equityRecord;
    }

    private List<PipelineEquityConfigDefinition> loadEquityConfigDefinition(Integer pipelineDefinitionId) throws Exception {
        PipelineEquityConfigDefinitionPage page = new PipelineEquityConfigDefinitionPage();
        page.setPageSize(Integer.MAX_VALUE);
        page.setPipelineDefinitionId(String.valueOf(pipelineDefinitionId));
        return pipelineEquityConfigDefinitionService.queryByList(page);
    }

    /**
     * Recycle equity.
     *
     * @param pipelineDefinitionId the pipeline definition id
     */
    public void recycleEquity(Integer pipelineDefinitionId) {
        equityRecordService.deleteNotUsedEquity(pipelineDefinitionId);
    }

    /**
     * 重新加载权益到redis中，如果redis已存在，则直接返回已分配；
     * 如果redis中已使用完，但是mysql record表中还存在，则重新加载到redis；
     *
     * @param campaignId           the campaign id
     * @param pipelineDefinitionId the pipeline definition id
     * @param equityCode           权益编码
     * @return integer integer
     * @throws Exception the exception
     */
    public synchronized Integer reload(Integer campaignId, Integer pipelineDefinitionId, String equityCode) throws Exception {
        Campaign campaign = loadCampaign(campaignId);
        if (campaign == null) {
            throw new MktException("campaign不存在");
        }
        if (System.currentTimeMillis() > campaign.getEndTime().getTime()) {
            throw new MktException("campaign已结束");
        }

        String key = String.format("%d_%d_%s", campaignId, pipelineDefinitionId, equityCode);
        Long size = redisUtils.size(key);
        if (size != null && size > 0) {
            ////判断redis list长度是否为0，如果不为0，表示列表中还有剩余权益可以分配
            return Constant.PIPELINE_EQUITY_EXIST;
        }
        //redis 中的权益已经全部用完，需要从equity record表中加载没有使用的权益
        List<EquityRecord> equityRecordList = loadUnusedEquityRecord(pipelineDefinitionId, equityCode);
        if (equityRecordList.size() == 0) {
            //权益已经使用全部使用完成
            return Constant.PIPELINE_EQUITY_EMPTY;
        }
        List<String> equityValueList = buildEquityValueList(equityRecordList);
        redisUtils.leftPushAll(key, equityValueList);

        //设置key值的过期时间
        redisUtils.expireAt(key, campaign.getEndTime());
        //权益已经重新加载，请从Redis中重新获取，即返回状态码为2001
        return Constant.PIPELINE_EQUITY_RELOAD;
    }

    /**
     * Distribute pipeline equity record cache dto.
     *
     * @param pipelineDefinition the pipeline definition
     * @param equityCode         the equity code
     * @return the pipeline equity record cache dto
     * @throws Exception the exception
     */
    public PipelineEquityRecordCacheDto distribute(PipelineDefinition pipelineDefinition, String equityCode) throws Exception{
        validPipelineDefinition(pipelineDefinition.getId(), equityCode);
        PipelineEquityRecordCacheDto cacheDto = loadPipelineEquityRecord(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), equityCode);
        if (!cacheDto.getEquityValueList().isEmpty()) {
            //如果不为空，则更新状态
            updateEquityDistributed(cacheDto.getCampaignId(), cacheDto.getPipelineDefinitionId(), cacheDto.getEquityCode(), cacheDto.getEquityValueList());
            //todo insert into distribution record(HBase table)
        }
        return cacheDto;
    }

    /**
     * Load pipeline equity record pipeline equity record cache dto.
     *
     * @param campaignId           the campaign id
     * @param pipelineDefinitionId the pipeline definition id
     * @param equityCode           the equity code
     * @return the pipeline equity record cache dto
     * @throws Exception the exception
     */
    public PipelineEquityRecordCacheDto loadPipelineEquityRecord(Integer campaignId, Integer pipelineDefinitionId, String equityCode) throws Exception {
        PipelineEquityRecordCacheDto equityRecordCache = new PipelineEquityRecordCacheDto(campaignId, pipelineDefinitionId, equityCode);
        // redis rpop取一条记录
        String key = String.format("%d_%d_%s", campaignId, pipelineDefinitionId, equityCode);
        String equityValue = redisUtils.rightPop(key);
        // 如果返回为空，则调用reload
        if (equityValue == null) {
            Integer reloadStatus = reload(campaignId, pipelineDefinitionId, equityCode);
            if (reloadStatus == Constant.PIPELINE_EQUITY_EXIST || reloadStatus == Constant.PIPELINE_EQUITY_RELOAD) {
                equityValue = redisUtils.rightPop(key);
            }
        }
        if (equityValue != null) {
            equityRecordCache.getEquityValueList().add(equityValue);
        }
        return equityRecordCache;
    }

    private List<EquityRecord> loadUnusedEquityRecord(Integer pipelineDefinitionId, String equityCode) {
        EquityRecordPage page = new EquityRecordPage();
        page.setEquityCode(equityCode);
        page.setPageSize(Constant.PIPELINE_EQUITY_LOAD_SIZE);
        page.setStatus(String.valueOf(EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_NOT_USED));
        page.setPipelineDefinitionId(String.valueOf(pipelineDefinitionId));
        try {
            return equityRecordService.queryByList(page);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.EMPTY_LIST;
        }
    }

    private List<String> buildEquityValueList(List<EquityRecord> recordList) {
        List<String> equityValueList = new ArrayList();
        for (EquityRecord equityRecord : recordList) {
            equityValueList.add(equityRecord.getEquityValue());
        }
        return equityValueList;
    }

    private Campaign loadCampaign(Integer campaignId) throws Exception {
        return campaignService.selectByPrimaryKey(campaignId);
    }

    private void validPipelineDefinition(Integer pipelineDefinitionId, String equityCode) throws Exception{
        PipelineEquityConfigDefinitionPage page = new PipelineEquityConfigDefinitionPage();
        page.setCode(equityCode);
        page.setPipelineDefinitionId(String.valueOf(pipelineDefinitionId));
        try {
            PipelineEquityConfigDefinition definition = pipelineEquityConfigDefinitionService.queryBySingle(page);
            if (definition == null) {
                throw new MktException("权益编码和营销流程上配置的权益编码不一致");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new MktException("权益编码和营销流程上配置的权益编码不一致");
        }
    }

    private void updateEquityDistributed(Integer campaignId, Integer pipelineDefinitionId, String equityCode, List<String> equityValueList) {
        equityRecordService.updateEquityUsed(campaignId, pipelineDefinitionId, equityCode, equityValueList);
    }
}

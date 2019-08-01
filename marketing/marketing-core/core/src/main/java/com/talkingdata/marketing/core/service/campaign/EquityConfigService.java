package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.constant.EquityRecordConstants;
import com.talkingdata.marketing.core.dao.campaign.EquityConfigDao;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import com.talkingdata.marketing.core.entity.campaign.EquityRecord;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.EquityConfigPage;
import com.talkingdata.marketing.core.page.campaign.PipelineEquityConfigDefinitionPage;
import com.talkingdata.marketing.core.page.dto.EquityConfigDto;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.FileUtil;
import com.talkingdata.marketing.core.util.SequenceUtil;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_EQUITY_CONFIG EquityConfigService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("equityConfigService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class EquityConfigService extends BaseService<EquityConfig, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(EquityConfigService.class);

    @Autowired
    private EquityConfigDao dao;

    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private EquityRecordService equityRecordService;
    @Autowired
    PipelineEquityConfigDefinitionService pipelineEquityConfigDefinitionService;
    @Autowired
    PipelineDefinitionService pipelineDefinitionService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @Override
    public EquityConfigDao getDao() {
        return dao;
    }

    public EquityConfig createEquityConfig(EquityConfig equityConfig,Attachment attachment, HttpServletRequest request) throws Exception {
        equityConfig.setCode(SequenceUtil.getSequenceCode(SequenceUtil.SequenceTypeEnum.PE));
        equityConfig.setCreateTime(new Date());
        AssignmentUtil.setInfo(equityConfig,request);
        equityConfig.setAttachmentId(attachment.getId());
        getDao().insert(equityConfig);
        List<EquityConfig> equityConfigs = new ArrayList<>();
        equityConfigs.add(equityConfig);

        updateAttachment(equityConfig, attachment);
        return equityConfig;
    }

    private void updateAttachment(EquityConfig equityConfig, Attachment attachment) throws Exception {
        Attachment update = new Attachment();
        update.setId(attachment.getId());
        update.setRefId(equityConfig.getId());
        update.setType(AttachmentConstants.AttachmentTypeConstants.ATTACHMENT_TYPE_EQUITY_CONFIG);
        update.setUpdater(equityConfig.getCreator());
        update.setUpdaterBy(equityConfig.getCreateBy());
        update.setUpdateTime(new Date());
        attachmentService.updateByPrimaryKeySelective(update);
    }

    public EquityConfig updateEquityConfig(EquityConfig equityConfig, HttpServletRequest request,Attachment newAttachment,Attachment oldAttachment) throws Exception {
        if(null != newAttachment && null != oldAttachment){
            attachmentService.updateByPrimaryKey(newAttachment);
            attachmentService.updateByPrimaryKey(oldAttachment);
        }
        getDao().updateByPrimaryKey(equityConfig);
        pipelineEquityConfigDefinitionService.deleteByEquityConfigId(equityConfig.getId());
        List<EquityConfig> equityConfigs = new ArrayList<>();
        equityConfigs.add(equityConfig);
        List<PipelineDefinition> pipelineDefinitions = pipelineDefinitionService.findByCampaignId(equityConfig.getCampaignId());
        pipelineEquityConfigDefinitionService.saveByEquityConfig(equityConfigs,pipelineDefinitions,request);
        return equityConfig;
    }

    public Integer getTotal(byte[] data) throws Exception{
        Set<String> equitySet = parseEquity(data);
        return equitySet.size();
    }

    public Set<String> getEquitySetById(Integer equityConfigId) throws Exception{
        EquityConfig equityConfig = selectByPrimaryKey(equityConfigId);
        if (equityConfig == null) {
            throw new Exception("equityConfig not found");
        }
        Attachment attachment = attachmentService.selectByPrimaryKey(equityConfig.getAttachmentId());
        if (attachment == null || StringUtils.isBlank(attachment.getPath())) {
            throw new Exception("attach not found");
        }
        try(FileInputStream in = new FileInputStream(attachment.getPath())){
            return parseEquity(FileUtil.removeUTF8BOM(IOUtils.toByteArray(in)));
        }
    }

    public Set<String> parseEquity(byte[] data) throws Exception{
        Set<String> equitySet = new HashSet();
        CSVParser parser = null;
        try {
            parser = CSVParser.parse(new String(data), CSVFormat.EXCEL.withIgnoreHeaderCase());
            List<CSVRecord> recordList = parser.getRecords();
            for (int i = 0; i < recordList.size(); i++) {
                String equity = recordList.get(i).get(0);
                if ("".equals(equity) || equitySet.contains(equity)) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_ATTACH_INVALID);
                }
                equitySet.add(equity);
            }
            return equitySet;
        } catch (IOException e) {
            logger.error("解析权益文件发生错误：{}", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_ATTACH_INVALID);
        } finally {
            if (parser!=null){
                parser.close();
            }
        }
    }

    public List<EquityConfig> findByCampaignId(Integer campaignId) {
        return dao.findByCampaignId(campaignId);
    }

    public List<EquityConfig> findByName(String equityConfigName,String attachmentName, Integer campaignId) {
        List<EquityConfig> equityConfigs = getDao().findByName(equityConfigName,attachmentName,campaignId);
        return equityConfigs;
    }

    public void delete(Integer equityConfigId) throws Exception {
        List<EquityRecord> equityRecords = equityRecordService.findByEquityConfigIdAndStatus(equityConfigId,
            EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_USED);
        if (equityRecords!=null && equityRecords.size()>0){
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_CANNOT_DELETE);
        }
        getDao().deleteByPrimaryKey(equityConfigId);
        pipelineEquityConfigDefinitionService.deleteByEquityConfigId(equityConfigId);
    }

    public List<EquityConfigDto> queryEquityConfigDtoByList(EquityConfigPage page) throws Exception {
        List<EquityConfig> equityConfigs = queryByList(page);
        List<EquityConfigDto> equityConfigDtos = new ArrayList<>();
        for (EquityConfig equityConfig:equityConfigs){
            EquityConfigDto equityConfigDto = new EquityConfigDto();
            int used = equityRecordService.countByEquityConfigIdAndStatus(equityConfig.getId(), EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_USED);
            BeanUtils.copyProperties(equityConfig,equityConfigDto);
            equityConfigDto.setRemain(equityConfig.getTotal() - used);
            equityConfigDtos.add(equityConfigDto);
        }
        return equityConfigDtos;
    }

    /**
     * 修改权益名称
     *    1.修改TD_MKT_EQUITY_CONFIG中名称
     *    2.修改TD_MKT_PIPELINE_EQUITY_CONFIG_DEFINITION中名称
     * @param id 权益ID
     * @param name 权益名称
     */
    public void updateEquityName(Integer id, String name) throws Exception {
        EquityConfig config = new EquityConfig();
        config.setId(id);
        config.setName(name);
        getDao().updateByPrimaryKeySelective(config);

        PipelineEquityConfigDefinitionPage pipelineEquityConfigDefinitionPage = new PipelineEquityConfigDefinitionPage();
        pipelineEquityConfigDefinitionPage.setEquityConfigId(String.valueOf(id));
        pipelineEquityConfigDefinitionPage.setPageSize(Constant.QUERY_PAGE_SIZE);
        pipelineEquityConfigDefinitionService.updateNameByEquityConfigId(id, name);
    }
}

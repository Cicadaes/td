package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.EquityConfigPage;
import com.talkingdata.marketing.core.page.dto.EquityConfigDto;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import com.talkingdata.marketing.core.service.campaign.EquityConfigService;
import com.talkingdata.marketing.core.util.FileUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.net.URLDecoder;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static com.talkingdata.marketing.core.constant.CampaignConstant.CampaignStatusConstant;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller @RequestMapping("/campaign") public class EquityConfigController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(EquityConfigController.class);

    @Autowired private EquityConfigService equityConfigService;
    @Autowired private AttachmentService attachmentService;
    @Autowired private MktValidator mktValidator;
    @Autowired private ExceptionBuilder exceptionBuilder;
    @Autowired private CampaignService campaignService;

    @RequestMapping(value = "/equityConfigs", method = GET) @ResponseBody public List<EquityConfigDto> query(EquityConfigPage page) throws Exception {
        page.setOrderBy(EquityConfig.fieldToColumn(page.getOrderBy()));
        return equityConfigService.queryEquityConfigDtoByList(page);
    }

    @RequestMapping(value = "/equityConfigs/rows", method = GET) @ResponseBody public Map<String, Object> queryRows(EquityConfigPage page)
        throws Exception {
        page.setOrderBy(EquityConfig.fieldToColumn(page.getOrderBy()));
        List<EquityConfig> rows = equityConfigService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/equityConfigs/{id}", method = GET) @ResponseBody public EquityConfig find(@PathVariable Integer id) throws Exception {
        return equityConfigService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/equityConfigs/findByCampaignId/{campaignId}", method = GET) @ResponseBody
    public ResponseEntity findByCampaignId(@PathVariable Integer campaignId) throws Exception {
        List<EquityConfig> definitionList = equityConfigService.findByCampaignId(campaignId);
        return new ResponseEntity(definitionList, HttpStatus.OK);
    }

    /**
     * curl http://localhost:1111/marketing-api/campaign/equityConfigs?name=quanyi1&total=200&campaignId=205 -F "bin=@/home/zmy/te.csv"
     */
    @RequestMapping(value = "/equityConfigs", method = POST) public ResponseEntity create(@RequestParam("uploadUUID") String uploadUUID,
        @RequestParam String name, @RequestParam Integer total, @RequestParam Integer campaignId, HttpServletRequest request) throws Exception {
        if (StringUtils.isEmpty(name) || total == null || campaignId == null || StringUtils.isBlank(uploadUUID)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_PARAMETER_MISSING);
        }

        Attachment attachment = attachmentService.selectByPrimaryKey(Integer.parseInt(uploadUUID));
        EquityConfig equityConfig = new EquityConfig();
        equityConfig.setName(URLDecoder.decode(name, "UTF-8"));
        equityConfig.setTotal(total);
        equityConfig.setCampaignId(campaignId);
        equityConfig.setAttachmentName(attachment.getName());
        if (!mktValidator.validateUnique(equityConfig)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_NAME_DUP);
        }
        File file = new File(attachment.getPath());
        FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        byte[] data = FileUtil.removeUTF8BOM(FileUtils.readFileToByteArray(file));
        Set<String> equitySet = equityConfigService.parseEquity(data);
        if (!total.equals(equitySet.size())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_WRONG_TOTAL);
        }
        Campaign campaign = campaignService.getCampaignByPrimaryKey(campaignId);
        if (campaign == null || !Objects.equals(campaign.getStatus(), CampaignStatusConstant.CAMPAIGN_WAITING)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_CANNOT_HANDLE);
        }
        equityConfig = equityConfigService.createEquityConfig(equityConfig, attachment, request);
        return new ResponseEntity(equityConfig, HttpStatus.OK);
    }

    @RequestMapping(value = "/equityConfigs/{equityConfigId}", method = POST)
    public ResponseEntity update(@PathVariable("equityConfigId") Integer id, @RequestParam String name, @RequestParam(required = false) Integer total,
        @RequestParam(required = false) String uploadUUID, HttpServletRequest request) throws Exception {
        /**值修改名称*/
        if (StringUtils.isNotBlank(name) && id != null && total == null) {
            equityConfigService.updateEquityName(id, name);
            return new ResponseEntity(HttpStatus.OK);
        }
        if (StringUtils.isEmpty(name) || total == null || id == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_PARAMETER_MISSING);
        }
        EquityConfig config = equityConfigService.selectByPrimaryKey(id);
        if (config == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_NOT_EXIST);
        }
        Campaign campaign = campaignService.getCampaignByEquityConfigId(id);
        if (campaign == null || !Objects.equals(campaign.getStatus(), CampaignStatusConstant.CAMPAIGN_WAITING)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_CANNOT_HANDLE);
        }


        config.setName(name);
        config.setTotal(total);
        Attachment newAttachment = null;
        Attachment oldAttachment = null;
        if (StringUtils.isNotBlank(uploadUUID)) {
            oldAttachment = attachmentService.selectByPrimaryKey(config.getAttachmentId());
            newAttachment = attachmentService.selectByPrimaryKey(Integer.parseInt(uploadUUID));
            if (newAttachment == null || null == oldAttachment) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.ATTACHMENT_NOT_EXIST);
            }

            oldAttachment.setRefId(null);
            newAttachment.setRefId(config.getId());
            newAttachment.setType(AttachmentConstants.AttachmentTypeConstants.ATTACHMENT_TYPE_EQUITY_CONFIG);
            config.setAttachmentName(newAttachment.getName());
            config.setAttachmentId(newAttachment.getId());

            File newFile = new File(newAttachment.getPath());
            FileUtil.fileCheck(newFile, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
            byte[] data = FileUtil.removeUTF8BOM(FileUtils.readFileToByteArray(newFile));
            Set<String> equitySet = equityConfigService.parseEquity(data);
            if (!total.equals(equitySet.size())) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_WRONG_TOTAL);
            }
        }
        if (!mktValidator.validateUnique(config)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_NAME_DUP);
        }

        config = equityConfigService.updateEquityConfig(config, request,newAttachment,oldAttachment);
        return new ResponseEntity(config, HttpStatus.OK);
    }

    @RequestMapping(value = "/equityConfigs", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public void update(@RequestBody EquityConfig equityConfig) throws Exception {
        equityConfigService.updateByPrimaryKeySelective(equityConfig);
    }

    @RequestMapping(value = "/equityConfigs/{id}", method = DELETE) @ResponseBody public void delete(@PathVariable Integer id) throws Exception {
        Campaign campaign = campaignService.getCampaignByEquityConfigId(id);
        if (campaign == null || !Objects.equals(campaign.getStatus(), CampaignStatusConstant.CAMPAIGN_WAITING)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_CANNOT_HANDLE);
        }
        equityConfigService.delete(id);
        logger.info("delete from TD_MKT_EQUITY_CONFIG where id = {}", id);
    }

    /**
     * curl http://localhost:1111/marketing-api/campaign/equityConfigs/amount -F "bin=@/home/zhaijian/test.csv"
     */
    @RequestMapping(value = "/equityConfigs/amount", method = RequestMethod.POST, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public Integer getTotal(@RequestBody Map paramMap) throws Exception {
        logger.info("/equityConfigs/amount,paramMap={}", JsonUtil.toJson(paramMap));
        File file = attachmentService.getFileById((Integer)paramMap.get("uploadUUID"));
        if (null == file) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_EXIST);
        }
        FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        byte[] data = FileUtil.removeUTF8BOM(FileUtils.readFileToByteArray(file));
        return equityConfigService.getTotal(data);
    }
}

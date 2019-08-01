package com.talkingdata.marketing.web.controller.campaign;

import com.google.common.io.Files;
import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.AuditLogSave;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdResp;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.page.campaign.CrowdPage;
import com.talkingdata.marketing.core.page.dto.CsvPreviewDto;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.service.campaign.CrowdService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.FileUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.ZipUtil;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.ArrayUtils;
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
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class CrowdController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(CrowdController.class);

    @Autowired private CrowdApi crowdApi;
    @Autowired private CrowdService crowdService;
    @Autowired private ExceptionBuilder exceptionBuilder;
    @Autowired private AttachmentService attachmentService;

    @RequestMapping(value = "/crowds", method = GET) @ResponseBody
    public List<Crowd> query(CrowdPage page) throws Exception {
        page.setOrderBy(Crowd.fieldToColumn(page.getOrderBy()));
        return crowdService.queryByList(page);
    }

    @RequestMapping(value = "/crowds/rows", method = GET) @ResponseBody
    public Map<String, Object> queryRows(CrowdPage page) throws Exception {
        page.setOrderBy(Crowd.fieldToColumn(page.getOrderBy()));
        List<Crowd> rows = crowdService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/crowds/{id}", method = GET) @ResponseBody
    public Crowd find(@PathVariable Integer id) throws Exception {
        Crowd crowd = crowdService.selectByPrimaryKey(id);
        if (crowd == null) {
            return new Crowd();
        }
        // todo Temporary,if crowd is not accurate,set estimated to td id estimated
        if (CrowdType.CROWD_TYPE_ACCURATE_FILE != crowd.getCrowdType()) {
            crowd.setEstimatedSize(crowd.getPushEstimatedSize());
        }
        return crowd;
    }

    @RequestMapping(value = "/crowds", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE) @ApiOperation(value = "创建子人群接口", notes = "创建子人群接口")
    @ResponseBody @EnableAssignmentTime
    public Crowd create(@RequestBody Crowd crowd, HttpServletRequest request) throws Exception {
        logger.info("create sub crowd:" + JsonUtil.toJson(crowd));
        crowdService.createWithCalcRecord(crowd, request);
        return crowd;
    }

    @RequestMapping(value = "/crowds", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    @AuditLogSave(opType = AuditLogSave.OpType.update, targetType = AuditLogSave.TargetType.crowd, targetId = "#crowd.id")
    public void update(@RequestBody Crowd crowd) throws Exception {
        crowdService.updateByPrimaryKeySelective(crowd);
    }

    @RequestMapping(value = "/crowds/{id}", method = DELETE) @ResponseBody
    @AuditLogSave(opType = AuditLogSave.OpType.delete, targetType = AuditLogSave.TargetType.crowd, targetId = "#id")
    public void logicalDelete(@PathVariable Integer id) throws Exception {
        crowdService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_CROWD where id = {}", id);
    }

    /**
     * curl http://localhost:1111/campaign/crowds/accurate/history?name=
     */
    @RequestMapping(value = "/crowds/accurate/history", method = RequestMethod.GET) @ResponseBody
    public CrowdResp getHistory(CrowdPage page,
        HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(page, request);
        CrowdResp r = crowdService.getHistoryCrowd(page);
        if (r == null) {
            r = new CrowdResp();
        }
        return r;
    }

    /**
     * curl http://localhost:1111/campaign/crowds/accurate/128
     */
    @RequestMapping(value = "/crowds/accurate/{crowdId}", method = RequestMethod.GET) @ResponseBody
    public CrowdInfoResp getById(@PathVariable Integer crowdId) throws IOException {
        CrowdInfoResp info = crowdApi.getCrowdInfo(crowdId);
        if (info == null) {
            info = new CrowdInfoResp();
        }
        return info;
    }

    /**
     * curl http://localhost:1111/campaign/crowds/accurate/file/stat -F "bin=@/home/zmy/te.csv"
     */
    @RequestMapping(value = "/crowds/accurate/file/stat", method = RequestMethod.POST, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public Map<String, Integer> statDv(@RequestBody Map paramMap, HttpServletRequest request) throws Exception {
        Integer uploadUUID = (Integer) paramMap.get("uploadUUID");
        File file = attachmentService.getFileById(uploadUUID);
        if(null == file){
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_EXIST);
        }
        FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        return crowdService.statDv(file);
    }

    /**
     * curl http://localhost:1111/campaign/crowds/accurate/template/download -G
     */
    @RequestMapping(value = "/crowds/accurate/template/download", method = RequestMethod.GET) @ResponseBody
    public void downloadTemplate(
        HttpServletResponse res) throws Exception {
        crowdService.downloadTemplate(res);
        res.flushBuffer();
    }

    /**
     * curl http://localhost:1111/campaign/crowds/accurate/file/preview -F "bin=@/home/zmy/te.csv"
     */
    @RequestMapping(value = "/crowds/accurate/file/preview", method = RequestMethod.POST, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public CsvPreviewDto preview(@RequestBody Map paramMap) throws Exception {
        File file = attachmentService.getFileById((Integer)paramMap.get("uploadUUID"));
        if (null == file) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_EMPTY);
        } else {
            if (null != file && file.getName().endsWith(AttachmentConstants.AttachmentFormatConstants.ZIP_SUFFIX)) {
                List<File> deCompressFils = checkFilesInZip(file);
                file = deCompressFils.get(0);
            }
            FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        }

        return crowdService.previewCsv(file);
    }

    /**
     * 检查zip中的文件是否格式一致:都是csv并且header都一样
     */
    private List<File> checkFilesInZip(File zip) throws Exception {
        File targetDir = Files.createTempDir();
        ZipUtil.deCompress(zip, targetDir);
        File[] fileArray = targetDir.listFiles();
        if (ArrayUtils.isEmpty(fileArray)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_EMPTY);
        }

        String firstFileHeader = null;
        for (File file : fileArray) {
            FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
            List<String> headers = crowdService.fetCsvFileHeader(file);
            if (null == firstFileHeader) {
                firstFileHeader = String.join(",", headers);
            } else {
                if (!firstFileHeader.equals(String.join(",", headers))) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.FILES_NOT_INCONSISTENT);
                }
            }
        }
        return Arrays.asList(fileArray);
    }

    @RequestMapping(value = "/crowds/{id}/recount", method = RequestMethod.PATCH) @ResponseBody
    public ResponseEntity reCount(@PathVariable Integer id) throws Exception {
        Crowd crowd = crowdService.selectByPrimaryKey(id);
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_NOT_EXIST);
        }
        if (CrowdType.CROWD_TYPE_SUB_CROWD != crowd.getCrowdType()) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_NOT_CHILD);
        }
        if (CrowdCalcStatus.STATUS_IN_PROGRESS == crowd.getCalcStatus()) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_CALC);
        }
        crowdService.crowdRecountAndUpdate(crowd);
        return new ResponseEntity(CrowdCalcStatus.STATUS_IN_PROGRESS, HttpStatus.OK);
    }

    /**
     * curl http://localhost:1111/campaign/crowds/crowd/287/quote
     */
    @RequestMapping(value = "/crowds/crowd/{crowdId}/quote", method = RequestMethod.GET) @ResponseBody public List<String> getJsonQuotes(
        @PathVariable Integer crowdId) throws Exception {
        return crowdService.getJsonQuote(crowdId);
    }

    @RequestMapping(value = "/crowds/sub/rows", method = GET) @ResponseBody public Map<String, Object> querySub(CrowdPage crowdPage)
        throws Exception {
        return crowdService.querySub(crowdPage);
    }

    @RequestMapping(value = "/crowds/parent/campaign/{campaignId}/rows", method = GET) @ResponseBody
    public List<Crowd> findParentByCampaignId(@PathVariable Integer campaignId) {
        return crowdService.findParentByCampaignId(campaignId);
    }

    @RequestMapping(value = "/crowds/{id}/download", method = RequestMethod.GET) @ResponseBody
    public ResponseEntity downloadCrowd(@PathVariable Integer id) throws Exception {
        List<String> ids = crowdService.downloadCrowd(id);
        return new ResponseEntity(ids, HttpStatus.OK);
    }

    @RequestMapping(value = "/crowds/campaign/{campaign_id}/rows", method = RequestMethod.GET) @ResponseBody
    public Map getCrowdByTp(CrowdPage crowdPage, String crowdTp) throws Exception {
        if (StringUtils.isNotBlank(crowdTp)) {
            crowdPage.setCrowdType(crowdTp);
        }
        List<Crowd> rows = crowdService.getCrowdByTp(crowdPage);
        return getGridData(crowdPage.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/crowds/{id}/download/notice", method = RequestMethod.GET) @ResponseBody
    public ResponseEntity downloadCrowdNotice(@PathVariable Integer id) throws Exception {
        Crowd crowd = crowdService.selectByPrimaryKey(id);
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_NOT_EXIST);
        }
        if (crowd.getStatus() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_STATUS_NOT_EXIST);
        }
        if (CrowdCalcStatus.STATUS_FINISH != crowd.getStatus()) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CROWD_CANNOT_DOWNLOAD);
        }
        crowdService.downloadCrowdNotice(crowd);
        return new ResponseEntity("ok", HttpStatus.OK);
    }

    @ApiOperation(value = "创建DMP人群接口", notes = "创建DMP人群接口")
    @RequestMapping(value = "/crowds/dmpCrowd", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public ResponseEntity createDmpCrowds(@RequestBody CrowdInfoResp crowdInfoResp, HttpServletRequest request) throws Exception {
        crowdService.createDmpCrowds(crowdInfoResp, request);
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }

    @ApiOperation(value = "查询Pipeline测试人群", notes = "查询Pipeline测试人群") @RequestMapping(value = "/crowds/testCrowds", method = RequestMethod.GET)
    @ResponseBody
    /**
     * TODO armeng 貌似前端没有使用.可以考虑删除???
     */ public ResponseEntity testCrowds(CrowdPage page, HttpServletRequest request) throws Exception {
        // 查询非用户运营人群
        List<Crowd> crowdList = crowdService.queryCrowds(page.getRefName());
        // 查询用户运营人群
        AssignmentUtil.setInfo(page, request);
        CrowdResp resp = crowdService.getHistoryCrowd(page);
        if (resp != null) {
            List<CrowdInfoResp> rows = resp.getRows();
            if (rows != null && !rows.isEmpty()) {
                for (CrowdInfoResp crowdInfoResp : rows) {
                    Crowd crowd = new Crowd();
                    crowd.setCrowdType(CrowdType.CROWD_TYPE_ACCURATE_HISTORY);
                    crowd.setSource(crowdInfoResp.getSource());
                    crowd.setRefId(crowdInfoResp.getId());
                    crowd.setLastUpdateTime(new Date(crowdInfoResp.getUpdateTime()));
                    crowd.setStatus(crowdInfoResp.getStatus());
                    crowd.setCalcStatus(crowdInfoResp.getCalcStatus());
                    crowd.setRefCode(crowdInfoResp.getCode());
                    crowd.setRefName(crowdInfoResp.getName());
                    crowd.setDescription(crowdInfoResp.getDescription());
                    AssignmentUtil.setInfo(crowd, request);
                    crowdList.add(crowd);
                }
            }
        }
        return new ResponseEntity<>(crowdList, HttpStatus.OK);
    }

}

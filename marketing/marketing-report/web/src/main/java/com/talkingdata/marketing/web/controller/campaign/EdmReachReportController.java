package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.EdmReachReport;
import com.talkingdata.marketing.core.entity.dto.EdmReachReportDto;
import com.talkingdata.marketing.core.page.campaign.EdmReachReportPage;
import com.talkingdata.marketing.core.service.campaign.EdmReachReportService;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class EdmReachReportController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(EdmReachReportController.class);

    @Autowired
    private EdmReachReportService edmReachReportService;

    @RequestMapping(value = "/edmReachReports", method = GET)
    @ResponseBody
    public List<EdmReachReport> query(EdmReachReportPage page) throws Exception {
        page.setOrderBy(EdmReachReport.fieldToColumn(page.getOrderBy()));
        return edmReachReportService.queryByList(page);
    }

    @RequestMapping(value = "/edmReachReports/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(EdmReachReportPage page) throws Exception {
        page.setOrderBy(EdmReachReport.fieldToColumn(page.getOrderBy()));
        List<EdmReachReport> rows = edmReachReportService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/edmReachReports/{id}", method = GET)
    @ResponseBody
    public EdmReachReport find(@PathVariable Integer id) throws Exception {
        return edmReachReportService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/edmReachReports", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public EdmReachReport create(@RequestBody EdmReachReport edmReachReport) throws Exception {
        edmReachReportService.insert(edmReachReport);
        return edmReachReport;
    }

    @RequestMapping(value = "/edmReachReports", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody EdmReachReport edmReachReport) throws Exception {
        edmReachReportService.updateByPrimaryKeySelective(edmReachReport);
    }

    @RequestMapping(value = "/edmReachReports/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        edmReachReportService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_EDM_REACH_REPORT where id = {}", id);
    }

    @ApiOperation(value = "获取时间轴", notes = "获取短信效果报告的时间轴")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/edmReachReports/timeaxis/{segmentId}", method = GET)
    @ResponseBody
    public ResponseEntity findTimeaxis(@PathVariable Integer segmentId) throws Exception {
        List<String> list = edmReachReportService.findTimeaxisBySegmentId(segmentId);
        return new ResponseEntity(list, HttpStatus.OK);
    }

    @ApiOperation(value = "获取投放概览和趋势分析", notes = "获取投放概览和趋势分析")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期  eg:20161001" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/edmReachReports/report/{segmentId}", method = GET)
    @ResponseBody
    public ResponseEntity findByStatisticsDate(@PathVariable Integer segmentId, @RequestParam("granularity") String granularity, @RequestParam("statisticsDate") String statisticsDate) throws Exception {
        EdmReachReportDto edmReachReportDto = edmReachReportService.findEmdReachReportDtoByLastTime(segmentId, granularity, statisticsDate);
        return new ResponseEntity(edmReachReportDto, HttpStatus.OK);
    }

    @ApiOperation(value = "通过pipelineId和pipelineNodeId获取投放报告", notes = "通过pipelineId和pipelineNodeId获取投放报告")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineId", value = "活动流程id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineNodeId", value = "活动流程节点id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/edmReachReports/report/{pipelineId}/{pipelineNodeId}", method = GET)
    @ResponseBody
    public ResponseEntity findByPipelineIdAndDate(@PathVariable Integer pipelineId, @PathVariable String pipelineNodeId, @RequestParam
            ("granularity") String granularity, @RequestParam("statisticsDate") String statisticsDate) throws Exception {
        EdmReachReportDto edmReachReportDto = edmReachReportService.findByPipelineId(pipelineId, pipelineNodeId, granularity, statisticsDate);
        return new ResponseEntity(edmReachReportDto, HttpStatus.OK);
    }


    @ApiOperation(value = "下载邮件通知报告", notes = "GET请求")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path"),
        @ApiImplicitParam(name = "type", value = "成功-success或失败-fail", required = true, dataType = "string", paramType = "path")
    })
    @RequestMapping(value = "/edmReachReports/report/detail/{segmentId}/{type}/download", method = GET)
    public ResponseEntity downloadNoticeReportDetail(HttpServletRequest request, HttpServletResponse response, @PathVariable Integer segmentId, @PathVariable String type) throws Exception {
        File file = null;
        String fileName = "";
        String successFlag = "success";
        String failFlag = "fail";
        String reportFileName = "report-details.csv";
        String reportFileFailName = "report-fail-details.csv";
        String fileNotExist = "文件不存在";
        String requestParamInvalid = "请求参数不存在数据";
        if (successFlag.equals(type)) { fileName = reportFileName; }
        else if (failFlag.equals(type)){ fileName = reportFileFailName; }
        else { return new ResponseEntity("请求参数不存在数据", HttpStatus.METHOD_NOT_ALLOWED); }
        try {
            file = edmReachReportService.getNoticeFile(segmentId, fileName);
        } catch (Exception e) {
            if (StringUtils.isNotBlank(e.getMessage()) && e.getMessage().contains(fileNotExist)) {
            } else {
                logger.error("邮件[EDM]通知失败报告下载发生异常", e);
            }
            return new ResponseEntity("邮件运营商暂未提供数据", HttpStatus.NOT_FOUND);
        }
        if (file == null) { return new ResponseEntity(requestParamInvalid, HttpStatus.METHOD_NOT_ALLOWED); }
        if (file.exists()) { download(request, response, file, file.getName()); }
        logger.info("邮件[EDM]通知失败报告临时存储：{}", file.getAbsolutePath());
        try {
            file.delete();
        } catch (SecurityException e) {
            logger.info("删除临时文件[{}]发生错误：", file.getAbsolutePath(), e);
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "下载邮件投放趋势表", notes = "下载邮件投放趋势表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期" , required = false, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/edmReachReports/report/trend/{segmentId}/download", method = GET)
    public ResponseEntity downloadSmsReportExcel(HttpServletResponse res, @PathVariable Integer segmentId,
            @RequestParam String granularity, String statisticsDate) throws Exception {
        InputStream is = edmReachReportService.buildEdmExcelRows(segmentId, granularity, statisticsDate);
        String fileName = segmentId + ".xls";
        download(res, is, fileName);
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "下载邮件投放趋势表", notes = "下载邮件投放趋势表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineId", value = "活动流程id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineNodeId", value = "活动流程节点id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期" , required = false, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/edmReachReports/report/trend/{pipelineId}/{pipelineNodeId}/download", method = GET)
    public ResponseEntity downloadSmsReportExcel(HttpServletResponse res, @PathVariable Integer pipelineId,
            @PathVariable String pipelineNodeId, @RequestParam String granularity, String statisticsDate) throws Exception {
        InputStream is = edmReachReportService.buildEdmExcelRows(pipelineId, pipelineNodeId, granularity, statisticsDate);
        String fileName = pipelineId + "_" + pipelineNodeId + ".xls";
        download(res, is, fileName);
        return new ResponseEntity(HttpStatus.OK);
    }
}

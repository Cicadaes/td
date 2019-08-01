package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.SmsReachReport;
import com.talkingdata.marketing.core.entity.dto.SmsReachReportDto;
import com.talkingdata.marketing.core.page.campaign.SmsReachReportPage;
import com.talkingdata.marketing.core.service.campaign.SmsReachReportService;
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
public class SmsReachReportController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(SmsReachReportController.class);

    @Autowired
    private SmsReachReportService smsReachReportService;

    @RequestMapping(value = "/smsReachReports", method = GET)
    @ResponseBody
    public List<SmsReachReport> query(SmsReachReportPage page) throws Exception {
        page.setOrderBy(SmsReachReport.fieldToColumn(page.getOrderBy()));
        return smsReachReportService.queryByList(page);
    }

    @RequestMapping(value = "/smsReachReports/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(SmsReachReportPage page) throws Exception {
        page.setOrderBy(SmsReachReport.fieldToColumn(page.getOrderBy()));
        List<SmsReachReport> rows = smsReachReportService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/smsReachReports/{id}", method = GET)
    @ResponseBody
    public SmsReachReport find(@PathVariable Integer id) throws Exception {
        return smsReachReportService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/smsReachReports", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public SmsReachReport create(@RequestBody SmsReachReport smsReachReport) throws Exception {
        smsReachReportService.insert(smsReachReport);
        return smsReachReport;
    }

    @RequestMapping(value = "/smsReachReports", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody SmsReachReport smsReachReport) throws Exception {
        smsReachReportService.updateByPrimaryKeySelective(smsReachReport);
    }

    @RequestMapping(value = "/smsReachReports/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        smsReachReportService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_SMS_REACH_REPORT where id = {}", id);
    }

    @ApiOperation(value = "获取时间轴", notes = "获取短信效果报告的时间轴", response = List.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/smsReachReports/timeaxis/{segmentId}", method = GET)
    @ResponseBody
    public ResponseEntity findTimeaxis(@PathVariable Integer segmentId) throws Exception {
        List<String> list = smsReachReportService.findTimeaxisBySegmentId(segmentId);
        return new ResponseEntity(list, HttpStatus.OK);
    }

    @ApiOperation(value = "通过pipelineId获取时间轴", notes = "通过pipelineId获取短信效果报告的时间轴", response = List.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineId", value = "活动流程id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineNodeId", value = "活动流程节点id", required = true, dataType = "string", paramType = "path")
    })
    @RequestMapping(value = "/smsReachReports/timeaxis/{pipelineId}/{pipelineNodeId}", method = GET)
    @ResponseBody
    public ResponseEntity findTimeaxis(@PathVariable Integer pipelineId, @PathVariable String pipelineNodeId) throws Exception {
        List<String> list = smsReachReportService.findTimeaxisByPipelineId(pipelineId, pipelineNodeId);
        return new ResponseEntity(list, HttpStatus.OK);
    }

    @ApiOperation(value = "获取投放概览和趋势分析", notes = "获取投放概览和趋势分析")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/smsReachReports/report/{segmentId}", method = GET)
    @ResponseBody
    public ResponseEntity findByStatisticsDate(@PathVariable Integer segmentId, @RequestParam("granularity") String granularity, @RequestParam("statisticsDate") String statisticsDate) throws Exception {
        logger.info("/smsReachReports/report/{},granularity={},statisticsDate={}",segmentId,granularity,statisticsDate);
        SmsReachReportDto smsReachReportDto = smsReachReportService.findSmsReachReportDtoByDate(segmentId, statisticsDate, granularity);
        return new ResponseEntity(smsReachReportDto, HttpStatus.OK);
    }

    @ApiOperation(value = "通过pipeline_id和pipeline_node_id获取投放报告", notes = "通过pipeline_id和pipeline_node_id获取投放报告")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineId", value = "活动流程id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineNodeId", value = "活动流程节点id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期" , required = false, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/smsReachReports/report/{pipelineId}/{pipelineNodeId}", method = GET)
    @ResponseBody
    public ResponseEntity findByPipelineId(@PathVariable Integer pipelineId, @PathVariable String pipelineNodeId, @RequestParam
            ("granularity") String granularity, String statisticsDate) throws Exception {
        logger.info("/smsReachReports/report/{}/{},granularity={},statisticsDate={}", pipelineId, pipelineNodeId, granularity, statisticsDate);
        SmsReachReportDto smsReachReportDto = smsReachReportService.findByPipelineId(pipelineId, pipelineNodeId, granularity, statisticsDate);
        return new ResponseEntity(smsReachReportDto, HttpStatus.OK);
    }

    @ApiOperation(value = "下载短信通知报告", notes = "GET请求")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path"),
        @ApiImplicitParam(name = "type", value = "成功-success或失败-fail", required = true, dataType = "string", paramType = "path")
    })
    @RequestMapping(value = "/smsReachReports/report/detail/{segmentId}/{type}/download", method = GET)
    public ResponseEntity downloadNoticeReportDetail(HttpServletRequest request, HttpServletResponse response, @PathVariable Integer segmentId, @PathVariable String type) throws Exception {
        File file = null;
        String fileName = "";
        String successFlag = "success";
        String failFlag = "fail";
        String fileNotExist = "文件不存在";
        if (successFlag.equals(type)) {
            fileName = "report-details.csv";
        } else if (failFlag.equals(type)) {
            fileName = "report-fail-details.csv";
        } else {
            return new ResponseEntity("请求参数不存在数据", HttpStatus.METHOD_NOT_ALLOWED);
        }
        try {
            file = smsReachReportService.getNoticeFile(segmentId, fileName);
        } catch (Exception e) {
            if (StringUtils.isNotBlank(e.getMessage()) && e.getMessage().contains(fileNotExist)) {
            } else {
                logger.error("短信[SMS]通知失败报告下载发生异常", e);
            }
            return new ResponseEntity("短信运营商暂未提供数据", HttpStatus.NOT_FOUND);
        }
        if (file == null) {
            return new ResponseEntity("请求参数不存在数据", HttpStatus.METHOD_NOT_ALLOWED);
        }
        if (file.exists()) {
            download(request, response, file, file.getName());
        }
        logger.info("短信[SMS]通知失败报告临时存储：{}", file.getAbsolutePath());
        try {
            file.delete();
        } catch (SecurityException e) {
            logger.info("删除临时文件[{}]发生错误：", file.getAbsolutePath(), e);
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "通过pipelineId下载短信通知报告", notes = "GET请求")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineId", value = "活动流程id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineNodeId", value = "活动流程节点id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "type", value = "成功-success或失败-fail", required = true, dataType = "string", paramType = "path")
    })
    @RequestMapping(value = "/smsReachReports/report/detail/{pipelineId}/{pipelineNodeId}/{type}/download", method = GET)
    public ResponseEntity downloadNoticeReportDetailByPipelineId(HttpServletRequest request, HttpServletResponse response, @PathVariable Integer pipelineId, @PathVariable String pipelineNodeId, @PathVariable String type) throws Exception {
        File file = null;
        String fileName = "";
        String successFlag = "success";
        String failFlag = "fail";
        String fileNotExist = "文件不存在";
        if (successFlag.equals(type)) {
            fileName = "report-details.csv";
        } else if (failFlag.equals(type)) {
            fileName = "report-fail-details.csv";
        } else {
            return new ResponseEntity("请求参数不存在数据", HttpStatus.METHOD_NOT_ALLOWED);
        }
        try {
            file = smsReachReportService.getNoticeFileByPipelineId(pipelineId, pipelineNodeId, fileName);
        } catch (Exception e) {
            if (StringUtils.isNotBlank(e.getMessage()) && e.getMessage().contains(fileNotExist)) {
            } else {
                logger.error("短信[SMS]通知失败报告下载发生异常", e);
            }
            return new ResponseEntity("短信运营商暂未提供数据", HttpStatus.NOT_FOUND);
        }
        if (file == null) {
            return new ResponseEntity("请求参数不存在数据", HttpStatus.METHOD_NOT_ALLOWED);
        }
        if (file.exists()) {
            download(request, response, file, file.getName());
        }
        logger.info("短信[SMS]通知失败报告临时存储：{}", file.getAbsolutePath());
        try {
            file.delete();
        } catch (SecurityException e) {
            logger.info("删除临时文件[{}]发生错误：", file.getAbsolutePath(), e);
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "通过pipeline下载短信投放趋势表", notes = "通过pipeline下载短信投放趋势表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineId", value = "活动流程id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineNodeId", value = "活动流程节点id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期" , required = false, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/smsReachReports/report/trend/{pipelineId}/{pipelineNodeId}/download", method = GET)
    public ResponseEntity downloadSmsReportExcel(HttpServletResponse res, @PathVariable Integer pipelineId,
            @PathVariable String pipelineNodeId, @RequestParam String granularity, String statisticsDate) throws Exception {
        InputStream is = smsReachReportService.buildSmsExcelRows(pipelineId, pipelineNodeId, granularity, statisticsDate);
        String fileName = pipelineId + "_" + pipelineNodeId + ".xls";
        download(res, is, fileName);
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "通过segmentId下载短信投放趋势表", notes = "通过segmentId下载短信投放趋势表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "granularity", value = "时间粒度" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "statisticsDate", value = "统计的日期" , required = false, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/smsReachReports/report/trend/{segmentId}/download", method = GET)
    public ResponseEntity downloadSmsReportExcelBySegmentId(HttpServletResponse res, @PathVariable Integer segmentId,
            @RequestParam String granularity, String statisticsDate) throws Exception {
        InputStream is = smsReachReportService.buildSmsExcelRowsBySegmentId(segmentId, granularity, statisticsDate);
        String fileName = segmentId + ".xls";
        download(res, is, fileName);
        return new ResponseEntity(HttpStatus.OK);
    }
}

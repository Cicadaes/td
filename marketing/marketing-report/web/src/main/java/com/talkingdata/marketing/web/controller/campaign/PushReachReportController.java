package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.PushReachReport;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.PushReachReportPage;
import com.talkingdata.marketing.core.service.campaign.PushReachReportService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
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

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PUSH_REACH_REPORT PushReachReportService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-02-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Controller
@RequestMapping("/campaign")
public class PushReachReportController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PushReachReportController.class);

    @Autowired
    private PushReachReportService pushReachReportService;
    @Autowired
    private SegmentService segmentService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/pushReachReports", method = GET)
    @ResponseBody
    public List<PushReachReport> query(PushReachReportPage page) throws Exception {
        page.setOrderBy(PushReachReport.fieldToColumn(page.getOrderBy()));
        return pushReachReportService.queryByList(page);
    }

    @RequestMapping(value = "/pushReachReports/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PushReachReportPage page) throws Exception {
        page.setOrderBy(PushReachReport.fieldToColumn(page.getOrderBy()));
        List<PushReachReport> rows = pushReachReportService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pushReachReports/{id}", method = GET)
    @ResponseBody
    public PushReachReport find(@PathVariable Integer id) throws Exception {
        return pushReachReportService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pushReachReports", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PushReachReport create(@RequestBody PushReachReport pushReachReport) throws Exception {
        pushReachReportService.insert(pushReachReport);
        return pushReachReport;
    }

    @RequestMapping(value = "/pushReachReports", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody PushReachReport pushReachReport) throws Exception {
        pushReachReportService.updateByPrimaryKeySelective(pushReachReport);
    }

    @RequestMapping(value = "/pushReachReports/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pushReachReportService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PUSH_REACH_REPORT where id = {}", id);
    }

    /**
     * 获取投放效果报告列表数据
     */
    @RequestMapping(value = "/pushReachReports/segment/{segmentId}", method = GET)
    @ResponseBody
    public List<Map<String, Integer>> getByParam(@PathVariable Integer segmentId,
            String date, String all) throws Exception{
        return pushReachReportService.getBySegmentId(segmentId, date, all);
    }

    /**
     * 获取投放效果报告折线图数据
     */
    @RequestMapping(value = "/pushReachReports/trend", method = GET)
    @ResponseBody
    public List<Map<String, Integer>> getTrendByParam(Integer segmentId, String date,
            Integer hours, String tp, String all) throws Exception {
        return pushReachReportService.getTrendBySegmentId(segmentId,date,hours,tp, all);
    }

    /**
     * 通过pipelineId和pipelineNodeId获取投放效果报告列表数据
     */
    @RequestMapping(value = "/pushReachReports/segment/{pipelineId}/{pipelineNodeId}", method = GET)
    @ResponseBody
    public List<Map<String, Integer>> getByPipelineId(@PathVariable Integer pipelineId,
            @PathVariable String pipelineNodeId, String date, String all) throws Exception{
        return pushReachReportService.getByPipelineId(pipelineId, pipelineNodeId, date, all);
    }

    /**
     * 通过pipelineId和pipelineNodeId获取投放效果报告趋势
     */
    @RequestMapping(value = "/pushReachReports/trend/{pipelineId}/{pipelineNodeId}", method = GET)
    @ResponseBody
    public List<Map<String, Integer>> getTrendByPipelineId(@PathVariable Integer pipelineId,
            @PathVariable String pipelineNodeId, String date, Integer hours, String tp, String all) throws Exception{
        return pushReachReportService.getTrendByPipelineId(pipelineId, pipelineNodeId, date, hours, tp, all);
    }


    @ApiOperation(value = "下载应用投放趋势表", notes = "下载应用投放趋势表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "segmentId", value = "投放id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "hours", value = "统计的hour长度" , required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "date", value = "统计的开始日期" , required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "all", value = "全量下载标记" , required = false, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/pushReachReports/trend/{segmentId}/download", method = RequestMethod.GET)
    public void getTrendExcel(@PathVariable Integer segmentId,  @RequestParam Integer hours, String date,String all,HttpServletResponse res) throws Exception {
        Segment segment = segmentService.selectByPrimaryKey(segmentId);
        if(null == segment){
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NOT_EXIST);
        }
        PushReachReportPage page = new PushReachReportPage();
        page.setSegmentId(segmentId+"");
        InputStream is = pushReachReportService.generateStatExcel(page,date,hours, all);
        String fileName = getFileName(segment.getName(), hours)+".xls";
        download(res, is, fileName);
    }



    @ApiOperation(value = "下载应用投放趋势表", notes = "下载应用投放趋势表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineId", value = "活动流程id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineNodeId", value = "活动流程节点id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "hours", value = "统计的hour长度" , required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "date", value = "统计的开始日期" , required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "all", value = "全量下载标记" , required = false, dataType = "string", paramType = "query")
    })
    @RequestMapping(value = "/pushReachReports/report/trend/{pipelineId}/{pipelineNodeId}/download", method = GET)
    public ResponseEntity downloadSmsReportExcel( @PathVariable Integer pipelineId,@PathVariable String pipelineNodeId,
            @RequestParam Integer hours, String date,String all,HttpServletResponse res) throws Exception {
        PushReachReportPage page = new PushReachReportPage();
        page.setPipelineId(pipelineId+"");
        page.setPipelineNodeId(pipelineNodeId);
        InputStream is = pushReachReportService.generateStatExcel(page, date, hours,all);
        String fileName = getFileName(pipelineId + "_" + pipelineNodeId, hours);
        download(res, is, fileName);
        return new ResponseEntity(HttpStatus.OK);
    }


    private String getFileName(String prefix, Integer hours) {
        String timeRange = hours%24 == 0 ? hours/24+"日" : hours+"小时";
        return prefix + "_推送开始" + timeRange + "指标变化趋势表";
    }

}

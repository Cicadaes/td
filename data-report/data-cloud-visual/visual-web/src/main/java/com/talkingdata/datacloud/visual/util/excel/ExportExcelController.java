package com.talkingdata.datacloud.visual.util.excel;//package com.talkingdata.datacloud.visual.util.excel;
//
//
//import io.swagger.annotations.ApiOperation;
//import io.swagger.annotations.ApiResponse;
//import io.swagger.annotations.ApiResponses;
//import lombok.extern.slf4j.Slf4j;
//import org.apache.poi.hssf.usermodel.HSSFWorkbook;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.ResponseBody;
//import td.enterprise.common.constant.ParamConstants;
//import td.enterprise.common.util.*;
//import td.enterprise.page.*;
//import td.enterprise.service.*;
//import td.enterprise.service.manager.ParamService;
//import td.enterprise.web.util.BaseController;
//import td.enterprise.web.util.HeaderUtil;
//import td.enterprise.web.vm.*;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import javax.servlet.http.HttpSession;
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.IOException;
//import java.io.OutputStream;
//import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//
///**
// * 数据下载
// */
//@Slf4j
//@Controller
//@RequestMapping("/api")
//public class ExportExcelController extends BaseController {
//
//    private final String BASE_URL = "/api/exports";
//    private final String dateStr = "yyyy-MM-dd";
//    private final String rateStr = "%";
//    private final String minuteStr = "min";
//    private final String decimalFormatStr = "0.00";
//
//    @Autowired
//    private ProjectService projectService;
//
//    @Autowired
//    private ParamService paramService;
//
//    @Autowired
//    private MetricDayService metricDayService;
//
//    @Autowired
//    private MetricWeekService metricWeekService;
//
//    @Autowired
//    private MetricMonthService metricMonthService;
//
//    @ApiOperation(value = "项目管理列表数据导出到excel",
//            httpMethod = "GET",
//            response = ResponseEntity.class,
//            notes = "项目管理数据导出到excel")
//    @ApiResponses({
//            @ApiResponse(code = 200, message = "成功"),
//            @ApiResponse(code = 400, message = "未授权获取资源"),
//            @ApiResponse(code = 404, message = "资源不存在"),
//            @ApiResponse(code = 500, message = "服务器处理异常")
//    })
//    @RequestMapping(value = "/exports/download2excel/project", method = RequestMethod.GET)
//    @ResponseBody
//    public ResponseEntity <ExportVM> exportExcel4Project(ProjectPage page,HttpServletRequest request,HttpServletResponse response) throws Exception {
//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//        page.setStatus(1);
//        page.setPageEnabled(false);
//
//        List <ProjectListVM> result = projectService.queryList4Shop(page);
//        if(result !=null) {
//            String title = "项目列表";
//            String[] rowsName = new String[]{"序号", "项目名称","shop_code", "更新时间", "下游数量","门址信息"};
//            List<Object[]> dataList = new ArrayList<Object[]>();
//            Object[] objs = null;
//            for (int i = 0; i < result.size(); i++) {
//                ProjectListVM pjtvm = result.get(i);
//                objs = new Object[rowsName.length];
//                objs[0] = i+1;
//                objs[1] = pjtvm.getProjectName();
//                objs[2] = pjtvm.getProjectNum();
//                objs[3] = dateFormat.format(pjtvm.getUpdateTime());
//                objs[4] = pjtvm.getDownNums();
//                objs[5] = pjtvm.getProjectPosition();
//
//                dataList.add(objs);
//            }
//
//            ExportExcelUtil ex = new ExportExcelUtil(title, rowsName, dataList);
//            HSSFWorkbook wb = ex.export(response);
//
//            String sharePath = paramService.queryByParamKey(ParamConstants.SHARE_ATTACHMENT_PATH).getParamValue();
//            String exportFolder = sharePath + "/attachment/wifianalytics/export";
//            File file = new File(exportFolder);
//            file.mkdirs();//创建导出目录
//
//            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
//            ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));
//            HttpSession session = request.getSession();
//            session.setAttribute(uuid, exportFolder + "/" + uuid);
//            session.setAttribute(uuid + "_fileName", title);
//            ExportVM vm = new ExportVM();
//            vm.setAttachId(uuid);
//            return new ResponseEntity <ExportVM>(vm, HttpStatus.OK);
//
//        }else{
//            throw new Exception();
//        }
//    }
//
//    @ApiOperation(value = "排行榜列表数据导出到excel",
//            httpMethod = "GET",
//            response = ResponseEntity.class,
//            notes = "排行榜列表数据导出到excel")
//    @ApiResponses({
//            @ApiResponse(code = 200, message = "成功"),
//            @ApiResponse(code = 400, message = "未授权获取资源"),
//            @ApiResponse(code = 404, message = "资源不存在"),
//            @ApiResponse(code = 500, message = "服务器处理异常")
//    })
//    @RequestMapping(value = "/exports/download2excel/metricDay", method = RequestMethod.GET)
//    @ResponseBody
//    public  ResponseEntity <ExportVM> exportExcel(MetricDayPage metricDayPage,HttpServletRequest request,HttpServletResponse response) throws Exception {
//
//        // todo 需要传递的参数如下
////        metricDayPage.setStartDate("2017-11-04");
////        metricDayPage.setEndDate("2017-12-03");
////        metricDayPage.setJoinFlag(0);
////        metricDayPage.setProjectType(1);
////        metricDayPage.setPageEnabled(false);
////        metricDayPage.setRangeQueryFlag(0);
//
//        metricDayPage.setPageEnabled(false);
//
//        List <MetricDayVM> metricDayS = null;
//        // 判断是 天范围查询 还是 周范围查询 或 月范围查询，
//        // TODO 返回结果类型均为MetricDayVM ?
//        if(metricDayPage.getRangeQueryFlag()==0){ // 天范围查询，
//            metricDayS = metricDayService.queryByListWithChain(metricDayPage);
//        }else if(metricDayPage.getRangeQueryFlag()==1){ // 周范围查询
//            metricDayS = metricWeekService.queryByListWithChain(metricDayPage);
//        }else if(metricDayPage.getRangeQueryFlag()==2){  // 月范围查询
//            metricDayS = metricMonthService.queryByListWithChain(metricDayPage);
//        }
//
//        if(metricDayS !=null){
//            String title = "排行榜页面导出";
//            String[] rowsName = new String[]{"序号","shop_code","项目名称","入店客流","环比","周边客流","环比","停留客流","环比","跳出客流","环比","微信认证数","环比","短信认证数","环比","新客占比","环比","老客占比","环比","高活跃客占比","环比","中活跃客占比","环比","低活跃客占比","环比","沉睡客占比","环比","次均停留时长","环比","入店率","环比","停留率","环比","跳出率","环比","销售金额","环比","订单数","环比","订单均价","环比","件单价","环比"};
//            List<Object[]>  dataList = new ArrayList<Object[]>();
//            Object[] objs = null;
//            for (int i = 0; i < metricDayS.size(); i++) {
//                MetricDayVM man = metricDayS.get(i);
//                objs = new Object[rowsName.length];
//                objs[0] = i+1;
//                objs[1] = man.getProjectNum();
//                objs[2] = man.getProjectName();
//
//                objs[3] = man.getActiveUsers(); // 入店客流
//                objs[4] = man.getActiveUsersChainRate() * transRateFlagToNum(man.getActiveUsersChainRateFlag());
//
//                objs[5] = man.getFrontUsers(); // 周边客流
//                objs[6] = man.getFrontUsersChainRate() * transRateFlagToNum(man.getFrontUsersChainRateFlag());
//
//                objs[7] = man.getStayUsers(); // 停留客流
//                objs[8] = man.getStayUsersChainRate() * transRateFlagToNum(man.getStayUsersChainRateFlag());
//
//                objs[9] = man.getJumpUsers(); // 跳出客流
//                objs[10] = man.getJumpUsersChainRate() * transRateFlagToNum(man.getJumpUsersChainRateFlag());
//
//                objs[11] = man.getPotentialCount(); // 微信认证数
//                objs[12] = man.getPotentialCountChainRate() * transRateFlagToNum(man.getPotentialCountChainRateFlag());
//
//                objs[13] = man.getMemberCount(); // 短信认证数
//                objs[14] = man.getMemberCountChainRate() * transRateFlagToNum(man.getMemberCountChainRateFlag());
//
//                objs[15] = man.getActiveUserNewRate(); // 新客占比
//                objs[16] = man.getActiveUserNewRateChainRate() * transRateFlagToNum(man.getActiveUserNewRateChainRateFlag());
//
//                objs[17] = man.getActiveUserOldRate(); // 老客占比
//                objs[18] = man.getActiveUserOldRateChainRate() * transRateFlagToNum(man.getActiveUserOldRateChainRateFlag());
//
//                objs[19] = man.getHighRate(); // 高活跃客占比
//                objs[20] = man.getHighRateChainRate() * transRateFlagToNum(man.getHighRateChainRateFlag());
//
//                objs[21] = man.getMiddleRate(); // 中活跃客占比
//                objs[22] = man.getMiddleRateChainRate() * transRateFlagToNum(man.getMiddleRateChainRateFlag());
//
//                objs[23] = man.getLowRate(); // 低活跃客占比
//                objs[24] = man.getLowRateChainRate() * transRateFlagToNum(man.getLowRateChainRateFlag());
//
//                objs[25] = man.getSleepRate(); // 沉睡客占比
//                objs[26] = man.getSleepRateChainRate() * transRateFlagToNum(man.getSleepRateChainRateFlag());
//
//                objs[27] = man.getStayDurationPerTime(); // 次均停留时长
//                objs[28] = man.getStayDurationPerTimeChainRate() * transRateFlagToNum(man.getStayDurationPerTimeChainRateFlag());
//
//                objs[29] = man.getEnterRate(); // 入店率
//                objs[30] = man.getEnterRateChainRate() * transRateFlagToNum(man.getEnterRateChainRateFlag());
//
//                objs[31] = man.getStayRate(); // 停留率
//                objs[32] = man.getStayRateChainRate() * transRateFlagToNum(man.getStayRateChainRateFlag());
//
//                objs[33] = man.getJumpRate(); // 跳出率
//                objs[34] = man.getJumpRateChainRate() * transRateFlagToNum(man.getJumpRateChainRateFlag());
//
//                objs[35] = man.getSalesAmount(); // 销售金额
//                objs[36] = man.getSalesAmountChainRate() * transRateFlagToNum(man.getSalesAmountChainRateFlag());
//
//                objs[37] = man.getOrderCount(); // 订单数
//                objs[38] = man.getOrderCountChainRate() * transRateFlagToNum(man.getOrderCountChainRateFlag());
//
//                objs[39] = man.getOrderAveragePrice(); // 订单均价
//                objs[40] = man.getOrderAveragePriceChainRate() * transRateFlagToNum(man.getOrderAveragePriceChainRateFlag());
//
//                objs[41] = man.getSingularPrice(); // 件单价
//                objs[42] = man.getSingularPriceChainRate() * transRateFlagToNum(man.getSingularPriceChainRateFlag());
//
//                dataList.add(objs);
//            }
//
//            ExportExcelUtil ex = new ExportExcelUtil(title, rowsName, dataList);
//            HSSFWorkbook wb = ex.export(response);
//
//            String sharePath = paramService.queryByParamKey(ParamConstants.SHARE_ATTACHMENT_PATH).getParamValue();
//            String exportFolder = sharePath + "/export";
//            File file = new File(exportFolder);
//            file.mkdirs();//创建导出目录
//
//            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
//            ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));
//            HttpSession session = request.getSession();
//            session.setAttribute(uuid, exportFolder + "/" + uuid);
//            session.setAttribute(uuid + "_fileName", title);
//            ExportVM vm = new ExportVM();
//            vm.setAttachId(uuid);
//            return new ResponseEntity <ExportVM>(vm, HttpStatus.OK);
//
//        }else{
//            throw new Exception();
//        }
//    }
//
//    public  int  transRateFlagToNum(String upOrDownFlag){
//        if("UP".equalsIgnoreCase(upOrDownFlag)){
//            return 1;
//        }
//        return -1;
//    }
//
//    @RequestMapping(value = "/exports/getExportExcel/{uuid}", method = RequestMethod.GET)
//    @ResponseBody
//    public ResponseEntity <Void> getExportExcel(@PathVariable("uuid") String uuid, HttpServletRequest request, HttpServletResponse response) throws IOException {
//        HttpSession session = request.getSession();
//        String filePath = (String) session.getAttribute(uuid);
//        String fileName = session.getAttribute(uuid + "_fileName") + ".xls";
//        try {
//            String agent = request.getHeader("USER-AGENT");
//            String downLoadName = null;
//            if (null != agent && (-1 != agent.indexOf("MSIE") || agent.contains("Trident"))) // IE
//            {
//                downLoadName = java.net.URLEncoder.encode(fileName, "UTF-8");
//            } else if (null != agent && -1 != agent.indexOf("Mozilla")) // Firefox
//            {
//                downLoadName = new String(fileName.getBytes("UTF-8"), "iso-8859-1");
//            }
//            // 设置response的Header
//            response.setContentType("application/octet-stream");
//            response.addHeader("Content-Disposition", "attachment;filename=" + downLoadName);
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return new ResponseEntity <>(HttpStatus.INTERNAL_SERVER_ERROR);
//
//        }
//        FileInputStream inputStream = null;
//        OutputStream os = null;
//        try {
//            if (filePath != null) {
//                inputStream = new FileInputStream(filePath);
//                os = response.getOutputStream();
//                byte[] buffer = new byte[1024];
//                int size = 0;
//                while ((size = inputStream.read(buffer, 0, 1024)) > 0) {
//                    os.write(buffer, 0, size);
//                }
//                os.flush();
//
//                session.removeAttribute(uuid); // 用完后从session中移除
//                session.removeAttribute(uuid + "_fileName");
//                new File(filePath).delete();//删除临时文件
//                return ResponseEntity.ok().headers(HeaderUtil.createAlert("A excel is deleted with identifier "
//                        + uuid, uuid)).build();
//            } else {
//                log.error("没有从session中拿到excel");
//                return new ResponseEntity <>(HttpStatus.NOT_FOUND);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity <>(HttpStatus.INTERNAL_SERVER_ERROR);
//        } finally {
//            if (null != inputStream)
//                inputStream.close();
//            if (null != os) {
//                os.close();
//            }
//        }
//    }
//}

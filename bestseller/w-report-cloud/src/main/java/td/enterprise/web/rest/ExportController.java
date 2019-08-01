package td.enterprise.web.rest;

import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yaml.snakeyaml.util.UriEncoder;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.entity.*;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.*;
import td.enterprise.service.*;
import td.enterprise.service.DTO.Tag;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 数据下载
 */
@Slf4j
public class ExportController extends BaseController {

    private final String BASE_URL = "/api/exports";
    private final String dateStr = "yyyy-MM-dd";
    private final String rateStr = "%";
    private final String minuteStr = "min";
    private final String decimalFormatStr = "0.00";
    @Autowired
    private PassengerTrendService passengerTrendService;
    @Autowired
    private ProjectDistService projectDistService;
    @Autowired
    private PassengerDistService passengerDistService;
    @Autowired
    private CrowdService crowdService;
    @Autowired
    private PassengerPeopleService passengerPeopleService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private TenantTagsCountService tenantTagsCountService;

    @Inject
    private MessageSource messageSource;

    @Autowired
    private TargetService targetService;

    // add begin by yunlong.wang at 20160909 for 到访深度导出
    @Autowired
    private VisitDepthService visitDepthService;
    // add end by yunlong.wang at 20160909 for 到访深度导出

    @Autowired
    private TargetManagementService targetManagementService;

    @Autowired
    private ParamService paramService;

    @Autowired
    private ProjectAttributeService projectAttributeService;

    @Autowired
    private SensorService sensorService;

    @Autowired
    private CompeteSourceService competeSourceService;

    private static Map <String, String> dataTitleMap;

    public static void main(String[] args) {
        // DecimalFormat decimalFormat=new DecimalFormat(".00");
        // DecimalFormat decimalFormat1=new DecimalFormat("#.##");
        Map <String, String> map = toHashMap("{\"aa\":\"1\",\"cc\":\"2\",\"bb\":\"3\"}");
        log.info(map.toString());

        log.info(filterDataTitle(1).get("TodayPassengerFlow"));
    }

    /**
     * 管理列表数据导出到excel
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "数据导出到excel",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "数据导出到excel")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/exports/download2excel", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <ExportVM> downloadToExcel(ExportParam exportParam, HttpServletRequest request) throws Exception {
        if (exportParam == null || exportParam.getExportType().isEmpty()) {
            return new ResponseEntity <>(HttpStatus.NOT_FOUND);
        }
        HSSFWorkbook wb = null;
        String fileName = "";
        String exportType = exportParam.getExportType();
        switch (exportType) {
            case ReportConstants.ExportType.EXPORT_TYPE_PROJECT_PRINCIPAL:
                //店铺负责人信息报表
                fileName = "店铺负责人信息";
                wb = exportProjectPrincipal(wb);
                break;
            case ReportConstants.ExportType.EXPORT_TYPE_PROJECT_GENERAL:
                //设备概况报表
                fileName = "设备概况";
                Integer projectId = exportParam.getProjectId();
                ProjectDetailVM projectDetailVM = projectService.projectDetail(projectId+"");
                fileName = projectDetailVM.getProjectName() + fileName ;
                wb = exportProjectGeneral(wb, projectDetailVM);
                break;
            case ReportConstants.ExportType.EXPORT_TYPE_SENSOR_DETAIL:
                //探针详情报表
                fileName = "探针详情";
                wb = exportSensorDetail(wb,exportParam);
                break;
            case ReportConstants.ExportType.EXPORT_TYPE_SENSOR_LIST:
                //探针列表报表
                fileName = "探针列表";
                wb = exportSensorList(wb, exportParam);
                break;
            case ReportConstants.ExportType.EXPORT_TYPE_COMPETE_PROJECTS:
                //竞品列表
                fileName = "竞品列表";
                wb = exportCompeteProjects(wb, exportParam);
                break;
            case ReportConstants.ExportType.EXPORT_TYPE_COMPETE_SOURCES:
                //竞品数据源列表
                fileName = "竞品数据源列表";
                wb = exportCompeteSources(wb, exportParam);
                break;
            case ReportConstants.ExportType.EXPORT_TYPE_PROJECT_DETAIL_SENSORS:
                //项目详情-探针报表
                fileName = "设备概况";
                Integer projectId1 = exportParam.getProjectId();
                ProjectDetailVM projectDetailVM1 = projectService.projectDetail(projectId1 + "");
                fileName = projectDetailVM1.getProjectName() + fileName ;
                wb = exportProjectDetail(projectDetailVM1, projectId1, fileName);
                break;
            default:
                break;
        }
        String sharePath = paramService.queryByParamKey(ParamConstants.SHARE_ATTACHMENT_PATH).getParamValue();
        String exportFolder = sharePath + "/export";
        File file = new File(exportFolder);
        file.mkdirs();//创建导出目录
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));
        HttpSession session = request.getSession();
        session.setAttribute(uuid, exportFolder + "/" + uuid);
        session.setAttribute(uuid + "_fileName", fileName);
        ExportVM vm = new ExportVM();
        vm.setAttachId(uuid);
        return new ResponseEntity <ExportVM>(vm, HttpStatus.OK);
    }

    private HSSFWorkbook exportCompeteSources(HSSFWorkbook wb, ExportParam exportParam) {
        wb = new HSSFWorkbook();

        CompeteSourcePage page = new CompeteSourcePage();
        page.setQ(exportParam.getQ());
        if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
            page.setQ(UriEncoder.decode(page.getQ()));
        }
        page.setPageEnabled(false);
        List <CompeteSource> rows = competeSourceService.queryByList(page);

        String sheetName = "Sheet1";
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        int rownum = 0;
        HSSFRow row_1_1 = sheet1.createRow(rownum++);
        int column = 0;
        row_1_1.createCell(column++).setCellValue("数据源类型");
        row_1_1.createCell(column++).setCellValue("创建时间");
        row_1_1.createCell(column++).setCellValue("更新时间");
        row_1_1.createCell(column++).setCellValue("备注");
        if (null != rows) {
            for (int i = 0; i < rows.size(); i++) {

                HSSFRow row_1_n = sheet1.createRow(rownum++);
                column = 0;
                row_1_n.createCell(column++).setCellValue(rows.get(i).getDataSource());
                row_1_n.createCell(column++).setCellValue(rows.get(i).getCreateTime());
                row_1_n.createCell(column++).setCellValue(rows.get(i).getUpdateTime());
                row_1_n.createCell(column++).setCellValue(rows.get(i).getRemark());
            }

        }
        return wb;
    }

    private HSSFWorkbook exportCompeteProjects(HSSFWorkbook wb, ExportParam exportParam) throws Exception {
        wb = new HSSFWorkbook();

        ProjectPage page = new ProjectPage();
        page.setQ(exportParam.getQ());
        if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
            page.setQ(UriEncoder.decode(page.getQ()));
        }
        page.setPageEnabled(false);
        List <CompeteProjectVM> rows = projectService.queryComProject(page, true);

        String sheetName = "Sheet1";
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        int rownum = 0;
        HSSFRow row_1_1 = sheet1.createRow(rownum++);
        int column = 0;
        row_1_1.createCell(column++).setCellValue("项目ID");
        row_1_1.createCell(column++).setCellValue("项目简称");
        row_1_1.createCell(column++).setCellValue("房间数量");
        row_1_1.createCell(column++).setCellValue("SSID数量");
        row_1_1.createCell(column++).setCellValue("数据源类型");
//        row_1_1.createCell(column++).setCellValue("客流时段");
        if (null != rows) {
            for (int i = 0; i < rows.size(); i++) {

                HSSFRow row_1_n = sheet1.createRow(rownum++);
                column = 0;
                row_1_n.createCell(column++).setCellValue(rows.get(i).getProjectNum());
                row_1_n.createCell(column++).setCellValue(rows.get(i).getProjectName());
                row_1_n.createCell(column++).setCellValue(rows.get(i).getRoomCount());
                row_1_n.createCell(column++).setCellValue(rows.get(i).getSsidCount());
                row_1_n.createCell(column++).setCellValue(rows.get(i).getDataSources());
            }

        }
        return wb;
    }

    /**
     * 数据导出到excel
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "数据导出到excel",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "数据导出到excel")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/exports/export2excel", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <ExportVM> download(ExportParam exportParam, HttpServletRequest request) throws Exception {

        //TODO 从Session中拿
        Locale locale = Locale.forLanguageTag("zh_cn");

        if (exportParam == null || exportParam.getExportType().isEmpty()) {
            return new ResponseEntity <>(HttpStatus.NOT_FOUND);
        }  else {
            HSSFWorkbook wb = null;
            String exportType = exportParam.getExportType();
            String fileName = "";

            String tenantId = UserInfoUtil.getUser().getTenantId() + "";

            int projectId = exportParam.getProjectId();
            Date startDate = DateUtil.format(exportParam.getStartDate(), "yyyy-MM-dd");
            Date endDate = DateUtil.format(exportParam.getEndDate(), "yyyy-MM-dd");

            String start = exportParam.getStartDate();
            String end = exportParam.getEndDate();

            String startDateStr = exportParam.getStartDate();
            String endDateStr = exportParam.getEndDate();

            Map <String, Object> dataMap = new LinkedHashMap <>();
            String projectName = getProjectName(projectId);
            String pixName = projectName + "(" + exportParam.getStartDate() + "至" + exportParam.getEndDate() + ")";
            Project project = projectService.selectByPrimaryKey(projectId);
            dataTitleMap = filterDataTitle(project.getProjectType());
            BasePage page = new BasePage();
            page.setPageEnabled(false);
            List <Map <String, Object>> key5 = new ArrayList <>();
            switch (exportType) {
                // 客群概览 start
                case ReportConstants.ExportType.EXPORT_TYPE_PASSENGER_TREND_30:
                    fileName = pixName + dataTitleMap.get("ThirtyDaysPassengerTrend");// 近30日客流趋势";
                    dataMap.put("有效客流", passengerTrendService.getPassengerTrendDataList(projectId, start, end, TrendTypeEnum.ACTIVE));
                    dataMap.put("有效客流汇总", passengerTrendService.getPassengerSummaryData(projectId, start, end, TrendTypeEnum.ACTIVE));
                    dataMap.put("停留人数", passengerTrendService.getPassengerTrendDataList(projectId, start, end, TrendTypeEnum.STAY));
                    dataMap.put("停留人数汇总", passengerTrendService.getPassengerSummaryData(projectId, start, end, TrendTypeEnum.STAY));
                    wb = exportPassengerTrendData(dataMap, false);
                    break;

                case "TargetManagement":
                    fileName = projectName + "_目标管理";

                    TargetManagementPage targetPage = new TargetManagementPage();
                    targetPage.setPageEnabled(false);
                    targetPage.setTenantId(tenantId);
                    targetPage.setProjectId(projectId);
                    targetPage.setListType(1);

                    dataMap.put("目标列表", targetManagementService.queryByNotFinishListDesc(targetPage));
                    targetPage.setListType(2);
                    dataMap.put("历史", targetManagementService.queryFinishList(targetPage));

                    wb = exportTargetData(dataMap);
                    break;

                case ReportConstants.ExportType.EXPORT_TYPE_ROOM_TOP10_FLOW:
                    fileName = pixName + dataTitleMap.get("TOP10RoomPassengerFlow");
                    // Top10店铺客流
                    Map <String, List> dataMap1 = new LinkedHashMap <>();
                    String chartCategory = exportParam.getChartCatagory();

                    dataMap1.put("进店客流", projectDistService.getRoomTopFlowDataForChain(exportParam.getStartDate(), exportParam.getEndDate(), projectId, "active", chartCategory));
                    dataMap1.put("新客", projectDistService.getRoomTopFlowDataForChain(exportParam.getStartDate(), exportParam.getEndDate(), projectId, "new", chartCategory));
                    dataMap1.put("老客", projectDistService.getRoomTopFlowDataForChain(exportParam.getStartDate(), exportParam.getEndDate(), projectId, "old", chartCategory));
                    dataMap1.put("停留客流", projectDistService.getRoomTopFlowDataForChain(exportParam.getStartDate(), exportParam.getEndDate(), projectId, "stay", chartCategory));
                    dataMap1.put("停留率", projectDistService.getChainTopRateFlowData(exportParam.getStartDate(), exportParam.getEndDate(), projectId, "stayRate", chartCategory));
                    dataMap1.put("次均停留时长", projectDistService.getRoomTopFlowDataForChain(exportParam.getStartDate(), exportParam.getEndDate(), projectId, "duration", chartCategory));
                    wb = exportRoomTopData(dataMap1, startDate, endDate, chartCategory);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_ROOM_TOP10_EFFECT:
                    fileName = pixName + dataTitleMap.get("TOP10EffectiveRoom");// "Top10店铺客流密度（人/㎡/天）";
                    Map <String, Object> data2 = new LinkedHashMap <>();
                    data2.put(dataTitleMap.get("TOP10EffectiveRoomEnterDensity")/* "进店客流密度" */,
                            projectDistService.getRoomTopEffectData(tenantId, projectId, exportParam.getStartDate(), exportParam.getEndDate(), "enter"));
                    data2.put("停留客流密度", projectDistService.getRoomTopEffectData(tenantId, projectId, exportParam.getStartDate(), exportParam.getEndDate(), "stay"));
                    wb = exportRoomEffectTopData(data2, startDate, endDate);
                    break;
                // 客群概览 end
                // 客流分布 start
                case ReportConstants.ExportType.EXPORT_TYPE_PASSENGER_DISTRIBUTION:
                    fileName = pixName + "客流分布";
                    Map <String, Object> dataMap3 = new LinkedHashMap <>();
                    dataMap3.put("客流分布", passengerDistService.getPassengerDistributionDataByDate(exportParam.getStartDate(), exportParam.getEndDate(), projectId));
                    wb = exportPassengerDistributionData(dataMap3, startDate, endDate);
                    break;
                // 客流分布 end
                // 客流趋势 start
                case ReportConstants.ExportType.EXPORT_TYPE_PASSENGER_TREND_ACTIVE_TIME:
                    fileName = pixName + "客流到访时段";
                    Map <String, Object> dataMap4 = new LinkedHashMap <>();
                    dataMap4.put("客流到访时段", passengerTrendService.getPassengnerTrendTopDataForExport(exportParam.getStartDate(), exportParam.getEndDate(), projectId));
                    wb = exportPassengerTrendActiveTimeData(dataMap4, startDate, endDate);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_PASSENGER_TREND_CHART:
                    fileName = pixName + "客流趋势";
                    Map <String, Object> dataMap5 = new LinkedHashMap <>();

                    dataMap5.put("有效客流", passengerTrendService.getPassengerTrendDataList(projectId, start, end, TrendTypeEnum.ACTIVE));
                    dataMap5.put("有效客流汇总", passengerTrendService.getPassengerSummaryData(projectId, start, end, TrendTypeEnum.ACTIVE));
                    dataMap5.put("停留人数", passengerTrendService.getPassengerTrendDataList(projectId, start, end, TrendTypeEnum.STAY));
                    dataMap5.put("停留人数汇总", passengerTrendService.getPassengerSummaryData(projectId, start, end, TrendTypeEnum.STAY));
                    dataMap5.put("停留率", passengerTrendService.getPassengerStayRateList(projectId, start, end));
                    wb = exportPassengerTrendData(dataMap5, true);
                    break;
                case ReportConstants.ExportType.ExpORT_TYPE_PASSENGER_TREND_DETAIL_ACTIVE:
                    // 客流明细
                    fileName = pixName + "有效客流明细";
                    Map <String, Object> dataMap6 = new LinkedHashMap <>();

                    PassengerCompareVM passengerTrendDataList = passengerTrendService.getPassengerTrendDataList(projectId, exportParam.getStartDate(), exportParam.getEndDate(), TrendTypeEnum.ACTIVE);
                    dataMap6.put("有效客流", passengerTrendDataList);
                    // passengerTrendDataList = passengerTrendService.getPassengerTrendDataList(projectId, exportParam.getStartDate(), exportParam.getEndDate(), TrendTypeEnum.STAY);
                    // dataMap6.put("停留客流", passengerTrendDataList);
                    // PassengerCompareVM passengerStayRateList = passengerTrendService.getPassengerStayRateList(projectId, exportParam.getStartDate(), exportParam.getEndDate());
                    // dataMap6.put("停留率", passengerStayRateList);
                    wb = exportDetailDataByType(dataMap6, startDate, endDate);
                    break;
                case ReportConstants.ExportType.ExpORT_TYPE_PASSENGER_TREND_DETAIL_ENTER:
                    // 进店明细
                    fileName = pixName + "进店客流明细";
                    Map <String, Object> dataMap7 = new LinkedHashMap <>();
                    key5 = passengerTrendService.getPassengerTrendEnterDetailData(exportParam.getStartDate(), exportParam.getEndDate(), projectId, page);
                    dataMap7.put("进店客流", key5);
                    wb = exportDetailDataByType(dataMap7, startDate, endDate);
                    break;
                case ReportConstants.ExportType.ExpORT_TYPE_PASSENGER_TREND_DETAIL_STAY:
                    // 停留明细
                    fileName = pixName + "停留客流明细";
                    Map <String, Object> dataMap8 = new LinkedHashMap <>();
                    passengerTrendDataList = passengerTrendService.getPassengerTrendDataList(projectId, exportParam.getStartDate(), exportParam.getEndDate(), TrendTypeEnum.STAY);
                    dataMap8.put("停留客流", passengerTrendDataList);
                    wb = exportDetailDataByType(dataMap8, startDate, endDate);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_PASSENGER_TREND_DETAIL_STAY_RATE:
                    // 进店率明细
                    fileName = pixName + "停留率明细";
                    Map <String, Object> dataMap9 = new LinkedHashMap <>();
                    PassengerCompareVM passengerStayRateList = passengerTrendService.getPassengerStayRateList(projectId, exportParam.getStartDate(), exportParam.getEndDate());
                    dataMap9.put("停留率", passengerStayRateList);
                    wb = exportDetailDataByType(dataMap9, startDate, endDate);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_PASSENGER_TREND_DETAIL_ENTER_RATE:
                    // 进店率明细
                    fileName = pixName + "进店率明细";
                    dataMap9 = new LinkedHashMap <>();
                    key5 = passengerTrendService.getPassengerTrendStayRateDetailData(exportParam.getStartDate(), exportParam.getEndDate(), projectId, page);
                    dataMap9.put("进店率", key5);
                    wb = exportDetailDataByType(dataMap9, startDate, endDate);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_ROOM_DIST_DETAIL_ACTIVE:
                    // TD_INSTALL_INFO分布-客流明细
                    fileName = pixName + "房店分布客流明细";
                    // List <ProjectAverageDetailVM> averageListData = passengerTrendService.getAverageListData(exportParam.getStartDate(), exportParam.getEndDate(), projectId);
                    Map <String, Object> dataMap10 = new LinkedHashMap <>();
                    // if (!"false".equals(dataTitleMap.get("RoomCompareShow"))) {
                    dataMap10.put("房店分布客流", passengerTrendService.getAverageListData(exportParam.getStartDate(), exportParam.getEndDate(), projectId));
                    // }
                    wb = exportDetailDataByType(dataMap10, startDate, endDate);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_PASSENGER_PEOPLE:
                    fileName = pixName + "客群画像人口属性";
                    Map params = new HashMap <>();
                    int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDateStr, endDateStr);
                    dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                    // params.put("cycleStatistics", dateLength);
                    String lastEnd = DateUtil.monthChange(end, dateStr, 1);

                    params.put("runDate", lastEnd);
                    String crowd1 = String.valueOf(exportParam.getCrowd1Id());
                    String crowd2 = String.valueOf(exportParam.getCrowd2Id());
                    List <Map <String, List <Tag>>> list = new ArrayList <>();
                    Map <String, Object> dataMap11 = new LinkedHashMap <>();
                    if (crowd1 != null && !"".equals(crowd1)) {
                        Crowd crowd = crowdService.selectByPrimaryKey(crowd1);
                        params.put("projectId", Integer.parseInt(crowd.getAttr1()));
                        Project project1 = projectService.selectByPrimaryKey(Integer.parseInt(crowd.getAttr1()));

                        if (crowd != null) {
                            Map <String, Object> valueMap = new HashMap <>();
                            params.put("crowdId", Integer.valueOf(crowd1));

                            Map peopleProp = new HashMap();
                            params.put("runDate", lastEnd);
                            SexVM sexRateVM = crowdService.getSexRateVM(params);
                            peopleProp.put("sexVM", sexRateVM);
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            AgeDistributionVM ageDistributionVM = crowdService.queryAgeDistribution(params);
                            peopleProp.put("ageDistributionVM", ageDistributionVM);
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            MarryCarChildVM marryCarChild = crowdService.getMarryCarChild(params);
                            peopleProp.put("marryCarChildVM", marryCarChild);
                            valueMap.put("人口属性", peopleProp);

                            Map <String, List <Tag>> expenseMap = new HashMap <>();
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            expenseMap.putAll(crowdService.queryPhoneType(params, false));
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            expenseMap.putAll(crowdService.queryPhonePrice(params, false));
                            valueMap.put("消费能力", expenseMap);

                            Map <String, List <TenantTagsCount>> appMap = new HashMap <>();
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            List <TenantTagsCount> tagsList = tenantTagsCountService.selectForRadar(params);
                            appMap.put("radar", tagsList);
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            List <TenantTagsCount> tenantTagsCountList = tenantTagsCountService.selectAppPreference(params);
                            appMap.put("appPreference", tenantTagsCountList);
                            valueMap.put("应用偏好", appMap);

                            dataMap11.put(project1.getProjectName()+"_"+crowd.getName(), valueMap);
                        }
                    }
                    if (crowd2 != null && !"".equals(crowd2) && !"-1".equals(crowd2)) {
                        Crowd crowd = crowdService.selectByPrimaryKey(crowd2);
                        params.put("projectId", Integer.parseInt(crowd.getAttr1()));
                        Project project2 = projectService.selectByPrimaryKey(crowd.getAttr1());

                        if (crowd != null) {
                            Map <String, Object> valueMap = new HashMap <>();
                            params.put("crowdId", Integer.valueOf(crowd2));

                            Map peopleProp = new HashMap();
                            params.put("runDate", lastEnd);
                            SexVM sexRateVM = crowdService.getSexRateVM(params);
                            peopleProp.put("sexVM", sexRateVM);
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            AgeDistributionVM ageDistributionVM = crowdService.queryAgeDistribution(params);
                            peopleProp.put("ageDistributionVM", ageDistributionVM);
                            params.put("runDate", lastEnd);
                            MarryCarChildVM marryCarChild = crowdService.getMarryCarChild(params);
                            peopleProp.put("marryCarChildVM", marryCarChild);
                            valueMap.put("人口属性", peopleProp);

                            Map <String, List <Tag>> expenseMap = new HashMap <>();
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            expenseMap.putAll(crowdService.queryPhoneType(params, false));
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            expenseMap.putAll(crowdService.queryPhonePrice(params, false));
                            valueMap.put("消费能力", expenseMap);

                            Map <String, List <TenantTagsCount>> appMap = new HashMap <>();
                            params.put("runDate", lastEnd);
                            params.put("list", null);
                            List <TenantTagsCount> tagsList = tenantTagsCountService.selectForRadar(params);
                            appMap.put("radar", tagsList);
                            params.put("runDate", lastEnd);
                            List <TenantTagsCount> tenantTagsCountList = tenantTagsCountService.selectAppPreference(params);
                            appMap.put("appPreference", tenantTagsCountList);
                            valueMap.put("应用偏好", appMap);

                            dataMap11.put(project2.getProjectName() + "_" + crowd.getName(), valueMap);
                        }
                    }
                    wb = exportPassengerPeopleData(dataMap11, startDate, endDate);
                    break;

                // add begin by yunlong.wang at 20160909 for 到访深度导出
                case ReportConstants.ExportType.EXPORT_TYPE_DEEP_VISIT_TOP:
                    // 到访深度
                    fileName = pixName + "到访深度统计";
                    Map <String, Object> dataMap_10 = new LinkedHashMap <>();
                    dataMap_10.put("到访深度", visitDepthService.getDepthSummary(projectId, exportParam.getStartDate(), exportParam.getEndDate()));
                    dataMap_10.put("驻留时长", visitDepthService.visitTimesDuration(projectId, exportParam.getStartDate(), exportParam.getEndDate()));
                    dataMap_10.put("进店数量", visitDepthService.enterRoomDegreeList(projectId, exportParam.getStartDate(), exportParam.getEndDate(), 1));
                    wb = exportVisitDepthOne(dataMap_10, exportParam.getStartDate(), exportParam.getEndDate());
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_DEEP_VISIT_TREND:
                    // 到访深度 明细
                    fileName = pixName + "进店率明细";
                    Map <String, Object> dataMap_11 = new LinkedHashMap <>();
                    dataMap_11.put("人均停留时长", visitDepthService.avarageStayDuration(projectId, exportParam.getStartDate(), exportParam.getEndDate()));
                    dataMap_11.put("人均停留时长明细", visitDepthService.avarageStayDurationDetail(projectId, exportParam.getStartDate(), exportParam.getEndDate()));
                    dataMap_11.put("人均进店数量", visitDepthService.avarageEnterRoomCount(projectId, exportParam.getStartDate(), exportParam.getEndDate()));
                    wb = exportVisitDepthTwo(dataMap_11);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_PROJECT_DETAIL_SENSORS:
                    //项目详情-探针报表
                    fileName = pixName + "探针管理报表";
                    ProjectDetailVM projectDetailVM = projectService.projectDetail(projectId + "");
                    wb = exportProjectDetail(projectDetailVM, projectId, projectName);
                    break;
                case ReportConstants.ExportType.EXPORT_TYPE_PROJECT_PRINCIPAL:
                    //店铺负责人信息报表
                    fileName = pixName + "负责人信息报表";
                    wb = exportProjectPrincipal(wb);
                    break;
                default:
                    break;
            }

            String sharePath = paramService.queryByParamKey(ParamConstants.SHARE_ATTACHMENT_PATH).getParamValue();
            // test data
            // sharePath = "/tmp/attachment";
            String exportFolder = sharePath + "/export";
            File file = new File(exportFolder);
            file.mkdirs();//创建导出目录
            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
            ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));
            HttpSession session = request.getSession();
            session.setAttribute(uuid, exportFolder + "/" + uuid);
            session.setAttribute(uuid + "_fileName", fileName);
            ExportVM vm = new ExportVM();
            vm.setAttachId(uuid);
            return new ResponseEntity <ExportVM>(vm, HttpStatus.OK);
        }
    }

    private HSSFWorkbook exportSensorList(HSSFWorkbook wb, ExportParam exportParam) throws Exception {
        wb = new HSSFWorkbook();
        String q = exportParam.getQ();
        int projectId = exportParam.getProjectId();
        SensorPage page = new SensorPage();
        page.setProjectId(projectId);
        page.setQ(q);
        List <Sensor> sensorList = projectService.getSensorProjectList(page);

        String sheetName = "Sheet1";
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        int rownum = 0;
        HSSFRow row_1_1 = sheet1.createRow(rownum++);
        int column = 0;
        row_1_1.createCell(column++).setCellValue("探针ID");
        row_1_1.createCell(column++).setCellValue("探针别名");
        row_1_1.createCell(column++).setCellValue("MAC地址");
        row_1_1.createCell(column++).setCellValue("类型");
        row_1_1.createCell(column++).setCellValue("强度");
        row_1_1.createCell(column++).setCellValue("开通时间");
        row_1_1.createCell(column++).setCellValue("状态");
        row_1_1.createCell(column++).setCellValue("3小时日志数");
        row_1_1.createCell(column++).setCellValue("近7日无日志时长");
        if (null != sensorList) {
            for (int i = 0; i < sensorList.size(); i++) {

                HSSFRow row_1_n = sheet1.createRow(rownum++);
                column = 0;
                row_1_n.createCell(column++).setCellValue(sensorList.get(i).getSensorCode());
                row_1_n.createCell(column++).setCellValue(sensorList.get(i).getSensorName());
                row_1_n.createCell(column++).setCellValue(sensorList.get(i).getSensorMac());
                row_1_n.createCell(column++).setCellValue(sensorList.get(i).getSensorType());
                row_1_n.createCell(column++).setCellValue(sensorList.get(i).getMinRssi());
                row_1_n.createCell(column++).setCellValue(DateUtil.format(sensorList.get(i).getCreateTime(),DateUtil.PATTERN_DATE));
                String normal = getNormal(sensorList.get(i).getNormal());
                row_1_n.createCell(column++).setCellValue(normal);
                row_1_n.createCell(column++).setCellValue(sensorList.get(i).getLogHours());
                row_1_n.createCell(column++).setCellValue(sensorList.get(i).getNoLogDuration());

            }

        }
        return wb;

    }

     // 0异常，1正常 ，2停用
    private String getNormal(Integer normal) {
        int i = normal;
        String str = "";
        switch (i){
            case 0:
                str = "异常";
            break;
            case 1:
                str = "正常";
            break;
            case 2:
                str = "停用";
            break;
            default:
                str = "异常";
        }

        return str;

    }

    private HSSFWorkbook exportSensorDetail(HSSFWorkbook wb, ExportParam exportParam) throws Exception {
        wb = new HSSFWorkbook();
        Integer sensorId = exportParam.getSensorId();
        SensorPage page = new SensorPage();
        page.setId(sensorId);
        SensorDetailVM sensorDetail = sensorService.getSensorDetail(page);

        String sheetName = "Sheet1";
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        int rownum = 0;
        HSSFRow row_1_1 = sheet1.createRow(rownum++);
        int column = 0;
        row_1_1.createCell(column++).setCellValue("时间");
        row_1_1.createCell(column++).setCellValue("有效mac数");
        row_1_1.createCell(column++).setCellValue("有效日志数");
        if (null != sensorDetail) {
            List <SensorAccountVM> macList = sensorDetail.getMacs();
            List <SensorAccountVM> logsList = sensorDetail.getLogs();
            for (int i = 0; i < macList.size(); i++) {

                HSSFRow row_1_n = sheet1.createRow(rownum++);
                column = 0;
                row_1_n.createCell(column++).setCellValue(macList.get(i).getDate());
                row_1_n.createCell(column++).setCellValue(macList.get(i).getTotal());
                row_1_n.createCell(column++).setCellValue(logsList.get(i).getTotal());
            }

        }
        return wb;
    }

    private HSSFWorkbook exportProjectGeneral(HSSFWorkbook wb, ProjectDetailVM projectDetailVM) throws Exception {
        wb = new HSSFWorkbook();

        String sheetName = "设备概况";
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        int rownum = 0;
        HSSFRow row_1_1 = sheet1.createRow(rownum++);
        int column = 0;
        row_1_1.createCell(column++).setCellValue("项目名称");
        row_1_1.createCell(column++).setCellValue("探针数");
        row_1_1.createCell(column++).setCellValue("健康度");
        row_1_1.createCell(column++).setCellValue("7日平均无日志时长");
        row_1_1.createCell(column++).setCellValue("30日平均无日志时长");
        if (null != projectDetailVM) {

            HSSFRow row_1_n = sheet1.createRow(rownum++);
            column = 0;
            row_1_n.createCell(column++).setCellValue(projectDetailVM.getProjectName());
            row_1_n.createCell(column++).setCellValue(projectDetailVM.getSensorNum());
            row_1_n.createCell(column++).setCellValue(projectDetailVM.getHealthRate());
            row_1_n.createCell(column++).setCellValue(projectDetailVM.getNoLogDuration());
            row_1_n.createCell(column++).setCellValue(projectDetailVM.getThirtyNoLogDuration());

        }
        return wb;
    }

    private HSSFWorkbook exportProjectPrincipal(HSSFWorkbook wb) throws Exception {
        wb = new HSSFWorkbook();

        Map <String, Project> projectMap = projectService.findAllPermissionProject();

        String sheetName = "Sheet1";
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        int rownum = 0;
        HSSFRow row_1_1 = sheet1.createRow(rownum++);
        int column = 0;
        row_1_1.createCell(column++).setCellValue("项目ID(不能修改)");
        row_1_1.createCell(column++).setCellValue("项目名称(不能修改)");
        row_1_1.createCell(column++).setCellValue("城市(不能修改)");
        row_1_1.createCell(column++).setCellValue("负责人");
        row_1_1.createCell(column++).setCellValue("职位");
        row_1_1.createCell(column++).setCellValue("部门");
        row_1_1.createCell(column++).setCellValue("邮箱");
        row_1_1.createCell(column++).setCellValue("电话1");
        row_1_1.createCell(column++).setCellValue("电话2");
        if (null != projectMap && !projectMap.isEmpty()) {
            Set <String> stringSet = projectMap.keySet();
            ProjectAttributePage projectAttributePage = new ProjectAttributePage();
            for (String key : stringSet) {
                Project project = projectMap.get(key);
                if (ProjectTypeEnum.PROJECT_SHOP.getCode() != project.getProjectType()) {
                    continue;
                }
                HSSFRow row_1_n = sheet1.createRow(rownum++);
                column = 0;
                row_1_n.createCell(column++).setCellValue(project.getId());
                row_1_n.createCell(column++).setCellValue(project.getProjectName());
                row_1_n.createCell(column++).setCellValue(project.getCity());
                projectAttributePage.setProjectId(project.getId());
                projectAttributePage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
                ProjectAttribute projectAttributeDao = projectAttributeService.queryBySingle(projectAttributePage);
                if (projectAttributeDao != null) {
                    row_1_n.createCell(column++).setCellValue(projectAttributeDao.getPrincipal());
                    row_1_n.createCell(column++).setCellValue(projectAttributeDao.getPosition());
                    row_1_n.createCell(column++).setCellValue(projectAttributeDao.getDepartment());
                    row_1_n.createCell(column++).setCellValue(projectAttributeDao.getEmail());
                    row_1_n.createCell(column++).setCellValue(projectAttributeDao.getPhone1());
                    row_1_n.createCell(column++).setCellValue(projectAttributeDao.getPhone2());
                }

            }

        }
        return wb;
    }

    /**
     * 从session中拿到excel并导出到页面后，从session中清除excel对象
     *
     * @param uuid
     * @param request
     * @param response
     * @throws IOException
     */
    @ApiOperation(value = "从session中拿到excel并导出到页面后，从session中清除excel对象",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "从session中拿到excel并导出到页面后，从session中清除excel对象")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/exports/getExportExcel/{uuid}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <Void> getExportExcel(@PathVariable("uuid") String uuid, HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        String filePath = (String) session.getAttribute(uuid);
        String fileName = session.getAttribute(uuid + "_fileName") + ".xls";
        try {
            String agent = request.getHeader("USER-AGENT");
            String downLoadName = null;
            if (null != agent && (-1 != agent.indexOf("MSIE") || agent.contains("Trident"))) // IE
            {
                downLoadName = java.net.URLEncoder.encode(fileName, "UTF-8");
            } else if (null != agent && -1 != agent.indexOf("Mozilla")) // Firefox
            {
                downLoadName = new String(fileName.getBytes("UTF-8"), "iso-8859-1");
            }
            // 设置response的Header
            response.setContentType("application/octet-stream");
            response.addHeader("Content-Disposition", "attachment;filename=" + downLoadName);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity <>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
        FileInputStream inputStream = null;
        OutputStream os = null;
        try {
            if (filePath != null) {
                inputStream = new FileInputStream(filePath);
                os = response.getOutputStream();
                byte[] buffer = new byte[1024];
                int size = 0;
                while ((size = inputStream.read(buffer, 0, 1024)) > 0) {
                    os.write(buffer, 0, size);
                }
                os.flush();

                session.removeAttribute(uuid); // 用完后从session中移除
                session.removeAttribute(uuid + "_fileName");
                new File(filePath).delete();//删除临时文件
                return ResponseEntity.ok().headers(HeaderUtil.createAlert("A excel is deleted with identifier "
                        + uuid, uuid)).build();
            } else {
                log.error("没有从session中拿到excel");
                return new ResponseEntity <>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity <>(HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            if (null != inputStream)
                inputStream.close();
            if (null != os) {
                os.close();
            }
        }
    }

    /**
     * room 对象集合转换成 map集合
     *
     * @return
     */
    private List <Map <String, Object>> getRoomDistDetailMapData(List <ProjectAverageDetailVM> roomDistList) {
        List <Map <String, Object>> mapList = new ArrayList <>();
        Map <String, Object> map = null;
        for (ProjectAverageDetailVM summaryVM : roomDistList) {
            map = new HashMap <>();
            map.put("name", summaryVM.getProjectName());
            map.put("activeUsers", summaryVM.getActiveUsers()); // 店均到店客流
            map.put("newUsers", summaryVM.getNewUsers()); // 店均新客
            map.put("oldUsers", summaryVM.getOldUsers()); // 店均老客
            map.put("stayUsers", summaryVM.getStayUsers()); // 店均停留客流
            map.put("stayRate", summaryVM.getStayRate()); // 停留率
            map.put("averageStayDuration", summaryVM.getAverageStayDuration()); // 客均停留时长
            mapList.add(map);
        }

        return mapList;
    }

    private String getTagName(Tag tag) {
        String tagName = "";
        if ("未婚".equalsIgnoreCase(tag.getTag_name())) {
            tagName = "未知";
        } else if ("无车".equalsIgnoreCase(tag.getTag_name())) {
            tagName = "未知";
        } else {
            tagName = tag.getTag_name();
        }
        return tagName;
    }

    /**
     * crowdName:{"人口属性 "
     * :{性别比例：[{tag_name:"",sta_value:""},{tag_name:"",sta_value:""}]}}
     * {到访客群={人口属性={sexscale=[Tag1,Tag2]}}}
     *
     * @param dataMap
     * @param startDate
     * @param endDate
     * @return
     */
    private HSSFWorkbook exportPassengerPeopleData(Map <String, Object> dataMap, Date startDate, Date endDate) {
        HSSFWorkbook wb = new HSSFWorkbook();
        String sheetName = "";
        Iterator <String> sheetIter = dataMap.keySet().iterator();
        Map <String, Map <String, Object>> tagsMap = new HashMap <>();
        DecimalFormat decimalFormat = new DecimalFormat(decimalFormatStr);
        // List <Tag> tags = new ArrayList <>();
        while (sheetIter.hasNext()) {
            sheetName = sheetIter.next();
            HSSFSheet sheet = wb.createSheet(sheetName);
            tagsMap = (Map <String, Map <String, Object>>) dataMap.get(sheetName);
            int rowIndex = 1;

            // 人口属性
            HSSFRow titleRow = sheet.createRow(0);
            titleRow.createCell(0).setCellValue("人口属性");
            //性别
            HSSFRow row = sheet.createRow(rowIndex++);
            SexVM sexVM = (SexVM) tagsMap.get("人口属性").get("sexVM");
            int cellIndex = 1;
            row.createCell(cellIndex - 1).setCellValue("性别比例");
            row.createCell(cellIndex).setCellValue("占比");
            if (sexVM != null) {
                HSSFRow rowSex = sheet.createRow(rowIndex++);
                rowSex.createCell(cellIndex - 1).setCellValue("男");
                rowSex.createCell(cellIndex).setCellValue(sexVM.getMaleRate() + rateStr);
                rowSex = sheet.createRow(rowIndex++);
                rowSex.createCell(cellIndex - 1).setCellValue("女");
                rowSex.createCell(cellIndex).setCellValue(sexVM.getFemaleRate() + rateStr);
            }
            rowIndex++;

            //年龄
            AgeDistributionVM ageDistributionVM = (AgeDistributionVM) tagsMap.get("人口属性").get("ageDistributionVM");
            HSSFRow row2 = sheet.createRow(rowIndex++);
            row2.createCell(cellIndex - 1).setCellValue("年龄分布");
            row2.createCell(cellIndex).setCellValue("占比");
            if (ageDistributionVM != null) {
                HSSFRow rowAge = sheet.createRow(rowIndex++);
                rowAge.createCell(cellIndex - 1).setCellValue("19岁以下");
                rowAge.createCell(cellIndex).setCellValue(ageDistributionVM.getAge19Percent() + rateStr);
                rowAge = sheet.createRow(rowIndex++);
                rowAge.createCell(cellIndex - 1).setCellValue("19-25岁");
                rowAge.createCell(cellIndex).setCellValue(ageDistributionVM.getAge25Percent() + rateStr);
                rowAge = sheet.createRow(rowIndex++);
                rowAge.createCell(cellIndex - 1).setCellValue("26-35岁");
                rowAge.createCell(cellIndex).setCellValue(ageDistributionVM.getAge35Percent() + rateStr);
                rowAge = sheet.createRow(rowIndex++);
                rowAge.createCell(cellIndex - 1).setCellValue("36-45岁");
                rowAge.createCell(cellIndex).setCellValue(ageDistributionVM.getAge45Percent() + rateStr);
                rowAge = sheet.createRow(rowIndex++);
                rowAge.createCell(cellIndex - 1).setCellValue("46-55岁");
                rowAge.createCell(cellIndex).setCellValue(ageDistributionVM.getAge55Percent() + rateStr);
                rowAge = sheet.createRow(rowIndex++);
                rowAge.createCell(cellIndex - 1).setCellValue("55岁以上");
                rowAge.createCell(cellIndex).setCellValue(ageDistributionVM.getAgeAbove55Percent() + rateStr);
            }
            rowIndex++;

            //结婚、有车、育儿
            MarryCarChildVM marryCarChild = (MarryCarChildVM) tagsMap.get("人口属性").get("marryCarChildVM");

            if (marryCarChild != null) {
                //结婚
                HSSFRow row4 = sheet.createRow(rowIndex++);
                row4.createCell(cellIndex - 1).setCellValue("是否结婚");
                row4.createCell(cellIndex).setCellValue("占比");
                HSSFRow otherRow = sheet.createRow(rowIndex++);
                otherRow.createCell(cellIndex - 1).setCellValue("已婚");
                otherRow.createCell(cellIndex).setCellValue(marryCarChild.getMarriedPercent() + rateStr);
                Double marryDouble = Double.valueOf(marryCarChild.getMarriedPercent());
                otherRow = sheet.createRow(rowIndex++);
                otherRow.createCell(cellIndex - 1).setCellValue("未知");
                otherRow.createCell(cellIndex).setCellValue(decimalFormat.format(100 - marryDouble) + rateStr);
                rowIndex++;

                //育儿
                HSSFRow row5 = sheet.createRow(rowIndex++);
                row5.createCell(cellIndex - 1).setCellValue("育儿情况");
                row5.createCell(cellIndex).setCellValue("占比");
                otherRow = sheet.createRow(rowIndex++);
                otherRow.createCell(cellIndex - 1).setCellValue("育儿");
                otherRow.createCell(cellIndex).setCellValue(marryCarChild.getHaveChildrenPercent() + rateStr);
                Double childDouble = Double.valueOf(marryCarChild.getHaveChildrenPercent());
                otherRow = sheet.createRow(rowIndex++);
                otherRow.createCell(cellIndex - 1).setCellValue("未知");
                otherRow.createCell(cellIndex).setCellValue(decimalFormat.format(100 - childDouble) + rateStr);
                rowIndex++;

                //有车
                HSSFRow row6 = sheet.createRow(rowIndex++);
                row6.createCell(cellIndex - 1).setCellValue("是否有车");
                row6.createCell(cellIndex).setCellValue("占比");
                otherRow = sheet.createRow(rowIndex++);
                otherRow.createCell(cellIndex - 1).setCellValue("有车");
                otherRow.createCell(cellIndex).setCellValue(marryCarChild.getHaveCarPercent() + rateStr);
                Double carDouble = Double.valueOf(marryCarChild.getHaveCarPercent());
                otherRow = sheet.createRow(rowIndex++);
                otherRow.createCell(cellIndex - 1).setCellValue("未知");
                otherRow.createCell(cellIndex).setCellValue(decimalFormat.format(100 - carDouble) + rateStr);
            }
            rowIndex += 2;

            // 消费能力
            HSSFRow expenseTitleRow = sheet.createRow(rowIndex++);
            expenseTitleRow.createCell(0).setCellValue("消费能力");
            HSSFRow expenseRow = sheet.createRow(rowIndex++);
            List <Tag> tags = (List <Tag>) tagsMap.get("消费能力").get("phonebrand"); // 所用手机品牌
            expenseRow.createCell(cellIndex - 1).setCellValue("所用手机品牌");
            expenseRow.createCell(cellIndex).setCellValue("占比");
            for (Tag tag : tags) {
                HSSFRow brandRow = sheet.createRow(rowIndex++);
                brandRow.createCell(cellIndex - 1).setCellValue(tag.getTag_name());
                brandRow.createCell(cellIndex).setCellValue(tag.getSta_value() + rateStr);
            }
            rowIndex++;

            tags = (List <Tag>) tagsMap.get("消费能力").get("phoneprice"); // 所用手机价格
            HSSFRow expenseRow2 = sheet.createRow(rowIndex++);
            expenseRow2.createCell(cellIndex - 1).setCellValue("所用手机价格");
            expenseRow2.createCell(cellIndex).setCellValue("占比");
            Float sum = 0f;
            for (Tag tag : tags) {
                sum = sum + Float.valueOf(tag.getSta_value());
            }
            for (Tag tag : tags) {
                HSSFRow priceRow = sheet.createRow(rowIndex++);
                priceRow.createCell(cellIndex - 1).setCellValue(tag.getTag_name());
                priceRow.createCell(cellIndex).setCellValue(decimalFormat.format((sum != 0.00 ? Float.valueOf(tag.getSta_value()) * 100 / sum : 0.00)) + rateStr);
            }
            rowIndex += 2;

            // 应用偏好
            HSSFRow appTitleRow = sheet.createRow(rowIndex++);
            appTitleRow.createCell(0).setCellValue("应用偏好");
            HSSFRow radarTitleRow = sheet.createRow(rowIndex++);
            radarTitleRow.createCell(0).setCellValue("应用偏好");
            radarTitleRow.createCell(1).setCellValue("覆盖率");
            List <TenantTagsCount> tenantTagsCounts = new ArrayList <>();
            tenantTagsCounts = (List <TenantTagsCount>) tagsMap.get("应用偏好").get("radar");
            Float count = 0f;
            for (TenantTagsCount tag : tenantTagsCounts) {
                if (tag.getTagCode().equals("000000")) {
                    count = tag.getMetricValue().floatValue();
                }
            }
            for (TenantTagsCount tag : tenantTagsCounts) {
                HSSFRow radarRow = sheet.createRow(rowIndex++);
                radarRow.createCell(cellIndex - 1).setCellValue(tag.getTagName());
                radarRow.createCell(cellIndex).setCellValue(decimalFormat.format((count != 0 ? Float.valueOf(tag.getMetricValue()) * 100 / count : 0)) + rateStr);
            }
            rowIndex++;

            // 应用偏好提升度
            HSSFRow TitleRow1 = sheet.createRow(rowIndex++);
            TitleRow1.createCell(0).setCellValue("应用偏好");
            TitleRow1.createCell(1).setCellValue("提升度");
            List <TenantTagsCount> appPreferenceTags = new ArrayList <>();
            appPreferenceTags = (List <TenantTagsCount>) tagsMap.get("应用偏好").get("appPreference");
            for (TenantTagsCount tag : appPreferenceTags) {
                HSSFRow radarRow = sheet.createRow(rowIndex++);
                radarRow.createCell(cellIndex - 1).setCellValue(tag.getTagName());
                radarRow.createCell(cellIndex).setCellValue(tag.getCityPreValue() + rateStr);
            }
        }
        return wb;

    }


    /**
     * 客流明细 导出
     *
     * @param dataMap
     * @param startDate
     * @param endDate
     * @return
     */
    private HSSFWorkbook exportDetailDataByType(Map <String, Object> dataMap, Date startDate, Date endDate) {
        HSSFWorkbook wb = new HSSFWorkbook();
        String sheetName = "";
        Iterator <String> sheetIter = dataMap.keySet().iterator();
        while (sheetIter.hasNext()) {
            sheetName = sheetIter.next();
            HSSFSheet sheet = wb.createSheet(sheetName);
            int columnIndex = 0;
            int rowIndex = 0;

            HSSFRow titleRow = sheet.createRow(rowIndex++);
            SimpleDateFormat sdf = new SimpleDateFormat(dateStr);
            titleRow.createCell(columnIndex).setCellValue("时间： " + sdf.format(startDate) + " ~ " + sdf.format(endDate));
            titleRow = sheet.createRow(rowIndex++);
            if (isEnterRate(sheetName)) {
                // 进店率
                titleRow.createCell(columnIndex++).setCellValue("时期");
                titleRow.createCell(columnIndex++).setCellValue("客流人数");
                titleRow.createCell(columnIndex++).setCellValue("客流占比");
                titleRow.createCell(columnIndex++).setCellValue("进店人数");
                titleRow.createCell(columnIndex++).setCellValue("进店占比");
                titleRow.createCell(columnIndex++).setCellValue("进店率");
            } else if (isRoomActiveDetail(sheetName)) {
                // 房店分布-客流明细
                titleRow.createCell(columnIndex++).setCellValue("店铺名称");
                titleRow.createCell(columnIndex++).setCellValue("店均到店客流");
                titleRow.createCell(columnIndex++).setCellValue("店均新客");
                titleRow.createCell(columnIndex++).setCellValue("店均老客");
                titleRow.createCell(columnIndex++).setCellValue("店均停留客流");
                titleRow.createCell(columnIndex++).setCellValue("停留率");
                titleRow.createCell(columnIndex++).setCellValue("客均停留时长");
            } else if (isStayRate(sheetName)) {
                //停留率
                titleRow.createCell(columnIndex++).setCellValue("时期");
                titleRow.createCell(columnIndex++).setCellValue("有效客流");
                titleRow.createCell(columnIndex++).setCellValue("有效客流占比");
                titleRow.createCell(columnIndex++).setCellValue("停留客流");
                titleRow.createCell(columnIndex++).setCellValue("停留客流占比");
                titleRow.createCell(columnIndex++).setCellValue("停留率");
            } else {
                titleRow.createCell(columnIndex++).setCellValue("时期");
                titleRow.createCell(columnIndex++).setCellValue(sheetName);
                titleRow.createCell(columnIndex++).setCellValue(sheetName + "占比");
                // if (!isNoNewOldPerson(sheetName)) {
                titleRow.createCell(columnIndex++).setCellValue("新客");
                titleRow.createCell(columnIndex++).setCellValue("老客");
                // }
            }

            HSSFRow row;

            if (!isRoomActiveDetail(sheetName)) {
                PassengerCompareVM valueMapList = (PassengerCompareVM) dataMap.get(sheetName);

                for (PassengerVM passengerVM : valueMapList.getList()) {
                    row = sheet.createRow(rowIndex++);
                    int column = 0;
                    if (isEnterRate(sheetName)) {
                        // 进店率
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getDate()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getActiveUsers()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getActivePercent()) + rateStr);
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getEnterUsers()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getEnterPercent()) + rateStr);
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getEnterPercent()) + rateStr);
                    } else if (isStayRate(sheetName)) {
                        //停留率
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getDate()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getEnterUsers()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getEnterPercent()) + rateStr);
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getStayUsers()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getStayPercent()) + rateStr);
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getStayRate()) + rateStr);
                    } else {
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getDate()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getSumUsers()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getDayPercent()) + rateStr);
                        // if (!isNoNewOldPerson(sheetName)) {
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getNewUsers()));
                        row.createCell(column++).setCellValue(String.valueOf(passengerVM.getOldUsers()));
                        // }
                    }
                }
            } else {
                // 房店分布-客流明细
                List <ProjectAverageDetailVM> valueMapList = (List <ProjectAverageDetailVM>) dataMap.get(sheetName);
                for (ProjectAverageDetailVM projectAverageDetailVM : valueMapList) {
                    row = sheet.createRow(rowIndex++);
                    int column = 0;
                    row.createCell(column++).setCellValue(String.valueOf(projectAverageDetailVM.getProjectName()));
                    row.createCell(column++).setCellValue(String.valueOf(projectAverageDetailVM.getActiveUsers()));
                    row.createCell(column++).setCellValue(String.valueOf(projectAverageDetailVM.getNewUsers()));
                    row.createCell(column++).setCellValue(String.valueOf(projectAverageDetailVM.getOldUsers()));
                    row.createCell(column++).setCellValue(String.valueOf(projectAverageDetailVM.getStayUsers()));
                    row.createCell(6).setCellValue(String.valueOf(projectAverageDetailVM.getAverageStayDuration()) + minuteStr);
                    row.createCell(column++).setCellValue(String.valueOf(projectAverageDetailVM.getStayRate()) + rateStr);
                }
            }
        }

        return wb;
    }

    /**
     * 客流到访时段数据 导出
     *
     * @param dataMap
     * @param startDate
     * @param endDate
     * @return
     */
    private HSSFWorkbook exportPassengerTrendActiveTimeData(Map <String, Object> dataMap, Date startDate, Date endDate) {
        HSSFWorkbook wb = new HSSFWorkbook();
        Iterator <String> key = dataMap.keySet().iterator(); // sheet集合
        String sheetName = "";
        String date = DateUtil.format(startDate, "yyyy-MM-dd") + "~" + DateUtil.format(endDate, "yyyy-MM-dd");
        while (key.hasNext()) {
            sheetName = key.next();
            HSSFSheet sheet = wb.createSheet(sheetName);
            HSSFRow top = sheet.createRow(0);
            top.createCell(0).setCellValue("日期");
            top.createCell(1).setCellValue(date); // 设置日期间隔

            HSSFRow title = sheet.createRow(2);
            title.createCell(0).setCellValue("时段");
            title.createCell(1).setCellValue("到访时段占比");
            Map <String, Object> data = (Map <String, Object>) dataMap.get(sheetName);
            List <Map <String, Object>> key5 = (List <Map <String, Object>>) data.get("key5"); // key5

            long totalHourUsers = Long.parseLong(data.get("totalHourUsers") == null ? "0" : data.get("totalHourUsers") + "");
            // 到访时段
            int index = 3;
            // for (Map <String, Object> valueMap : key5) {
            //     total += (Integer) valueMap.get("value");
            // }
            for (Map <String, Object> valueMap : key5) {
                HSSFRow row = sheet.createRow(index);
                row.createCell(0).setCellValue(String.valueOf(valueMap.get("key")));
                double value = Double.parseDouble(valueMap.get("value") + "");
                BigDecimal rate = new BigDecimal(totalHourUsers == 0 ? 0 : (value * 100 / totalHourUsers));
                row.createCell(1).setCellValue(String.valueOf(rate.setScale(1, BigDecimal.ROUND_HALF_UP).doubleValue() + "%"));

                index++;
            }
        }

        return wb;
    }


    /**
     * 客流分布页面，导出客流统计数据
     *
     * @param dataMap
     * @param startDate
     * @param endDate
     * @return
     */
    private HSSFWorkbook exportPassengerDistributionData(Map <String, Object> dataMap, Date startDate, Date endDate) {
        HSSFWorkbook wb = new HSSFWorkbook();
        Iterator <String> key = dataMap.keySet().iterator(); // sheet集合
        String sheetName = "";
        String date = DateUtil.format(startDate, "yyyy-MM-dd") + "~" + DateUtil.format(endDate, "yyyy-MM-dd");
        while (key.hasNext()) {
            sheetName = key.next();
            HSSFSheet sheet = wb.createSheet(sheetName);
            HSSFRow top = sheet.createRow(0);
            top.createCell(0).setCellValue("日期");
            top.createCell(1).setCellValue(date); // 设置日期间隔

            Map <String, Map <String, Object>> valueMap = (Map <String, Map <String, Object>>) dataMap.get(sheetName);
            int index = 1;
            Map <String, Object> value = valueMap.get("key1");
            HSSFRow row = sheet.createRow(index + 1);
            row.createCell(0).setCellValue("所选时期总客流");
            row.createCell(1).setCellValue("总计");
            row.createCell(2).setCellValue("环比(%)");
            HSSFRow row1 = sheet.createRow(index + 2);
            row1.createCell(1).setCellValue(String.valueOf(value.get("key")));
            row1.createCell(2).setCellValue(String.valueOf(value.get("val")) + rateStr);
            index = index + 3;

            value = valueMap.get("key2");
            HSSFRow row2 = sheet.createRow(index + 1);
            row2.createCell(0).setCellValue(dataTitleMap.get("AverageDailyPassengerFlow")/* "日均客流" */);
            row2.createCell(1).setCellValue("平均");
            row2.createCell(2).setCellValue("环比(%)");
            HSSFRow row21 = sheet.createRow(index + 2);
            row21.createCell(1).setCellValue(String.valueOf(value.get("key")));
            row21.createCell(2).setCellValue(String.valueOf(value.get("val")) + rateStr);
            index = index + 3;

            value = valueMap.get("key3");
            HSSFRow row3 = sheet.createRow(index + 1);
            row3.createCell(0).setCellValue("日均新客");
            row3.createCell(1).setCellValue("平均");
            row3.createCell(2).setCellValue("环比(%)");
            HSSFRow row31 = sheet.createRow(index + 2);
            row31.createCell(1).setCellValue(String.valueOf(value.get("key")));
            row31.createCell(2).setCellValue(String.valueOf(value.get("val")) + rateStr);
            index = index + 3;

            value = valueMap.get("key4");
            HSSFRow row4 = sheet.createRow(index + 1);
            row4.createCell(0).setCellValue("日均老客");
            row4.createCell(1).setCellValue("平均");
            row4.createCell(2).setCellValue("环比(%)");
            HSSFRow row41 = sheet.createRow(index + 2);
            row41.createCell(1).setCellValue(String.valueOf(value.get("key")));
            row41.createCell(2).setCellValue(String.valueOf(value.get("val")) + rateStr);
            index = index + 3;
        }

        return wb;
    }

    /**
     * top10 高效率店铺 数据格式： {value: 1.86, key: "售楼处"}
     *
     * @param dataMap
     * @param startDate
     * @param endDate
     * @return
     */
    private HSSFWorkbook exportRoomEffectTopData(Map <String, Object> dataMap, Date startDate, Date endDate) {
        HSSFWorkbook wb = new HSSFWorkbook();
        Iterator <String> key = dataMap.keySet().iterator(); // sheet集合
        String sheetName = "";
        String date = DateUtil.format(startDate, "yyyy-MM-dd") + "~" + DateUtil.format(endDate, "yyyy-MM-dd");
        List <Map <String, Object>> list = new ArrayList <>();
        while (key.hasNext()) {
            sheetName = key.next();
            HSSFSheet sheet = wb.createSheet(sheetName);
            HSSFRow top = sheet.createRow(0);
            top.createCell(0).setCellValue("日期");
            top.createCell(1).setCellValue(date); // 设置日期间隔
            HSSFRow title = sheet.createRow(1);
            title.createCell(0).setCellValue("房间");
            title.createCell(1).setCellValue(sheetName);
            list = (List <Map <String, Object>>) dataMap.get(sheetName);
            int rows = 0;
            String roomName = "";
            for (Map <String, Object> map : list) {
                roomName = String.valueOf(map.get("key"));
                sheet.createRow(rows + 2).createCell(0).setCellValue(roomName);
                sheet.getRow(rows + 2).createCell(1).setCellValue(String.valueOf(map.get("value")));
                rows++;
            }
        }

        return wb;
    }


    /**
     * 返回客流趋势等数据（合计、日均、环比等）
     *
     * @param dataMap
     * @return
     * @throws ParseException
     * @throws IOException
     */
    private HSSFWorkbook exportPassengerTrendData(Map <String, Object> dataMap, boolean haveStayRate) throws ParseException, IOException {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFCellStyle style = wb.createCellStyle();
        Map <String, Object> sheetNameMap = new LinkedHashMap <>();
        sheetNameMap.put("有效客流", dataMap.get("有效客流"));
        sheetNameMap.put("停留人数", dataMap.get("停留人数"));
        if (haveStayRate) {
            sheetNameMap.put("停留率", dataMap.get("停留率"));
        }

        Iterator <String> key = sheetNameMap.keySet().iterator();
        while (key.hasNext()) {
            String sheetName = key.next();
            TrendCountTotalVM trendCountTotalVM = null;
            EnterRateList enterRateList = null;
            HSSFSheet sheet = wb.createSheet(sheetName);
            int rowNum = 0;
            if (!isStayRate(sheetName)) {
                Object obj = dataMap.get(sheetName + "汇总");
                if (obj instanceof TrendCountTotalVM) {
                    trendCountTotalVM = (TrendCountTotalVM) obj;
                } else if (obj instanceof EnterRateList) {
                    enterRateList = (EnterRateList) obj;
                }
                // if (!isEnterRate(sheetName)) {
                HSSFRow sumRow = sheet.createRow(rowNum++);
                sumRow.createCell(0).setCellValue("合计");
                if (null != trendCountTotalVM)
                    sumRow.createCell(1).setCellValue(trendCountTotalVM.getTotal());

                HSSFRow dailyRow = sheet.createRow(rowNum++);
                dailyRow.createCell(0).setCellValue("日均");
                if (null != trendCountTotalVM)
                    dailyRow.createCell(1).setCellValue(trendCountTotalVM.getDaily());
                dailyRow.createCell(3).setCellValue("环比(%)");
                dailyRow.createCell(4).setCellValue(trendCountTotalVM.getRate() + rateStr);
                // }
            }
            rowNum++;

            HSSFRow row = sheet.createRow(rowNum++);
            style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式
            if (isEnterRate(sheetName)) {
                String[] headerArray = {"日期", sheetName, "环比日期", "环比" + sheetName};
                for (int i = 0; i < headerArray.length; i++) {
                    row.createCell(i).setCellValue(headerArray[i]);
                }
            } else {
                if (isNoNewOldPerson(sheetName) && !isStayRate(sheetName)) {
                    //没有新老客指标数据
                    String[] headerArray = {"日期", sheetName, "新客", "老客", "环比日期", "环比" + sheetName, "环比新客", "环比老客"};
                    for (int i = 0; i < headerArray.length; i++) {
                        row.createCell(i).setCellValue(headerArray[i]);
                    }
                } else if (isStayRate(sheetName)) {
                    String[] headerArray = {"日期", sheetName, "环比日期", "环比" + sheetName};
                    for (int i = 0; i < headerArray.length; i++) {
                        row.createCell(i).setCellValue(headerArray[i]);
                    }
                } else {
                    String totalName = sheetName;
                    String compareName = "环比" + sheetName;
                    if (sheetName.contains("进店")) {
                        totalName = "进店人数";
                        compareName = "环比进店客流量";
                    }
                    String[] headerArray = {"日期", totalName, "新客", "老客", "环比日期", compareName, "环比新客", "环比老客"};
                    for (int i = 0; i < headerArray.length; i++) {
                        row.createCell(i).setCellValue(headerArray[i]);
                    }
                }
            }

            if (!isEnterRate(sheetName)) {
                PassengerCompareVM listVM = (PassengerCompareVM) dataMap.get(sheetName);

                List <PassengerVM> dataDetailList = listVM.getList();
                List <PassengerVM> oldDataDetailList = listVM.getBeforeList();
                int index = rowNum;
                PassengerVM data = null;
                PassengerVM oldData = null;
                for (int j = 0; j < dataDetailList.size(); j++) {
                    data = dataDetailList.get(j);
                    oldData = oldDataDetailList.get(j);
                    HSSFRow tempRow = sheet.createRow(index++);
                    if (isEnterRate(sheetName)) {
                        //TODO: 进店率
                        tempRow.createCell(0).setCellValue(data.getDate());
                        tempRow.createCell(1).setCellValue(data.getSumUsers());  //老客
                        tempRow.createCell(2).setCellValue(oldData.getDate()); //环比老客
                        tempRow.createCell(3).setCellValue(oldData.getSumUsers()); //环比老客
                    } else if (isStayRate(sheetName)) {
                        tempRow.createCell(0).setCellValue(data.getDate());
                        tempRow.createCell(1).setCellValue(data.getStayRate() + rateStr);
                        tempRow.createCell(2).setCellValue(oldData.getDate());
                        tempRow.createCell(3).setCellValue(oldData.getStayRate() + rateStr);
                    } else {
                        tempRow.createCell(0).setCellValue(data.getDate());
                        Long total = data.getSumUsers() == null ? 0 : Long.parseLong(data.getSumUsers());
                        Long compareTotal = oldData.getSumUsers() == null ? 0 : Long.parseLong(oldData.getSumUsers());
                        tempRow.createCell(1).setCellValue(total + "");
                        // if (!isNoNewOldPerson(sheetName)) {
                        tempRow.createCell(2).setCellValue(data.getNewUsers());  //新客
                        tempRow.createCell(3).setCellValue(data.getOldUsers());  //老客
                        tempRow.createCell(4).setCellValue(oldData.getDate()); //环比老客
                        tempRow.createCell(5).setCellValue(String.valueOf(compareTotal));
                        tempRow.createCell(6).setCellValue(oldData.getNewUsers());
                        tempRow.createCell(7).setCellValue(oldData.getOldUsers());
                        // } else {
                        //     tempRow.createCell(3).setCellValue(oldData.getDate());
                        //     tempRow.createCell(4).setCellValue(oldData.getNewUsers());
                        // }
                    }
                }
            } else {
                List <EnterRateVM> dataDetailList = new ArrayList <>();
                List <EnterRateVM> oldDataDetailList = new ArrayList <>();
                if (null != enterRateList) {
                    dataDetailList = enterRateList.getList();
                    oldDataDetailList = enterRateList.getBeforeList();

                }
                int index = rowNum;
                EnterRateVM data = null;
                EnterRateVM oldData = null;

                for (int j = 0; j < dataDetailList.size(); j++) {
                    data = dataDetailList.get(j);
                    oldData = oldDataDetailList.get(j);
                    HSSFRow tempRow = sheet.createRow(index++);
                    tempRow.createCell(0).setCellValue(data.getDate());
                    tempRow.createCell(1).setCellValue(data.getEnterRate());  //老客
                    tempRow.createCell(2).setCellValue(oldData.getDate()); //环比老客
                    tempRow.createCell(3).setCellValue(oldData.getEnterRate());
                }
            }

        }
        return wb;
    }

    /**
     * 目标管理导出
     *
     * @param dataMap
     * @return
     * @throws ParseException
     * @throws IOException
     */
    private HSSFWorkbook exportTargetData(Map <String, Object> dataMap) throws Exception {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFCellStyle style = wb.createCellStyle();
        DecimalFormat df = new DecimalFormat("######0.00");

        SimpleDateFormat sdf = new SimpleDateFormat(dateStr);
        Map <Integer, String> operationStateMap = new HashMap <>();
        operationStateMap.put(0, "很好");
        operationStateMap.put(1, "一般");
        operationStateMap.put(2, "不好");

        Map <String, String> targetValueTypeNameMap = new HashMap <>();
        targetValueTypeNameMap.put("count", "万人");
        targetValueTypeNameMap.put("min", "分钟");
        targetValueTypeNameMap.put("per", "%");

        Map <Integer, String> targetMap = new HashMap <>();
        Map <Integer, String> targetValueTypeMap = new HashMap <>();

        TargetPage page = new TargetPage();
        page.setStatus(1);
        page.setPageEnabled(false);
        List <Target> rows = targetService.queryByList(page);
        for (Target target : rows) {
            targetMap.put(target.getId(), target.getName());
            targetValueTypeMap.put(target.getId(), targetValueTypeNameMap.get(target.getValueType()));
        }

        {
            String sheetName = "目标列表";
            HSSFSheet sheet = wb.createSheet(sheetName);
            List <TargetManagement> list = (List <TargetManagement>) dataMap.get(sheetName);

            HSSFRow topRow = sheet.createRow(0);
            topRow.createCell(0).setCellValue("目标名称");
            topRow.createCell(1).setCellValue("指标类型");
            topRow.createCell(2).setCellValue("起止时间");
            topRow.createCell(3).setCellValue("目标");

            topRow.createCell(4).setCellValue("达成率");
            topRow.createCell(5).setCellValue("运营状态");
            topRow.createCell(6).setCellValue("发布时间");

            for (int i = 0; i < list.size(); i++) {
                TargetManagement targetManagement = list.get(i);

                HSSFRow row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(targetManagement.getTargetName());
                row.createCell(1).setCellValue(targetMap.get(targetManagement.getTargetId()));//转指标名称
                row.createCell(2).setCellValue(targetManagement.getStartDate() + " ~ " + targetManagement.getEndDate());
                row.createCell(3).setCellValue(targetManagement.getTargetValue() + " " + targetValueTypeMap.get(targetManagement.getTargetId())); //加单位

                Double percent = 0d;
                if (targetManagement.getCurrentValue() != null && targetManagement.getTargetValue() != null && targetManagement.getTargetValue() != 0) {
                    percent = targetManagement.getCurrentValue() / targetManagement.getTargetValue() * 100;
                }

                row.createCell(4).setCellValue(df.format(percent) + " %");
                row.createCell(5).setCellValue(operationStateMap.get(targetManagement.getOperationState()));
                row.createCell(6).setCellValue(sdf.format(targetManagement.getCreateTime()));
            }
        }

        {
            String sheetName = "历史";
            HSSFSheet sheet = wb.createSheet(sheetName);
            List <TargetManagement> list = (List <TargetManagement>) dataMap.get(sheetName);

            HSSFRow topRow = sheet.createRow(0);
            topRow.createCell(0).setCellValue("目标名称");
            topRow.createCell(1).setCellValue("指标类型");
            topRow.createCell(2).setCellValue("起止时间");
            topRow.createCell(3).setCellValue("目标");

            topRow.createCell(4).setCellValue("实际");
            topRow.createCell(5).setCellValue("执行情况");
            topRow.createCell(6).setCellValue("发布时间");

            for (int i = 0; i < list.size(); i++) {
                TargetManagement targetManagement = list.get(i);

                HSSFRow row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(targetManagement.getTargetName());
                row.createCell(1).setCellValue(targetMap.get(targetManagement.getTargetId()));//转指标名称
                row.createCell(2).setCellValue(targetManagement.getStartDate() + " ~ " + targetManagement.getEndDate());
                row.createCell(3).setCellValue(targetManagement.getTargetValue() + " " + targetValueTypeMap.get(targetManagement.getTargetId())); //加单位

                row.createCell(4).setCellValue(targetManagement.getCurrentValue() + " " + targetValueTypeMap.get(targetManagement.getTargetId())); // 加单位

                if (targetManagement.getCurrentValue() != null && targetManagement.getTargetValue() != null && targetManagement.getTargetValue() != 0) {
                    row.createCell(5).setCellValue(targetManagement.getCurrentValue() / targetManagement.getTargetValue() >= 1 ? "执行完成'" : "未完成");
                } else {
                    row.createCell(5).setCellValue("未完成");
                }

                row.createCell(6).setCellValue(sdf.format(targetManagement.getCreateTime()));
            }
        }


        return wb;
    }

    private HSSFWorkbook exportTargetManagement(Map <String, Object> dataMap) throws ParseException, IOException {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFCellStyle style = wb.createCellStyle();
        String sheetName = "目标列表";
        List <TargetManagement> list = (List <TargetManagement>) dataMap.get(sheetName);
        HSSFSheet sheet = wb.createSheet(sheetName);

        HSSFRow row = sheet.createRow(3);
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式

        String[] headerArray = {"目标名称", "指标类型", "起止时间", "目标", "达成率", "运营状态", "执行情况"};
        for (int i = 0; i < headerArray.length; i++) {
            row.createCell(i).setCellValue(headerArray[i]);
        }

        int index = 4;
        for (int j = 0; j < list.size(); j++) {
            TargetManagement data = list.get(j);
            HSSFRow tempRow = sheet.createRow(index);


            tempRow.createCell(0).setCellValue(data.getTargetName());
            tempRow.createCell(1).setCellValue(data.getTargetId());
            tempRow.createCell(2).setCellValue(data.getStartDate() + "~" + data.getEndDate());
            tempRow.createCell(3).setCellValue(data.getTargetValue()); // 目标id需要映射成名字

            tempRow.createCell(4).setCellValue(data.getCurrentValue() / data.getTargetValue());
            tempRow.createCell(5).setCellValue(data.getOperationState());
            tempRow.createCell(6).setCellValue(data.getCreateTime());


            index++;
        }


        return wb;
    }

    // 判断是否需要新老客指标数据
    private boolean isNoNewOldPerson(String sheetName) {
        boolean result = false;
        if (sheetName.indexOf("停留") != -1 /*
                                             * || sheetName.indexOf("进店率")!=-1
											 */) {
            result = true;
        }
        return result;
    }

    private boolean isEnterRate(String sheetName) {
        boolean result = false;
        if (sheetName.indexOf("进店率") != -1) {
            result = true;
        }
        return result;
    }

    private boolean isStayRate(String sheetName) {
        boolean result = false;
        if (sheetName.indexOf("停留率") != -1) {
            result = true;
        }
        return result;
    }

    private boolean isRoomActiveDetail(String sheetName) {
        boolean result = false;
        if (sheetName.indexOf("房店分布客流") != -1) {
            result = true;
        }
        return result;
    }

    /**
     * top10 房店数据 数据格式： Map(roomName:Integer[])
     *
     * @param dataMap
     * @param startDate
     * @param endDate
     * @return
     */
    private HSSFWorkbook exportRoomTopData(Map <String, List> dataMap, Date startDate, Date endDate, String chartCategory) {
        HSSFWorkbook wb = new HSSFWorkbook();
        Iterator <String> key = dataMap.keySet().iterator(); // sheet集合
        String sheetName = "";
        int days = 1 + DateUtil.getDiffDays(startDate, endDate);
        String[] dateArray = new String[days];
        for (int i = 0; i < days; i++) {
            dateArray[i] = DateUtil.format(DateUtil.addDay2Date(i, startDate), "yyyy-MM-dd");
        }
        while (key.hasNext()) {
            sheetName = key.next();
            List <ProjectTopVM> dataList = dataMap.get(sheetName);
            HSSFSheet sheet = wb.createSheet(sheetName);
            int rowsNum = 1; // 默认数据起始行
            int cellNum = 0; // 默认第一个cell 的index
            Integer[] valueArray = new Integer[days];
            HSSFRow type = sheet.createRow(rowsNum++);
            if (chartCategory.equals("total")) {
                type.createCell(0).setCellValue("总值");
            } else if (chartCategory.equals("avarage")) {
                type.createCell(0).setCellValue("均值");
            }
            for (int j = 0; j < dateArray.length; j++) { // 循环输出 日期列
                HSSFRow row = sheet.createRow(rowsNum + j + 1);
                row.createCell(0).setCellValue(dateArray[j]);
            }
            HSSFRow titleRow = sheet.createRow(2);
            int roomIndex = 0;
            for (Object data : dataList) {
                if (!sheetName.equals("停留率")) {
                    ProjectTopVM projectTopVM = (ProjectTopVM) data;
                    List <Integer> valueList = projectTopVM.getValueList();
                    titleRow.createCell(++cellNum).setCellValue(projectTopVM.getProjectName());
                    for (int i = 0; i < valueList.size(); i++) {
                        HSSFRow dataRow = sheet.getRow(rowsNum + i + 1);
                        dataRow.createCell(roomIndex + 1).setCellValue(valueList.get(i));
                    }
                } else {
                    ProjectTopRateVM projectTopRateVM = (ProjectTopRateVM) data;
                    List <String> valueList = projectTopRateVM.getValueList();
                    titleRow.createCell(++cellNum).setCellValue(projectTopRateVM.getProjectName());
                    for (int i = 0; i < valueList.size(); i++) {
                        HSSFRow dataRow = sheet.getRow(rowsNum + i + 1);
                        dataRow.createCell(roomIndex + 1).setCellValue(valueList.get(i) + rateStr);
                    }
                }
                roomIndex++;
            }

        }

        return wb;
    }

    private String getProjectName(int projectId) throws Exception {
        Project p = projectService.selectByPrimaryKey(projectId);
        if (p != null) {
            return p.getProjectName();
        }
        return null;
    }

    // dataMap_10.put("到访深度",visitDepthService.mainDataForExport(projectId,exportParam.getStartDate(),exportParam.getEndDate()));
    // dataMap_10.put("驻留时长",visitDepthService.enterRoomDegreeList(projectId,exportParam.getStartDate(),exportParam.getEndDate(),2));
    // dataMap_10.put("进店数量",visitDepthService.enterRoomDegreeList(projectId,exportParam.getStartDate(),exportParam.getEndDate(),1));
    private HSSFWorkbook exportVisitDepthOne(Map <String, Object> dataMap, String startDate, String endDate) throws ParseException, IOException {
        Map <String, Object> map = new HashMap <String, Object>();
        List <Map <Object, Object>> list = new ArrayList <Map <Object, Object>>();
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFCellStyle style = wb.createCellStyle();
        Iterator <String> key = dataMap.keySet().iterator();
        String sheetName = "";
        sheetName = "到访深度";
        DepthSummaryVM depthSummaryVM = (DepthSummaryVM) dataMap.get(sheetName);
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        HSSFRow dateRow = sheet1.createRow(0);
        dateRow.createCell(0).setCellValue("日期");
        dateRow.createCell(1).setCellValue(startDate + "~" + endDate);
        HSSFRow row_1 = sheet1.createRow(1);
        row_1.createCell(0).setCellValue("月均光顾日数");
        row_1.createCell(1).setCellValue(depthSummaryVM.getMonthAverageDays());
        HSSFRow row_2 = sheet1.createRow(2);
        row_2.createCell(0).setCellValue("月均光顾次数");
        row_2.createCell(1).setCellValue(depthSummaryVM.getMonthAverageTimes());
        HSSFRow row_3 = sheet1.createRow(3);
        row_3.createCell(0).setCellValue("停留率");
        row_3.createCell(1).setCellValue(depthSummaryVM.getStayRate() + "%");
        HSSFRow row_4 = sheet1.createRow(4);
        row_4.createCell(0).setCellValue("次均停留时长");
        row_4.createCell(1).setCellValue(depthSummaryVM.getStayTimesDuration());

        sheetName = "进店数量";
        // HSSFSheet sheet2 = wb.createSheet(sheetName);
        // row_1 = sheet2.createRow(0);
        int rowIndex = 6;
        HSSFRow enterListRow = sheet1.createRow(rowIndex);
        enterListRow.createCell(0).setCellValue("进店数量");
        enterListRow.createCell(1).setCellValue("进店区间");
        enterListRow.createCell(2).setCellValue("进店次数");
        list = (List <Map <Object, Object>>) dataMap.get(sheetName);
        //1,2-3,4-7,7
        for (int i = 0; i < list.size(); i++) {
            Map cnMap = list.get(i);
            HSSFRow row = sheet1.createRow(rowIndex + i + 1);
            row.createCell(1).setCellValue(String.valueOf(cnMap.get("key")));
            row.createCell(2).setCellValue(String.valueOf(cnMap.get("value")));
        }

        sheetName = "驻留时长";
        // HSSFSheet sheet3 = wb.createSheet(sheetName);
        int rowIndexNew = rowIndex + 1 + list.size() + 1;
        HSSFRow stayListRow = sheet1.createRow(rowIndexNew++);
        VisitTimesDurationVM visitTimesDurationVM = (VisitTimesDurationVM) dataMap.get(sheetName);
        int type = visitTimesDurationVM.getType();

        stayListRow.createCell(0).setCellValue(sheetName);
        if (type == VisitDepthService.HOUR) {
            stayListRow.createCell(1).setCellValue("小时区间");
            stayListRow.createCell(2).setCellValue("时长分布");
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue("<0.5");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getHour30());
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue("0.5~1");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getHour60());
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue("1~2");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getHour120());
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue("2~4");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getHour240());
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue(">4");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getHour999());

        } else {
            stayListRow.createCell(1).setCellValue("分钟区间");
            stayListRow.createCell(1).setCellValue("时长分布");
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue("<15");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getMinute15());
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue("15~30");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getMinute30());
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue("30~60");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getMinute60());
            stayListRow = sheet1.createRow(rowIndexNew++);
            stayListRow.createCell(1).setCellValue(">60");
            stayListRow.createCell(2).setCellValue(visitTimesDurationVM.getMinute100());
        }

        return wb;
    }

    private HSSFWorkbook exportVisitDepthTwo(Map <String, Object> dataMap) throws ParseException, IOException {
        // Map <String, Object> map = new HashMap <String, Object>();
        List <Map <String, Object>> key5 = new ArrayList <Map <String, Object>>();
        List <Map <String, Object>> key5Before = new ArrayList <Map <String, Object>>();
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFCellStyle style = wb.createCellStyle();
        Iterator <String> key = dataMap.keySet().iterator();

        String sheetName = "人均停留时长";
        PassengerDurationListVM passengerDurationListVM = (PassengerDurationListVM) dataMap.get(sheetName);
        HSSFSheet sheet2 = wb.createSheet(sheetName);
        HSSFRow row_1 = sheet2.createRow(0);
        row_1.createCell(0).setCellValue("合计");
        row_1.createCell(1).setCellValue(passengerDurationListVM.getTotal());
        HSSFRow row_2 = sheet2.createRow(1);
        row_2.createCell(0).setCellValue("日均");
        row_2.createCell(1).setCellValue(passengerDurationListVM.getDaily());
        HSSFRow row_3 = sheet2.createRow(2);
        row_3.createCell(0).setCellValue("环比");
        Double d = Double.parseDouble(passengerDurationListVM.getRate());
        if (passengerDurationListVM.getTrend().equals(TrendEnum.DOWN) && d != 0) {
            d = -d;
        }
        String chain;
        if (d > 100) {
            chain = "100%+";
        } else {
            chain = d + "%";
        }
        row_3.createCell(1).setCellValue(chain);

        List <PassengerDurationVM> passengerDurationVMS = (List <PassengerDurationVM>) dataMap.get(sheetName + "明细");
        HSSFRow row_5 = sheet2.createRow(4);
        row_5.createCell(0).setCellValue("时期");
        row_5.createCell(1).setCellValue("客均停留时长");
        row_5.createCell(2).setCellValue("环比");
        row_5.createCell(3).setCellValue("新客客均停留时长");
        row_5.createCell(4).setCellValue("老客客均停留时长");
        int index = 0;
        for (PassengerDurationVM passengerDurationVM : passengerDurationVMS) {
            HSSFRow row = sheet2.createRow(index + 5);
            row.createCell(0).setCellValue(passengerDurationVM.getDate());
            row.createCell(1).setCellValue(passengerDurationVM.getAvarageDuration());
            String monthRate;
            if (passengerDurationVM.getTrend().equals(TrendEnum.DOWN) && !passengerDurationVM.getMonthRate().equals("0.00")) {
                monthRate = "-" + passengerDurationVM.getMonthRate() + "%";
            } else {
                monthRate = passengerDurationVM.getMonthRate() + "%";
            }
            row.createCell(2).setCellValue(monthRate);
            row.createCell(3).setCellValue(passengerDurationVM.getAvarageNewDuration());
            row.createCell(4).setCellValue(passengerDurationVM.getAvarageOldDuration());
            index++;
        }

        sheetName = "人均进店数量";
        EnterRoomCountListVM enterRoomCountListVM = (EnterRoomCountListVM) dataMap.get(sheetName);
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        row_1 = sheet1.createRow(0);
        row_1.createCell(0).setCellValue("合计");
        row_1.createCell(1).setCellValue(enterRoomCountListVM.getTotal());
        row_2 = sheet1.createRow(1);
        row_2.createCell(0).setCellValue("日均");
        row_2.createCell(1).setCellValue(enterRoomCountListVM.getDaily());
        row_3 = sheet1.createRow(2);
        row_3.createCell(0).setCellValue("环比");
        d = Double.parseDouble(enterRoomCountListVM.getRate());
        if (enterRoomCountListVM.getTrend().equals(TrendEnum.DOWN) && d != 0) {
            d = -d;
        }
        if (d > 100) {
            chain = "100%+";
        } else {
            chain = d + "%";
        }
        row_3.createCell(1).setCellValue(chain);

        List <EnterRoomCountVM> enterRoomCountVMS = (List <EnterRoomCountVM>) enterRoomCountListVM.getList();
        List <EnterRoomCountVM> beforeEnterRoomCountVMS = (List <EnterRoomCountVM>) enterRoomCountListVM.getBeforeList();
        row_5 = sheet1.createRow(4);
        row_5.createCell(0).setCellValue("时期");
        row_5.createCell(1).setCellValue("客均进店数量");
        row_5.createCell(2).setCellValue("环比");
        row_5.createCell(3).setCellValue("新客客均进店数量");
        row_5.createCell(4).setCellValue("老客客均进店数量");
        for (int i = 0; i < enterRoomCountVMS.size(); i++) {
            HSSFRow row = sheet1.createRow(i + 5);
            EnterRoomCountVM enterRoomCountVM = enterRoomCountVMS.get(i);
            EnterRoomCountVM beforeEnterRoomCountVM = beforeEnterRoomCountVMS.get(i);
            row.createCell(0).setCellValue(enterRoomCountVM.getDate());
            row.createCell(1).setCellValue(enterRoomCountVM.getTotalCount());
            double totalCount = Double.parseDouble(enterRoomCountVM.getTotalCount());
            double beforeTotalCount = Double.parseDouble(beforeEnterRoomCountVM.getTotalCount());
            String circle = "0.00%";
            if (beforeTotalCount != 0) {
                BigDecimal bg = new BigDecimal((totalCount - beforeTotalCount) * 10000 / beforeTotalCount / 100.0);
                DecimalFormat df = new DecimalFormat(decimalFormatStr);
                Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
                circle = df.format(f1) + "%";
            }
            row.createCell(2).setCellValue(circle);
            row.createCell(3).setCellValue(enterRoomCountVM.getNewCount());
            row.createCell(4).setCellValue(enterRoomCountVM.getOldCount());
        }
        return wb;
    }

    private HSSFWorkbook exportProjectDetail(ProjectDetailVM projectDetailVM, Integer projectId, String projectName) throws ParseException, IOException {
        HSSFWorkbook wb = new HSSFWorkbook();

        String sheetName = "设备概况";
        HSSFSheet sheet1 = wb.createSheet(sheetName);
        int rownum = 0;
        HSSFRow row_1_1 = sheet1.createRow(rownum++);
        int column = 0;
//        row_1_1.createCell(column++).setCellValue("店铺名称");
//        row_1_1.createCell(column++).setCellValue("探针数量");
//        row_1_1.createCell(column++).setCellValue("健康度");
//        row_1_1.createCell(column++).setCellValue("平均无日志时长");
        row_1_1.createCell(column++).setCellValue("项目名称");
        row_1_1.createCell(column++).setCellValue("探针数");
        row_1_1.createCell(column++).setCellValue("健康度");
        row_1_1.createCell(column++).setCellValue("7日平均无日志时长");
        row_1_1.createCell(column++).setCellValue("30日平均无日志时长");
        HSSFRow row_1_2 = sheet1.createRow(rownum++);
        column = 0;
        row_1_2.createCell(column++).setCellValue(projectDetailVM.getProjectName());
        row_1_2.createCell(column++).setCellValue(projectDetailVM.getSensorNum());
        row_1_2.createCell(column++).setCellValue(projectDetailVM.getHealthRate()+"%");
        row_1_2.createCell(column++).setCellValue(projectDetailVM.getNoLogDuration()+"小时");
        row_1_2.createCell(column++).setCellValue(projectDetailVM.getThirtyNoLogDuration()+"小时");

//        sheetName = "负责人信息";
//        HSSFSheet sheet2 = wb.createSheet(sheetName);
//        rownum = 0;
//        HSSFRow row_2_1 = sheet2.createRow(rownum++);
//        column = 0;
//        row_2_1.createCell(column++).setCellValue("负责人");
//        row_2_1.createCell(column++).setCellValue("职位");
//        row_2_1.createCell(column++).setCellValue("部门");
//        row_2_1.createCell(column++).setCellValue("邮箱");
//        row_2_1.createCell(column++).setCellValue("电话1");
//        row_2_1.createCell(column++).setCellValue("电话2");
//        HSSFRow row_2_2 = sheet2.createRow(rownum++);
//        column = 0;
//        row_2_2.createCell(column++).setCellValue(projectDetailVM.getPrincipal());
//        row_2_2.createCell(column++).setCellValue(projectDetailVM.getPosition());
//        row_2_2.createCell(column++).setCellValue(projectDetailVM.getDepartment());
//        row_2_2.createCell(column++).setCellValue(projectDetailVM.getEmail());
//        row_2_2.createCell(column++).setCellValue(projectDetailVM.getPhone1());
//        row_2_2.createCell(column++).setCellValue(projectDetailVM.getPhone2());

        List <SensorDetailVM> sensorDetailVMS = projectDetailVM.getSensorDetailVMS();
        int count = 0;
        for (SensorDetailVM sensorDetailVM : sensorDetailVMS) {
            sheetName = ++count + "_" + sensorDetailVM.getSensorName();

            HSSFSheet sheetn = wb.createSheet(sheetName);
            rownum = 0;
//
//            HSSFRow row_n_1 = sheetn.createRow(rownum++);
//            column = 0;
//            row_n_1.createCell(column++).setCellValue("有效mac总数");
//            row_n_1.createCell(column++).setCellValue(sensorDetailVM.getMacTotal());
//
//            HSSFRow row_n_2 = sheetn.createRow(rownum++);
//            column = 0;
//            row_n_2.createCell(column++).setCellValue("有效log总数");
//            row_n_2.createCell(column++).setCellValue(sensorDetailVM.getLogTotal());

            HSSFRow row_n_3 = sheetn.createRow(rownum++);
            column = 0;
            row_n_3.createCell(column++).setCellValue("日期");
            row_n_3.createCell(column++).setCellValue("有效mac数量");
            row_n_3.createCell(column++).setCellValue("接收mac总数");
            row_n_3.createCell(column++).setCellValue("有效日志条数");
            row_n_3.createCell(column++).setCellValue("接收日志总数");

            for (int i = 0; i < sensorDetailVM.getMacs().size(); i++) {
                SensorAccountVM mac = sensorDetailVM.getMacs().get(i);
                SensorAccountVM log = sensorDetailVM.getLogs().get(i);

                HSSFRow row_n_4 = sheetn.createRow(rownum++);
                column = 0;
                row_n_4.createCell(column++).setCellValue(mac.getDate());
                row_n_4.createCell(column++).setCellValue(mac.getEffective());
                row_n_4.createCell(column++).setCellValue(mac.getTotal());
                row_n_4.createCell(column++).setCellValue(log.getEffective());
                row_n_4.createCell(column++).setCellValue(log.getTotal());
            }
        }

        return wb;
    }

    /**
     * 将json格式的字符串解析成Map对象
     * <li>json格式：{"name":"admin","retries":"3fff","testname"
     * :"ddd","testretries":"fffffffff"}
     */
    private static HashMap <String, String> toHashMap(String object) {
        HashMap <String, String> data = new HashMap <String, String>();
        // 将json字符串转换成jsonObject
        JSONObject jsonObject = JSONObject.parseObject(object);
        Iterator it = jsonObject.keySet().iterator();
        // 遍历jsonObject数据，添加到Map对象
        while (it.hasNext()) {
            String key = String.valueOf(it.next());
            String value = "";
            if (jsonObject.get(key) instanceof Boolean) {
                value = jsonObject.getBoolean(key).toString();
            } else {
                value = jsonObject.getString(key);
            }
            data.put(key, value);
        }
        return data;
    }

    private static Map <String, String> filterDataTitle(int projectTypeId) {
        Map <String, String> titleMap = new HashMap <>();
        switch (projectTypeId) {
            case 1: // 店组
            case 2: // 商业运营
                // titleMap =
                // toHashMap("{\"TodayPassengerFlow\":\"今日客流\",\"SevenDaysPassengerFlow\":\"近7日客流\",\"ThirtyDaysPassengerFlow\":\"近30日客流\",\"PassengerCount\":\"累计总客\",\"ThirtyDaysPassengerTrend\":\"近30日客流趋势\",\"ThirtyDaysPassengerTrendActiveCount\":\"客流人数\",\"ThirtyDaysPassengerTrendEnterCount\":\"进店人数\",\"PassangerOverview_TOP10RoomPassengerFlowShow\":true,\"TOP10RoomPassengerFlow\":\"TOP10店铺客流量\",\"TOP10RoomPassengerFlowActiveCount\":\"客流人数\",\"TOP10RoomPassengerFlowEnterCount\":\"进店人数\",\"PassengerOverview_TOP10EffectiveRoomShow\":true,\"TOP10EffectiveRoom\":\"坪效指标\",\"TOP10EffectiveRoomEnterDensity\":\"客流密度\",
                // \"ThirtyDaysPassengerFlowInto\":\"近30日客群足迹\",
                // \"ShopCenter\":\"商圈足迹\",\"ShopBrand\":\"品牌足迹（非餐饮）\",\"RestaurantBrand\":\"品牌足迹（餐饮）\",\"DateScopePassengerFlow\":\"所选时段总客流\",
                // \"AverageDailyPassengerFlow\":\"日均客流\",
                // \"AverageDailyNewPassengerFlow\":\"日均新客\",
                // \"AverageDailyOldPassengerFlow\":\"日均老客\",
                // \"PassengerTrendDateScopePassengerFlow\":\"所选时期总客流\",\"PassengerTrendNewUserRate\":\"新客占比\",\"PassengerTrendTimePeak\":\"峰值时段\",\"PassengerTrendTimePeakuserRate\":\"峰值时段客流比例\",\"ActiveTimeDistribution\":\"客流到访时段\",\"PassengerTrendTitle\":\"客流趋势\",\"PassengerTrendActiveCount\":\"客流人数\",\"PassengerTrendActiveDetail\":\"客流明细\",\"PassengerTrendEnterCount\":\"进店人数\",\"PassengerTrendEnterRate\":\"进店率\",\"RoomTOPFlowEnterShow\":true,\"RoomDistributionDailyEnterShow\":true,\"RoomDistributionEnterRateShow\":true,\"RoomDistributionEnterChainRateShow\":true,\"RoomCompareTitle\":\"房间总览\",\"RoomComparePassengerFlowTitle\":\"房间客流量\",\"RoomComparePassengerVisitDepthTitle\":\"房间到访深度\",\"PassengerPeople_ShopCenter\":\"Shoppingmall足迹\",\"PassengerPeople_ShopBrand\":\"品牌足迹（非餐饮）\",\"PassengerPeople_RestaurantBrand\":\"品牌足迹（餐饮）\",\"PassengerPeople_AppType\":\"电商应用\"}");
                titleMap = toHashMap(
                        "{\"TodayPassengerFlow\":\"今日客流\",\"SevenDaysPassengerFlow\":\"近7日客流\",\"ThirtyDaysPassengerFlow\":\"近30日客流\",\"PassengerCount\":\"累计总客\",\"ThirtyDaysPassengerTrend\":\"近30日客流趋势\",\"ThirtyDaysPassengerTrendActiveCount\":\"客流人数\",\"ThirtyDaysPassengerTrendEnterCount\":\"进店人数\",\"PassangerOverview_TOP10RoomPassengerFlowShow\":true,\"TOP10RoomPassengerFlow\":\"TOP10店铺客流量\",\"TOP10RoomPassengerFlowActiveCount\":\"客流人数\",\"TOP10RoomPassengerFlowEnterCount\":\"进店人数\",\"PassengerOverview_TOP10EffectiveRoomShow\":true,\"TOP10EffectiveRoom\":\"坪效指标\", \"TOP10EffectiveRoomEnterDensity\":\"客流密度\", \"ThirtyDaysPassengerFlowInto\":\"近30日客群足迹\",  \"ShopCenter\":\"商圈足迹\", \"ShopBrand\":\"品牌足迹（非餐饮）\",  \"RestaurantBrand\":\"品牌足迹（餐饮）\", \"DateScopePassengerFlow\":\"所选时段总客流\", \"AverageDailyPassengerFlow\":\"日均客流\", \"AverageDailyNewPassengerFlow\":\"日均新客\", \"AverageDailyOldPassengerFlow\":\"日均老客\", \"PassengerTrendDateScopePassengerFlow\":\"所选时期总客流\",\"PassengerTrendNewUserRate\":\"新客占比\",\"PassengerTrendTimePeak\":\"峰值时段\",\"PassengerTrendTimePeakuserRate\":\"峰值时段客流比例\",\"ActiveTimeDistribution\":\"客流到访时段\",\"PassengerTrendTitle\":\"客流趋势\", \"PassengerTrendActiveCount\":\"客流人数\",\"PassengerTrendActiveDetail\":\"客流明细\",\"PassengerTrendEnterCount\":\"进店人数\",\"PassengerTrendEnterRate\":\"进店率\",\"PassengerTrendStayShow\":true,\"RoomTOPFlowEnterShow\":true,\"RoomTOPFlowStayShow\":true,\"RoomDistributionDailyEnterShow\":true,\"RoomDistributionEnterRateShow\":true,\"RoomDistributionEnterChainRateShow\":true,\"RoomCompareTitle\":\"房间总览\",\"RoomComparePassengerFlowTitle\":\"房间客流量\",\"RoomComparePassengerVisitDepthTitle\":\"房间到访深度\",\"RoomCompareShow\":true,\"PassengerPeople_ShopCenter\":\"Shoppingmall足迹\",\"PassengerPeople_ShopBrand\":\"品牌足迹（非餐饮）\",\"PassengerPeople_RestaurantBrand\":\"品牌足迹（餐饮）\",\"PassengerPeople_AppType\":\"电商应用\"}");
                break;
            default: // 住宅类
                // titleMap =
                // toHashMap("{\"TodayPassengerFlow\":\"今日到访\",\"SevenDaysPassengerFlow\":\"近7日到访\",\"ThirtyDaysPassengerFlow\":\"近30日到访\",\"PassengerCount\":\"累计到访\",\"ThirtyDaysPassengerTrend\":\"近30日到访趋势\",\"ThirtyDaysPassengerTrendActiveCount\":\"到访人数\",\"ThirtyDaysPassengerTrendEnterCount\":false,\"PassangerOverview_TOP10RoomPassengerFlowShow\":false,\"TOP10RoomPassengerFlow\":\"TOP区域客流量\",\"TOP10RoomPassengerFlowActiveCount\":\"客流人数\",\"TOP10RoomPassengerFlowEnterCount\":\"进店人数\",\"PassengerOverview_TOP10EffectiveRoomShow\":false,\"TOP10EffectiveRoom\":\"坪效指标\",
                // \"TOP10EffectiveRoomEnterDensity\":\"客流密度\",
                // \"ThirtyDaysPassengerFlowInto\":\"近30日客群足迹\",\"ShopCenter\":\"商圈足迹\",\"ShopBrand\":\"品牌足迹（非餐饮）\",\"RestaurantBrand\":\"品牌足迹（餐饮）\",\"DateScopePassengerFlow\":\"所选时段总客流\",
                // \"AverageDailyPassengerFlow\":\"日均到访\",
                // \"AverageDailyNewPassengerFlow\":\"日均新客\",
                // \"AverageDailyOldPassengerFlow\":\"日均老客\",
                // \"PassengerTrendDateScopePassengerFlow\":\"所选时期总客流\",\"PassengerTrendNewUserRate\":\"新客占比\",\"PassengerTrendTimePeak\":\"峰值时段\",\"PassengerTrendTimePeakuserRate\":\"峰值时段客流比例\",\"ActiveTimeDistribution\":\"客流到访时段\",\"PassengerTrendTitle\":\"客流趋势\",
                // \"PassengerTrendActiveCount\":\"到访人数\",\"PassengerTrendActiveDetail\":\"到访明细\",\"PassengerTrendEnterCount\":false,\"PassengerTrendEnterRate\":false,\"RoomTOPFlowEnterShow\":false,\"RoomDistributionDailyEnterShow\":false,\"RoomDistributionEnterRateShow\":false,\"RoomDistributionEnterChainRateShow\":false,\"RoomCompareTitle\":\"区域总览\",\"RoomComparePassengerFlowTitle\":\"区域客流量\",\"RoomComparePassengerVisitDepthTitle\":\"区域到访深度\",\"PassengerPeople_ShopCenter\":\"Shoppingmall足迹\",\"PassengerPeople_ShopBrand\":\"品牌足迹（非餐饮）\",\"PassengerPeople_RestaurantBrand\":\"品牌足迹（餐饮）\",\"PassengerPeople_AppType\":\"房产应用\"}");
                titleMap = toHashMap(
                        "{\"TodayPassengerFlow\":\"今日到访\",\"SevenDaysPassengerFlow\":\"近7日到访\",\"ThirtyDaysPassengerFlow\":\"近30日到访\",\"PassengerCount\":\"累计到访\",\"ThirtyDaysPassengerTrend\":\"近30日到访趋势\",\"ThirtyDaysPassengerTrendActiveCount\":\"到访人数\",\"ThirtyDaysPassengerTrendEnterCount\":false,\"PassangerOverview_TOP10RoomPassengerFlowShow\":false, \"TOP10RoomPassengerFlow\":\"TOP区域客流量\",\"TOP10RoomPassengerFlowActiveCount\":\"客流人数\",\"TOP10RoomPassengerFlowEnterCount\":\"进店人数\",\"PassengerOverview_TOP10EffectiveRoomShow\":false,\"TOP10EffectiveRoom\":\"坪效指标\", \"TOP10EffectiveRoomEnterDensity\":\"客流密度\",\"ThirtyDaysPassengerFlowInto\":\"近30日客群足迹\",\"ShopCenter\":\"商圈足迹\",\"ShopBrand\":\"品牌足迹（非餐饮）\",\"RestaurantBrand\":\"品牌足迹（餐饮）\",\"DateScopePassengerFlow\":\"所选时段总客流\",  \"AverageDailyPassengerFlow\":\"日均到访\", \"AverageDailyNewPassengerFlow\":\"日均新客\", \"AverageDailyOldPassengerFlow\":\"日均老客\", \"PassengerTrendDateScopePassengerFlow\":\"所选时期总客流\",\"PassengerTrendNewUserRate\":\"新客占比\",\"PassengerTrendTimePeak\":\"峰值时段\",\"PassengerTrendTimePeakuserRate\":\"峰值时段客流比例\",\"ActiveTimeDistribution\":\"客流到访时段\",\"PassengerTrendTitle\":\"客流趋势\", \"PassengerTrendActiveCount\":\"到访人数\",\"PassengerTrendActiveDetail\":\"到访明细\",\"PassengerTrendEnterCount\":false,\"PassengerTrendEnterRate\":false,\"PassengerTrendStayShow\":false,\"RoomTOPFlowEnterShow\":false,\"RoomTOPFlowStayShow\":false,\"RoomDistributionDailyEnterShow\":false,\"RoomDistributionEnterRateShow\":false,\"RoomDistributionEnterChainRateShow\":false,\"RoomCompareTitle\":\"区域总览\",\"RoomComparePassengerFlowTitle\":\"区域客流量\",\"RoomComparePassengerVisitDepthTitle\":\"区域到访深度\",\"RoomCompareShow\":false,\"PassengerPeople_ShopCenter\":\"Shoppingmall足迹\",\"PassengerPeople_ShopBrand\":\"品牌足迹（非餐饮）\",\"PassengerPeople_RestaurantBrand\":\"品牌足迹（餐饮）\",\"PassengerPeople_AppType\":\"房产应用\"}");
                break;
        }
        return titleMap;
    }

}

package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.dao.CrossAnalysisDao;
import td.enterprise.entity.CrossAnalysis;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectSalesVolumn;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.CrossAnalysisPage;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.ProjectSalesVolumnPage;
import td.enterprise.page.mapper.CrossAnalysisMapper;
import td.enterprise.service.DTO.ProjectSalesVolumnDTO;
import td.enterprise.service.DTO.ProjectSalesVolumnProjectDTO;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.ProjectSalesVolumnChartVM;
import td.olap.query.QueryServiceVisitDepth;
import td.olap.query.WiFiAnalyticsQuerService;

import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;


/**
 * <br>
 * <b>功能：</b>交叉分析表 CrossAnalysisService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("crossAnalysisService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CrossAnalysisService extends BaseService<CrossAnalysis> {
    public final static Logger logger = Logger.getLogger(CrossAnalysisService.class);

    @Autowired
    private CrossAnalysisDao dao;
    @Autowired
    private ProjectSalesVolumnService projectSalesVolumnService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ParamService paramService;
    @Autowired
    private CrossAnalysisMapper crossAnalysisMapper;

    public static String DATE_PATTERN = "^(20\\d{2})[-]((0[1-9])|1[0-2])[-]((0[1-9])|((1|2)[0-9])|(3[0-1]))$";  //yyyy-MM-dd
    public static String DATE_STR = "yyyy-MM-dd";  //yyyy-MM-dd

//	public static String MONTH_PATTERN="^(20\\d{2})[-]((0[1-9])|1[0-2])$";  //yyyy-MM

    public static String MONEY_PATTERN = "^([+-]?)((\\d{1,3}(,\\d{3})*)|(\\d+))((\\.\\d{1})|(\\.\\d{2}))?$";

    public CrossAnalysisDao getDao() {
        return dao;
    }


    /**
     * 开始计算交叉分析
     *
     * @param page
     * @return
     * @throws Exception
     */
    public ProjectSalesVolumnChartVM startCompute(CrossAnalysisPage page, MultipartFile file) throws Exception {
        ProjectSalesVolumnChartVM projectSalesVolumnChartVM = new ProjectSalesVolumnChartVM();
        if (file != null) {
            logger.info("crossAnalysis.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file.getSize());
            InputStream is = file.getInputStream();
            String sheetName = "Sheet1";
            int startRowNum = 1;
            List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);

            if (datas == null || datas.size() == 0) {
                logger.info("导入模板数据为空！");
            } else {
                projectSalesVolumnChartVM = checkAndCompute(datas, new ArrayList<>(), page);
            }
        }
        return projectSalesVolumnChartVM;
    }

    /**
     * 查看交叉分析结果
     *
     * @param crossAnalysisId
     * @param projectIds
     * @return
     * @throws Exception
     */
    public ProjectSalesVolumnChartVM getResult(String crossAnalysisId, String projectIds) throws Exception {

        List<Long> xTotal = new ArrayList<Long>();
        List<Long> yTotalLong = new ArrayList<Long>();
        ProjectSalesVolumnChartVM projectSalesVolumnChartVM = new ProjectSalesVolumnChartVM();
        DecimalFormat decimalFormat = new DecimalFormat("0.0");//格式化设置

        List<ProjectSalesVolumnProjectDTO> resultList = new ArrayList<>();

        if (projectIds != null && !"".equals(projectIds) && !"null".equals(projectIds)) {
            String[] projectIdArray = projectIds.split(",");

            for (int i = 0; i < projectIdArray.length; i++) {
                Integer projectId = Integer.parseInt(projectIdArray[i]);

                ProjectSalesVolumnPage page = new ProjectSalesVolumnPage();
                page.setCrossAnalysisId(Integer.parseInt(crossAnalysisId));
                page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                page.setPageEnabled(false);
                List<ProjectSalesVolumn> projectSalesVolumns = projectSalesVolumnService.queryByList(page);
                List<List<String>> mapList = new ArrayList<List<String>>();
                List<String> nameList = new ArrayList<String>();
                List<String> dateList = new ArrayList<String>();

                for (ProjectSalesVolumn projectSalesVolumn : projectSalesVolumns) {
                    List<String> list = new ArrayList<String>();

                    //获取项目属性
                    ProjectPage projectPage = new ProjectPage();
                    projectPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                    projectPage.setId(Integer.parseInt(projectSalesVolumn.getProjectId()));
                    Project project = projectService.queryBySingle(projectPage);

                    if (project != null) {
                        String yValueStr = decimalFormat.format(projectSalesVolumn.getValue());
                        Long yValueLong = (long) (projectSalesVolumn.getValue().doubleValue());

                        list.add(projectSalesVolumn.getPassengerFlow() + "");//x
                        list.add(yValueStr);//y

                        mapList.add(list);
                        dateList.add(projectSalesVolumn.getDate());
                        nameList.add(project.getProjectName());

                        xTotal.add(projectSalesVolumn.getPassengerFlow());
                        yTotalLong.add(yValueLong);
                    }
                }

                ProjectSalesVolumnProjectDTO projectSalesVolumnProjectDTO = new ProjectSalesVolumnProjectDTO();
                projectSalesVolumnProjectDTO.setProjectId(projectId);
                projectSalesVolumnProjectDTO.setNameIndex(nameList);
                projectSalesVolumnProjectDTO.setDate(dateList);
                projectSalesVolumnProjectDTO.setResData(mapList);

                resultList.add(projectSalesVolumnProjectDTO);
            }
        }
        projectSalesVolumnChartVM.setProjectResult(resultList);

        double xAxis = ProjectSalesVolumnService.findMiddle(xTotal);
        double yAxis = ProjectSalesVolumnService.findMiddle(yTotalLong);
        projectSalesVolumnChartVM.setXAxisMiddle(xAxis);
        projectSalesVolumnChartVM.setYAxisMiddle(yAxis);

        return projectSalesVolumnChartVM;
    }

    /**
     * 校验并计算
     *
     * @param datas
     * @param errMsgList
     * @param page
     * @return
     */
    public ProjectSalesVolumnChartVM checkAndCompute(List<String[]> datas, List<String> errMsgList, CrossAnalysisPage page) {

        List<Long> xTotal = new ArrayList<Long>();
        List<Long> yTotalLong = new ArrayList<Long>();
        ProjectSalesVolumnChartVM projectSalesVolumnChartVM = new ProjectSalesVolumnChartVM();
        DecimalFormat decimalFormat = new DecimalFormat("0.0");//格式化设置

        String startDate = page.getStartDate();
        String endDate = page.getEndDate();
        String dateStr = startDate + "~" + endDate;

        // List<Long> timeList = new ArrayList<>();
        // timeList.add(DateUtil.getTimeStamp(page.getStartDate(), DATE_STR));
        // timeList.add(DateUtil.getTimeStamp(page.getEndDate(), DATE_STR));

        //读取文件
        ProjectSalesVolumnDTO projectSalesVolumnDTO = checkFile(datas, errMsgList, page.getProjectId());
        //获取所有时间
        // List<String> allDateStr = getStartAndEnd(timeList);

        List<ProjectSalesVolumn> result = new ArrayList<>();
        User user = UserInfoUtil.getUser();

        List<List<String>> mapList = new ArrayList<List<String>>();
        List<String> nameList = new ArrayList<String>();
        List<String> dateList = new ArrayList<String>();
        List<ProjectSalesVolumnProjectDTO> resultList = new ArrayList<ProjectSalesVolumnProjectDTO>();

        //遍历所有上传的项目
        for (Map.Entry<String, Object> childrenProject : projectSalesVolumnDTO.getProjectMap().entrySet()) {
            ProjectSalesVolumn projectSalesVolumn = (ProjectSalesVolumn) childrenProject.getValue();
            // String childId = childrenProject.getKey();
            // Map<String, ProjectSalesVolumn> childDateMap = childrenProject.getValue();

            //获取projectNum
            // String projectNum = "";
            // for (ProjectSalesVolumn v : childDateMap.values()) {
            //     projectNum = v.getCode();
            //     break;
            // }

            //遍历所有时间
//			for(Map.Entry<Long, ProjectSalesVolumn> date : projectMap.entrySet()) {//只有上传时间
//             for (String date : allDateStr) {//业务需求为所有时间，没有值则为0
                List<String> list = new ArrayList<String>();

                //y
                // ProjectSalesVolumn projectSalesVolumn;
                // if (childDateMap.get(dateStr) == null) {
                //     projectSalesVolumn = new ProjectSalesVolumn();
                //     projectSalesVolumn.setCode(projectNum);
                //     projectSalesVolumn.setValue(0.0);
                // } else {
                //     projectSalesVolumn = childDateMap.get(dateStr);
                // }

                //x
                String type = page.getXAxis();
//				String xDateStart = DateUtil.getMonthStartDay(date);
//				String xDateEnd = DateUtil.getMonthEndDay(date);
                String table = "";
                if (null != type && type.equals("enter")) {//进店客流（到访）
                    table = WiFiAnalyticsQuerService.OFFLINE_ACTIVE_USER_DAY_COUNTER;
                } else if (null != type && type.equals("stay")) {//停留客流
                    table = WiFiAnalyticsQuerService.OFFLINE_STAY_USER_DAY_COUNTER;
                } else {
                    continue;
                }
                Long xValue = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(childrenProject.getKey(), startDate, endDate, table);
                if (xValue == null) {
                    xValue = 0l;
                }
                projectSalesVolumn.setPassengerFlow(xValue);

                //补充信息
                projectSalesVolumn.setDate(dateStr);
                projectSalesVolumn.setProjectId(childrenProject.getKey());
                projectSalesVolumn.setTenantId(UserInfoUtil.getCurrentTenantId());
                //上传不保存结果
                projectSalesVolumn.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);

                result.add(projectSalesVolumn);

                //获取项目信息
                ProjectPage projectPage = new ProjectPage();
                projectPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                projectPage.setId(Integer.parseInt(projectSalesVolumn.getProjectId()));
                Project project = projectService.queryBySingle(projectPage);

                String yValueStr = decimalFormat.format(projectSalesVolumn.getValue());
                Long yValueLong = (long) (projectSalesVolumn.getValue().doubleValue());

                list.add(projectSalesVolumn.getPassengerFlow() + "");//x
                list.add(yValueStr);//y

                mapList.add(list);
                dateList.add(dateStr);
                nameList.add(project.getProjectName());

                xTotal.add(projectSalesVolumn.getPassengerFlow());
                yTotalLong.add(yValueLong);

            // }
        }
        ProjectSalesVolumnProjectDTO projectSalesVolumnProjectDTO = new ProjectSalesVolumnProjectDTO();
        projectSalesVolumnProjectDTO.setProjectId(Integer.parseInt(page.getProjectId()));
        projectSalesVolumnProjectDTO.setNameIndex(nameList);
        projectSalesVolumnProjectDTO.setDate(dateList);
        projectSalesVolumnProjectDTO.setResData(mapList);

        resultList.add(projectSalesVolumnProjectDTO);

        projectSalesVolumnChartVM.setProjectResult(resultList);

        double xAxis = ProjectSalesVolumnService.findMiddle(xTotal);
        double yAxis = ProjectSalesVolumnService.findMiddle(yTotalLong);
        projectSalesVolumnChartVM.setXAxisMiddle(xAxis);
        projectSalesVolumnChartVM.setYAxisMiddle(yAxis);
        projectSalesVolumnChartVM.setErrMsgList(projectSalesVolumnDTO.getErrMsgList());

        projectSalesVolumnChartVM.setProjectSalesVolumns(result);

        return projectSalesVolumnChartVM;
    }

    /**
     * 保存结果
     *
     * @param page
     * @return
     */
    public CrossAnalysis saveResult(CrossAnalysisPage page) {
        User user = UserInfoUtil.getUser();
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        List<CrossAnalysis> list = queryByList(page);
        if (list != null && list.size() > 0) {
            return null;//存在重复
        }

        CrossAnalysis crossAnalysis = crossAnalysisMapper.crossAnalysisPageToCrossAnalysis(page);
        crossAnalysis.setCreateBy(user.getUmid());
        crossAnalysis.setCreator(user.getName());
        dao.insert(crossAnalysis);
        List<ProjectSalesVolumn> projectSalesVolumns = page.getProjectSalesVolumns();
        for (ProjectSalesVolumn projectSalesVolumn : projectSalesVolumns) {
            projectSalesVolumn.setCrossAnalysisId(crossAnalysis.getId());
            projectSalesVolumn.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
            projectSalesVolumn.setCreateBy(user.getUmid());
            projectSalesVolumn.setCreator(user.getName());
            projectSalesVolumnService.insert(projectSalesVolumn);
        }
        return crossAnalysis;
    }

    /**
     * 删除交叉分析及对应销量
     *
     * @param crossAnalysis
     * @return
     * @throws Exception
     */
    public void delete(CrossAnalysis crossAnalysis) throws Exception {
        //通过交叉分析查询销量并设置失效
        ProjectSalesVolumnPage page = new ProjectSalesVolumnPage();
        page.setCrossAnalysisId(crossAnalysis.getId());
        page.setPageEnabled(false);
        List<ProjectSalesVolumn> pojectSalesVolumns = projectSalesVolumnService.queryByList(page);
        for (ProjectSalesVolumn pojectSalesVolumn : pojectSalesVolumns) {
            pojectSalesVolumn.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
            projectSalesVolumnService.updateByPrimaryKey(pojectSalesVolumn);
        }

        //设置失效
        crossAnalysis.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
        dao.updateByPrimaryKey(crossAnalysis);
    }

    /**
     * 读取并校验文件
     *
     * @param datas
     * @param errMsgList
     * @param projectId
     * @return
     */
    private ProjectSalesVolumnDTO checkFile(List<String[]> datas, List<String> errMsgList, String projectId) {
        ProjectSalesVolumnDTO projectSalesVolumnDTO = new ProjectSalesVolumnDTO();
        User user = UserInfoUtil.getUser();
        Map<String, Object> result = new HashMap<>();
        for (int i = 0; i < datas.size(); i++) {
            String[] values = datas.get(i);
            int lineNum = i + 2;

            //日期
            // String date = values[0];
            // if (!Pattern.compile(DATE_PATTERN).matcher(date).find()) {
            //     logger.info("第" + lineNum + "行，日期(" + date + ")格式不符规范，已跳过");
            //     errMsgList.add("第" + lineNum + "行，日期(" + date + ")格式不符合规范，已跳过");
            //     continue;
            // }

            if(values.length>0) {
                //项目编号
                String projectCode = values[0];
                ProjectPage projectPage = new ProjectPage();
                projectPage.setTenantId(UserInfoUtil.getCurrentTenantId());
                int id = 0;
                try {
                    id = Integer.parseInt(projectId);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                projectPage.setId(id);
                projectPage.setProjectNum(projectCode);
                projectPage.setProjectType(ProjectTypeEnum.PROJECT_SHOP.getCode());

                ProjectPage tmpPgae = new ProjectPage();
                tmpPgae.setId(id);
                tmpPgae.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                tmpPgae.setProjectNum(projectCode);
                List <Project> projects = projectService.getDirectChildrenByParam(tmpPgae);
                if (projects.size() == 0) {
                    try {
                        projects = projectService.queryByList(projectPage);
                        if (projects.size() == 0) {
                            logger.info("第" + lineNum + "行，项目编号(" + projectCode + ")无匹配子项目，已跳过");
                            errMsgList.add("第" + lineNum + "行，项目编号(" + projectCode + ")无匹配子项目，已跳过");
                            continue;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                //销售额
                String valueStr = values[1];
                if (!Pattern.compile(MONEY_PATTERN).matcher(valueStr).find()) {
                    logger.info("第" + lineNum + "行，销售额(" + valueStr + ")格式不符规范，已跳过");
                    errMsgList.add("第" + lineNum + "行，销售额(" + valueStr + ")格式不符规范，已跳过");
                    continue;
                }
                double valueDouble = 0;
                try {
                    valueDouble = Double.parseDouble(valueStr);
                } catch (Exception e) {
                    logger.info("第" + lineNum + "行，销售额(" + valueStr + ")无法转换成数值，已跳过");
                    errMsgList.add("第" + lineNum + "行，销售额(" + valueStr + ")无法转换成数值，已跳过");
                    continue;
                }

                ProjectSalesVolumn projectSalesVolumn = new ProjectSalesVolumn();
                String childId = projects.get(0).getId() + "";
//			date = date.substring(0, 7);
                projectSalesVolumn.setCode(projectCode);
                projectSalesVolumn.setValue(valueDouble);
                projectSalesVolumn.setUnit(ProjectSalesVolumnService.UNIT);

                // timeList.add(DateUtil.getTimeStamp(date, DATE_STR));
                // Map<String, ProjectSalesVolumn> map = result.get(childId);
                // if (map == null) {
                //     map = new HashMap<>();
                // }
                // map.put(date, projectSalesVolumn);
                result.put(childId, projectSalesVolumn);
            }else{
                errMsgList.add("导入数据有误！");
            }
        }
        if(errMsgList.size()==0){
            errMsgList.add("计算完成");
        }
        projectSalesVolumnDTO.setProjectMap(result);
        projectSalesVolumnDTO.setErrMsgList(errMsgList);
        return projectSalesVolumnDTO;
    }

    /**
     * 获取起始结束月份
     *
     * @param timeList
     * @return
     */
    private static List<String> getStartAndEnd(List<Long> timeList) {
        Long min = Collections.min(timeList);
        Long max = Collections.max(timeList);
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_STR);
        String start = sdf.format(new Date(min));
        String end = sdf.format(new Date(max));
        return DateUtil.getDateRange(start, end, DATE_STR);
    }

}

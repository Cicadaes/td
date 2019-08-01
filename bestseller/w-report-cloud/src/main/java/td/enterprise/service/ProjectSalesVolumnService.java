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
import td.enterprise.dao.ProjectSalesVolumnDao;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectSalesVolumn;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.ProjectSalesVolumnPage;
import td.enterprise.service.DTO.ProjectSalesVolumnProjectDTO;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.ProjectSalesVolumnChartVM;
import td.olap.query.QueryServiceVisitDepth;
import td.olap.query.WiFiAnalyticsQuerService;

import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

/**
 * <br>
 * <b>功能：</b>项目销售额 ProjectSalesVolumnService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectSalesVolumnService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectSalesVolumnService extends BaseService<ProjectSalesVolumn> {
    public final static Logger logger = Logger.getLogger(ProjectSalesVolumnService.class);

    @Autowired
    private ProjectSalesVolumnDao dao;
    @Autowired
    private ProjectService projectService;

    public static String UNIT = "元";

    @Autowired
    private ParamService paramService;


    public ProjectSalesVolumnDao getDao() {
        return dao;
    }

    /**
     * 批量导入
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List<String> batchImport(ProjectSalesVolumnPage page) throws Exception {
        List<String> errMsgList = new ArrayList<>();

        MultipartFile file = page.getFile();
        if (file != null) {
            logger.info("projectSalesVolumns.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file.getSize());
            InputStream is = file.getInputStream();
            String sheetName = "Sheet1";
            int startRowNum = 1;
            List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);

            if (datas == null || datas.size() == 0) {
                logger.info("导入模板数据为空！");
                errMsgList.add("导入模板数据为空！");
            } else {
                String projectId = page.getProjectId();
                List<ProjectSalesVolumn> projectSalesVolumns = check(datas, errMsgList, projectId);
                errMsgList.addAll(save(projectSalesVolumns));
            }
        }
        return errMsgList;
    }

    /**
     * 获取客流和销售额信息cross（已废弃）
     *
     * @param page
     * @return
     * @throws Exception
     */
    public ProjectSalesVolumnChartVM getCoordinateInfo(ProjectSalesVolumnPage page) throws Exception {
//		List<Map<String, Object>> mapList = new ArrayList<Map<String, Object>>();

        String tenantId = page.getTenantId();
        String projectIds = page.getProjectIds();
        String type = page.getType();
        String startDate = page.getStart();

//		String yDate = getYDate();//默认获取当前时间
        String yDate = startDate;
        List<Long> xTotal = new ArrayList<Long>();
        List<Long> yTotalLong = new ArrayList<Long>();
        ProjectSalesVolumnChartVM projectSalesVolumnChartVM = new ProjectSalesVolumnChartVM();
        DecimalFormat decimalFormat = new DecimalFormat("0.0");//格式化设置
        List<ProjectSalesVolumnProjectDTO> resultList = new ArrayList<ProjectSalesVolumnProjectDTO>();

        if (projectIds != null && !"".equals(projectIds) && !"null".equals(projectIds)) {
            String[] projectIdArray = projectIds.split(",");

            for (int i = 0; i < projectIdArray.length; i++) {
                List<Project> projects = new ArrayList<Project>();

                Integer projectId = Integer.parseInt(projectIdArray[i]);

                ProjectPage tmpPgae = new ProjectPage();
                tmpPgae.setId(projectId);
                tmpPgae.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                List<Project> tmpList = projectService.getDirectChildrenByParam(tmpPgae);
                if (tmpList.size() > 0) {
                    projects.addAll(tmpList);
                } else {
                    projects = projectService.queryByList(tmpPgae);
                    if (projects.size() > 0) {
                        projects.add(projects.get(0));
                    }
                }

                List<List<String>> mapList = new ArrayList<List<String>>();
                List<String> nameList = new ArrayList<String>();
                List<String> dateList = new ArrayList<String>();
                for (Project project : projects) {
                    List<String> list = new ArrayList<String>();

                    //y
                    String yValueStr = "0.0";
                    Long yValueLong = 0l;
                    Double yValue = 0.0;
                    ProjectSalesVolumn projectSalesVolumn = new ProjectSalesVolumn();
                    projectSalesVolumn.setDate(yDate);
                    projectSalesVolumn.setCode(project.getProjectNum());
                    projectSalesVolumn.setUnit(UNIT);
                    projectSalesVolumn.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                    projectSalesVolumn.setProjectId(project.getId() + "");
                    projectSalesVolumn.setTenantId(tenantId);
                    List<ProjectSalesVolumn> psvs = dao.queryByListRoll(projectSalesVolumn);
                    if (psvs != null && psvs.size() > 0) {
                        yValueStr = decimalFormat.format(psvs.get(0).getValue());
                        yValueLong = (long) (psvs.get(0).getValue().doubleValue());
                        yDate = psvs.get(0).getDate();

                    } else {
                        logger.info(project.getProjectName() + "：销售额数据不存在");
//		    			continue;
                    }

                    //x
                    Long xValue = 0L;
                    //y轴影响x轴日期
                    String xDateStart = DateUtil.getMonthStartDay(yDate);
                    String xDateEnd = DateUtil.getMonthEndDay(yDate);
                    String table = "";
                    if (null != type && type.equals("enter")) {//进店客流（到访）
                        table = WiFiAnalyticsQuerService.OFFLINE_ACTIVE_USER_DAY_COUNTER;
                    } else if (null != type && type.equals("stay")) {//停留客流
                        table = WiFiAnalyticsQuerService.OFFLINE_STAY_USER_DAY_COUNTER;
                    } else {
                        continue;
                    }
                    xValue = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(project.getId()  + "", xDateStart, xDateEnd, table);

                    list.add(xValue + "");
                    list.add(yValueStr);

                    mapList.add(list);
                    dateList.add(xDateStart + "-" + xDateEnd);
                    nameList.add(project.getProjectName());

                    xTotal.add(xValue);
                    yTotalLong.add(yValueLong);
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

        double xAxis = findMiddle(xTotal);
        double yAxis = findMiddle(yTotalLong);
        projectSalesVolumnChartVM.setXAxisMiddle(xAxis);
        projectSalesVolumnChartVM.setYAxisMiddle(yAxis);

        return projectSalesVolumnChartVM;
    }

    /**
     * 校验并保存
     *
     * @param result
     * @return
     */
    private List<String> save(List<ProjectSalesVolumn> result) {
        List<String> errMsgList = new ArrayList<>();
        if (result.size() > 0) {
            int saveCount = 0;
            int updateCount = 0;
            int discardCount = 0;
            User user = UserInfoUtil.getUser();

            for (ProjectSalesVolumn projectSalesVolumn : result) {
                //check
                ProjectSalesVolumnPage page = new ProjectSalesVolumnPage();
                page.setDate(projectSalesVolumn.getDate());
                page.setCode(projectSalesVolumn.getCode());
                page.setUnit(projectSalesVolumn.getUnit());
                page.setStatus(projectSalesVolumn.getStatus());
                page.setProjectId(projectSalesVolumn.getProjectId());
                page.setTenantId(projectSalesVolumn.getTenantId());
                List<ProjectSalesVolumn> list = dao.queryByList(page);

                if (list.size() == 0) {
                    //save
                    dao.insert(projectSalesVolumn);
                    saveCount++;

                } else if (list.size() == 1) {
//					if(overwrite!=null && overwrite.equals("true")){//覆盖保存
                    //update value
                    projectSalesVolumn.setUpdateBy(user.getUmid());
                    projectSalesVolumn.setUpdater(user.getUserName());
                    dao.updateValue(projectSalesVolumn);
                    updateCount++;
//					}else{
//						discardCount++;
//					}
                } else {
                    errMsgList.add(projectSalesVolumn.toString() + "：数据存在异常！");
                    result.remove(projectSalesVolumn);
                }
            }

//			errMsgList.add("导入结果："+saveCount+"条新数据导入成功，"+updateCount+"条已存在已被更新，"+discardCount+"条已存在未被更新，"+(datas.size()-result.size())+"条导入失败。");

            String msg = "导入结果：" + saveCount + "条新数据导入成功。";
            if (updateCount > 0) {
                msg += updateCount + "条新数据存在重复，以最新为准。";
            }
            errMsgList.add(msg);
        } else {
            errMsgList.add("未成功导入任何数据！");
        }
        return errMsgList;
    }

    /**
     * 校验参数
     *
     * @param datas
     * @param errMsgList
     * @param projectId
     * @return
     */
    public List<ProjectSalesVolumn> check(List<String[]> datas, List<String> errMsgList, String projectId) {
        User user = UserInfoUtil.getUser();
        List<ProjectSalesVolumn> result = new ArrayList<ProjectSalesVolumn>();
        for (int i = 0; i < datas.size(); i++) {
            String[] values = datas.get(i);
            int lineNum = i + 2;

            //日期
            String date = values[0];
            String patternDate = "^20\\d{2}[-](0[1-9])|1[0-2]$";  //yyyy-MM
            if (!Pattern.compile(patternDate).matcher(date).find()) {
                logger.info("第" + lineNum + "行，日期(" + date + ")格式不符规范");
                errMsgList.add("第" + lineNum + "行，日期(" + date + ")格式不符合规范");
                continue;
            }

            //项目编号
            String projectCode = values[1];
            ProjectPage page = new ProjectPage();
            page.setTenantId(UserInfoUtil.getCurrentUserTenantId());
            int id = 0;
            try {
                id = Integer.parseInt(projectId);
            } catch (Exception e) {
                e.printStackTrace();
            }
            page.setId(id);
            page.setProjectNum(projectCode);
            page.setProjectType(ProjectTypeEnum.PROJECT_SHOP.getCode());

            ProjectPage tmpPgae = new ProjectPage();
            tmpPgae.setId(id);
            tmpPgae.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
            tmpPgae.setProjectNum(projectCode);
            List<Project> projects = projectService.getDirectChildrenByParam(tmpPgae);
            if (projects.size() == 0) {
                try {
                    projects = projectService.queryByList(page);
                    if (projects.size() == 0) {
                        logger.info("第" + lineNum + "行，项目编号(" + projectCode + ")无匹配子项目");
                        errMsgList.add("第" + lineNum + "行，项目编号(" + projectCode + ")无匹配子项目");
                        continue;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            //销售额
            String valueStr = values[2];
            String patternMoney = "^([+-]?)((\\d{1,3}(,\\d{3})*)|(\\d+))((\\.\\d{1})|(\\.\\d{2}))?$";
            if (!Pattern.compile(patternMoney).matcher(valueStr).find()) {
                logger.info("第" + lineNum + "行，销售额(" + valueStr + ")格式不符规范");
                errMsgList.add("第" + lineNum + "行，销售额(" + valueStr + ")格式不符规范 ");
                continue;
            }
            double valueDouble = 0;
            try {
                valueDouble = Double.parseDouble(valueStr);
            } catch (Exception e) {
                logger.info("第" + lineNum + "行，销售额(" + valueStr + ")无法转换成数值");
                errMsgList.add("第" + lineNum + "行，销售额(" + valueStr + ")无法转换成数值");
                continue;
            }

            ProjectSalesVolumn projectSalesVolumn = new ProjectSalesVolumn();
            projectSalesVolumn.setDate(date);
            projectSalesVolumn.setCode(projectCode);
            projectSalesVolumn.setValue(valueDouble);
            projectSalesVolumn.setUnit(UNIT);
            //上传不保存结果
            projectSalesVolumn.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
            projectSalesVolumn.setProjectId(projects.get(0).getId() + "");
            projectSalesVolumn.setTenantId(UserInfoUtil.getCurrentUserTenantId());
            projectSalesVolumn.setCreateBy(user.getUmid());
            projectSalesVolumn.setCreator(user.getUserName());

            result.add(projectSalesVolumn);
        }
        return result;
    }

    /**
     * 计算中间值
     *
     * @param total
     * @return
     */
    public static double findMiddle(List<Long> total) {
        double axis = 0.5;
        if (total.size() >= 2 && Collections.max(total) > 0) {
            long xmin = Collections.min(total);
            long xmax = Collections.max(total);
            axis = (xmin + xmax) / 2;
        } else if (total.size() == 1) {
            axis = total.get(0) / 2;
        }
        return axis;
    }

}

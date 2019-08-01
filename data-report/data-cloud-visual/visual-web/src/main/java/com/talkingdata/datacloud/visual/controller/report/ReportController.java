package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.exception.BusinessException;
import com.talkingdata.datacloud.visual.entity.report.Report;
import com.talkingdata.datacloud.visual.entity.report.ReportPrivilege;
import com.talkingdata.datacloud.visual.page.report.ReportPage;
import com.talkingdata.datacloud.visual.service.report.PrivilegeService;
import com.talkingdata.datacloud.visual.service.report.ReportService;
import com.talkingdata.datacloud.visual.util.EmailComponent;
import com.talkingdata.datacloud.visual.util.Msg;
import com.talkingdata.datacloud.visual.util.ReportHelper;
import com.tendcloud.enterprise.um.umic.entity.Role;
import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping("/report")
public class ReportController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private ReportService reportService;

    @Autowired
    private PrivilegeService privilegeService;

//    @Value("${appcode}")
    @Value("${appcode}")
    private String appCode;

//    @Value("${apptaken}")
    @Value("${apptaken}")
    private String appTaken;

//    @Value("${adminRoleCode}")
    @Value("${adminRoleCode}")
    private String adminRoleCode;

    @PostConstruct
    private void initProperty() {
        privilegeService.initApp(appCode, appTaken,adminRoleCode);
    }

    @RequestMapping(value = "/reports", method = GET)
    @ResponseBody
    public List<Report> query(ReportPage page) throws Exception {
        page.setOrderBy(Report.fieldToColumn(page.getOrderBy()));
        return reportService.queryByList(page);
    }

    /**
     * 获取报表列表页
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(HttpServletRequest request,ReportPage page) throws Exception {
        User user = privilegeService.getUserByRequest(request);
        //在设计界面只能看到自己的报表，没有管理员权限
//        if(!privilegeService.isAdmin(user,appCode)){
            page.setCreator(user.getName());
//        }
        page.setOrderBy(Report.fieldToColumn(page.getOrderBy()));
        List<Report> rows = reportService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    /**
     * 获取数据源关联报表列表
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports/dataSources/{id}", method = GET)
    @ResponseBody
    public List<Report> queryByDataSourceId(@PathVariable Integer id) throws Exception {
        return reportService.queryByDataSourceId(id);
    }

    /**
     * 发布和下线报表
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports/publish", method = POST)
    @ResponseBody
    public Map<String, Object> publishReport(HttpServletRequest request, @RequestBody com.talkingdata.datacloud.visual.vo.Report report) throws Exception {
        Report dbReport=reportService.selectByPrimaryKey(report.getId());
        if(report.getStatus()!=1&&report.getStatus()!=2){
            return Msg.getFailureMessage("状态错误，不应为"+report.getStatus());
        }
        String msg=report.getStatus()==1?"发布":"下线";
        if(dbReport.getStatus()==report.getStatus()){
            return Msg.getFailureMessage("不能重复"+msg);
        }
        User user = privilegeService.getUserByRequest(request);
        dbReport.setUpdater(user.getName());
        dbReport.setUpdateBy(user.getUmid());
        dbReport.setStatus(report.getStatus());
        int count=0;
        if(report.getStatus()==1){
            dbReport.setPublishTime(new Date());
            dbReport.setOfflineTime(null);
            count=reportService.publishReport(dbReport);
        }else if(report.getStatus()==2) {
            dbReport.setPublishTime(null);
            dbReport.setOfflineTime(new Date());
            count=reportService.offlineReport(dbReport);
        }

        if(count>0){
            //下线之后需要在UM中删除此资源
            return Msg.getSuccessMessage(msg+"成功");
        }
        else {
            return Msg.getFailureMessage(msg + "失败");
        }
    }

    /**
     * 获取发布报表列表页
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/publishReports/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryPublishReportsRows(HttpServletRequest request,ReportPage page) throws Exception {
        User user = privilegeService.getUserByRequest(request);
        if(!privilegeService.isAdmin(user,appCode)){
            page.setCreator(user.getName());
        }
        page.setStatus(1);
        page.setOrderBy(Report.fieldToColumn(page.getOrderBy()));
        List<Report> rows = reportService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    /**
     * 获取report全部定义信息
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports/{id}", method = GET)
    @ResponseBody
    @Cacheable(value="datareport",key="#id.toString()")
    public com.talkingdata.datacloud.visual.vo.Report find(@PathVariable Integer id) throws Exception {
        Report report = reportService.selectReportWithCharts(id);
        if(report==null){
            return null;
        }
        return ReportHelper.dbReport2Report(report);
    }

    /**
     * 发送report的发布URL
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports/sendEmail", method = GET)
    @ResponseBody
    public Map<String, Object> sendEmail(@RequestParam(value = "toEmail", required = true) String toEmail,
                                         @RequestParam(value = "subject", required = true) String subject,
                                         @RequestParam(value = "url", required = true) String url) throws Exception {
        boolean success= EmailComponent.sendHtmlEmail(toEmail,subject,url);
        if(success){
            return Msg.getSuccessMessage("发送成功");
        }
        else {
            return Msg.getSuccessMessage("发送失败");
        }
    }

    /**
     * 获取发布报表
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/publishReports/{id}", method = GET)
    @ResponseBody
    public String get(@PathVariable Integer id) throws Exception {
        return "报表已发布";
    }

    /**
     * 保存report的自定义报表
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @CacheEvict(value="datareport",key="#report.id.toString()")
    public Map<String, Object> create(HttpServletRequest request, @RequestBody com.talkingdata.datacloud.visual.vo.Report report) throws Exception {

        User user = privilegeService.getUserByRequest(request);

        Report dbReport= ReportHelper.report2DBReport(report);
        dbReport.setUpdater(user.getName());
        dbReport.setUpdateBy(user.getUmid());
        String checkResult=checkReport(dbReport,0);
        if(checkResult!=null){
            return Msg.getFailureMessage(checkResult);
        }
        reportService.insertOrUpdate(dbReport);
        Map resultMap=Msg.getSuccessMessage("保存成功");
        return resultMap;
    }

    /**
     * 保存report的自定义报表
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @CacheEvict(value="datareport",key="#report.id.toString()")
    public Map<String, Object> update(HttpServletRequest request, @RequestBody com.talkingdata.datacloud.visual.vo.Report report) throws Exception {

        User user = privilegeService.getUserByRequest(request);
        Report dbReport= new Report();
        dbReport.setId(report.getId());
        dbReport.setName(report.getName());
        dbReport.setUpdater(user.getName());
        dbReport.setUpdateBy(user.getUmid());
        String checkResult=checkReport(dbReport,0);
        if(checkResult!=null){
            return Msg.getFailureMessage(checkResult);
        }
        dbReport.setDescription(report.getDescription());
        reportService.updateByPrimaryKeySelective(dbReport);
        Map resultMap=Msg.getSuccessMessage("修改成功");
        return resultMap;
    }



    /**
     * 创建并保存report的自定义报表
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/reports/new", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> createNew(HttpServletRequest request,@RequestBody com.talkingdata.datacloud.visual.vo.Report report) throws Exception {
        User user = privilegeService.getUserByRequest(request);

        Report dbReport= ReportHelper.report2DBReport(report);
        dbReport.setCreator(user.getName());
        dbReport.setCreateBy(user.getUmid());
        dbReport.setUpdater(user.getName());
        dbReport.setUpdateBy(user.getUmid());
        String checkResult=checkReportName(dbReport);
        if(checkResult!=null){
            return Msg.getFailureMessage(checkResult);
        }
        int reportId=reportService.insert(dbReport);
        Map resultMap=Msg.getSuccessMessage("保存成功");
        resultMap.put("reportId",reportId);
        return resultMap;
    }

    /**
     * 检查报表操作是否正确，operateStatus为0时为修改，1时为删除
     * @param report
     * @param operateStatus
     * @return
     * @throws Exception
     */
    private String checkReport(Report report,Integer operateStatus)throws Exception{
        Report dbReport = reportService.selectByPrimaryKey(report.getId());
        String operateStr="修改";
        if(operateStatus==1) {
            operateStr = "删除";
        }
        if(dbReport.getStatus()==1){
            return "报表已经发布，无法"+operateStr;
        }else if(!dbReport.getCreator().equals(report.getUpdater())){
            return "用户只能"+operateStr+"自己的报表";
        }else if(operateStatus==0){
            return checkReportName(report);
        }
        return null;
    }

    private String checkReportName(Report report)throws Exception{
        String checkResult=null;
        if(report.getName()==null||"".equals(report.getName())){
            checkResult = "报表名称不能为空";
        }else if(report.getName().length()>255){
            checkResult = "报表名称不能超过225个字符";
        }else if(report.getName().matches(".*[\\\\/:\\*\\?<>|].*")){
            checkResult = "报表名称不能包含特殊字符（\\/:*?<>|）";
        }else if(isDuplicationName(report)){
            checkResult = "存在名称为'"+report.getName()+"'的报表，请修改报表名称";
        }
        return checkResult;
    }

    private boolean isDuplicationName(Report report)throws Exception{

        ReportPage reportPage=new ReportPage();
        reportPage.setName(report.getName());
        if(report.getId()!=null){
            reportPage.setId(report.getId()+"");
            reportPage.setIdOperator("<>");
        }
        int i=reportService.queryByCount(reportPage);
        return i>=1;
    }


    @RequestMapping(value = "/reports/{id}", method = DELETE)
    @ResponseBody
    @CacheEvict(value="datareport",key="#id.toString()")
    public Map<String, Object> delete(HttpServletRequest request,@PathVariable Integer id) throws Exception {
        User user = privilegeService.getUserByRequest(request);
        Report dbReport = reportService.selectByPrimaryKey(id);
        dbReport.setUpdater(user.getName());
        dbReport.setUpdateBy(user.getUmid());
        String checkResult=checkReport(dbReport,0);

        if(checkResult!=null){
            return Msg.getFailureMessage(checkResult);
        }
        reportService.deleteCascadeByPrimaryKey(id);
        return Msg.getSuccessMessage("删除成功");
    }

    //获取所有角色
    @RequestMapping(value = "/reports/rolelist", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public List<Role> getCatalogRole(HttpServletRequest request) throws Exception {
        User user = privilegeService.getUserByRequest(request);
        List<Role> roles = privilegeService.findAllRole(user, appCode);
        for(Role role:roles){
            role.setRoleCode(role.getRid().toString());
        }
        return roles;
    }
    //获取当前报表的权限角色
    @RequestMapping(value = "/reports/{id}/privilege", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public List<ReportPrivilege> getReportPrivilege(@PathVariable Integer id, HttpServletRequest request) throws Exception {
        User user = privilegeService.getUserByRequest(request);
        List<ReportPrivilege> reportPrivilegeList = privilegeService.getPrivileges2Report(id, user, appCode, true);
        return reportPrivilegeList != null ? reportPrivilegeList : new ArrayList<>();
    }
    //给角色授权当前报表
    @RequestMapping(value = "/reports/{id}/privilege", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> setReportPrivilege(@RequestBody List<ReportPrivilege> reportPrivilegeList, @PathVariable Integer id, HttpServletRequest request) throws Exception {
        User user = privilegeService.getUserByRequest(request);
        try {
            privilegeService.grantPrivileges2Report(id, reportPrivilegeList, user,appCode,appTaken);
            return Msg.getSuccessMessage("授权成功");
        }catch (BusinessException e){
            logger.error("授权失败",e);
            return Msg.getFailureMessage("授权失败，请联系管理员");
        }

    }
    //删除当前报表的该角色授权
    @RequestMapping(value = "/reports/{id}/privilege/{roleId}", method = DELETE, consumes = APPLICATION_JSON_UTF8_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> deleteReportPrivilege(@PathVariable Integer roleId, @PathVariable Integer id, HttpServletRequest request) throws Exception {
        try{
            privilegeService.deletePrivileges2Report(id,appCode,roleId);
            return Msg.getSuccessMessage("删除授权成功");
        }catch (BusinessException e){
            logger.error("授权失败",e);
            return Msg.getFailureMessage("删除授权失败，请联系管理员");
        }
    }

    /**
     * 获取授权报表列表页
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/privilegeReports/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryPrivilegeReportsRows(HttpServletRequest request,ReportPage page) throws Exception {
        User user = privilegeService.getUserByRequest(request);
        List<Integer> reportIds = privilegeService.getUserResource(user.getUmid(),appCode, appTaken);
        String reportIdStr= StringUtils.join(reportIds.toArray(),",");
        page.setId(reportIdStr);
        page.setIdOperator("in");
        page.setStatus(1);
        page.setCreator(user.getName());
        page.setCreatorOperator("<>");
        page.setOrderBy(Report.fieldToColumn(page.getOrderBy()));
        List<Report> rows = reportService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }


    /**
     * 获取report的page列表信息
     * @param id
     * @return
     * @throws Exception

     @RequestMapping(value = "/reports/{id}/pages", method = GET)
     @ResponseBody
     public List<Page> findPageList(@PathVariable Integer id) throws Exception {
     Report report = reportService.selectByPrimaryKey(id);

     com.talkingdata.datacloud.visual.vo.Report reportResult = ReportHelper.dbReport2Report(report);

     Integer reportId = report.getId();
     ReportPageChartRelPage reportPageChartRelPage = new ReportPageChartRelPage();
     reportPageChartRelPage.setReportId(reportId);
     List<ReportPageChartRel> reportPageChartRels = reportPageChartRelService.queryByList(reportPageChartRelPage);
     Set<Integer> pageIds = findPageIds(reportPageChartRels);
     List<Page> pages = new ArrayList<>();
     for(Integer pageId:pageIds){
     pages.add(pageService.selectByPrimaryKey(pageId));
     }
     return pages;
     }


     private Set<Integer> findPageIds(List<ReportPageChartRel> reportPageChartRels) {
     Set<Integer> pageIds = new HashSet<>();
     for(ReportPageChartRel reportPageChartRel:reportPageChartRels){
     pageIds.add(reportPageChartRel.getPageId());
     }
     return pageIds;
     }
     */
    /**
     * 获取report的单页定义信息
     * @param id
     * @param pageId
     * @return
     * @throws Exception

     @RequestMapping(value = "/reports/{id}/pages/{pageId}", method = GET)
     @ResponseBody
     public com.talkingdata.datacloud.visual.vo.Report findReportPage(@PathVariable Integer id, @PathVariable Integer pageId) throws Exception {
     Report report = reportService.selectByPrimaryKey(id);

     com.talkingdata.datacloud.visual.vo.Report reportResult = ReportHelper.dbReport2Report(report);

     Integer reportId = report.getId();
     ReportPageChartRelPage reportPageChartRelPage = new ReportPageChartRelPage();
     reportPageChartRelPage.setReportId(reportId);
     List<ReportPageChartRel> reportPageChartRels = reportPageChartRelService.queryByList(reportPageChartRelPage);
     List<Stage> stages = new ArrayList<>();


     Page page = pageService.selectByPrimaryKey(pageId);
     List<Chart> chartList = new ArrayList<>();
     List<Integer> chartIds = findChartIds(reportPageChartRels,pageId);
     for(Integer chartId:chartIds){
     Chart chart = chartService.selectByPrimaryKey(chartId);
     chartList.add(chart);
     }
     page.setChartList(chartList);
     stages.add(ReportHelper.page2Stage(page));


     reportResult.setStages(stages);
     return reportResult;
     }
     */

    /**
     * 获取report的发布URL
     * @param id
     * @return
     * @throws Exception

     @RequestMapping(value = "/reports/{id}/publicUrl", method = GET)
     @ResponseBody
     public String findPublicUrl(@PathVariable Integer id) throws Exception {
     Report report = reportService.selectByPrimaryKey(id);
     return reportUrl+report.getUrl();
     }
     */
}

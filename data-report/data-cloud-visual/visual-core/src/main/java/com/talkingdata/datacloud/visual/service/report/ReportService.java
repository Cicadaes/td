package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.*;
import com.talkingdata.datacloud.visual.entity.report.*;
import com.talkingdata.datacloud.visual.page.report.ChartDataConfigPage;
import com.talkingdata.datacloud.visual.page.report.ChartStyleConfigPage;
import com.talkingdata.datacloud.visual.page.report.PagePage;
import com.talkingdata.datacloud.visual.page.report.ReportPageChartRelPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_REPORT ReportService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("reportService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ReportService extends BaseService<Report, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    @Autowired
    private ReportDao dao;
    @Autowired
    private PageDao pageDao;

    @Autowired
    private ReportPageChartRelDao reportPageChartRelDao;
    @Autowired
    private ChartDao chartDao;
    @Autowired
    private ChartStyleConfigDao chartStyleConfigDao;
    @Autowired
    private ChartStyleConfigService chartStyleConfigService;
    @Autowired
    private ChartDataConfigDao chartDataConfigDao;
    @Autowired
    private ChartDataConfigService chartDataConfigService;
    @Autowired
    private PrivilegeService privilegeService;
    @Autowired
    private DataSourceSnapshotService dataSourceSnapshotService;

    @Override
    public BaseDao<Report> getDao() {
        return dao;
    }

    public int insert(Report report)throws Exception{
        getDao().insert(report);
        insertPage(report);
        return report.getId();
    }

    private int insertPage(Report report){
        int reportId = report.getId();
        for (Page page : report.getPageList()) {
            page.setId(null);
            page.setReportId(reportId);
            pageDao.insert(page);
            Integer pageId = page.getId();
            page.setId(pageId);
            if(page.getChartList().size()==0){
                ReportPageChartRel reportPageChartRel=new ReportPageChartRel();
                reportPageChartRel.setPageId(pageId);
                reportPageChartRel.setReportId(reportId);
                reportPageChartRelDao.insert(reportPageChartRel);
            }else{
                for (Chart chart : page.getChartList()) {
                    insertChartRelatedRecord(report.getId(), page.getId(), chart);
                }
            }
        }
        return reportId;
    }

    public int insertOrUpdate(Report report)throws Exception{
        if(report.getId()==null){
            insert(report);
        }else{
            Report result=getDao().selectByPrimaryKey(report.getId());
            if(result==null){
                report.setId(null);
                insert(report);
            }else{
                report.setUpdateTime(new Date());
                getDao().updateByPrimaryKeySelective(report);
                deletePageCascadePrimaryKey(report.getId());
                insertPage(report);
            }
        }
        return report.getId();
    }

    private void insertChartRelatedRecord(Integer reportId,Integer pageId,Chart chart){
        chart.setId(null);
        chartDao.insert(chart);
        int chartId=chart.getId();
        chart.getChartStyleConfig().setChartId(chartId);
        chart.getChartDataConfig().setChartId(chartId);
        chartStyleConfigDao.insert(chart.getChartStyleConfig());
        chartDataConfigDao.insert(chart.getChartDataConfig());
        ReportPageChartRel reportPageChartRel=new ReportPageChartRel();
        reportPageChartRel.setChartId(chart.getId());
        reportPageChartRel.setPageId(pageId);
        reportPageChartRel.setReportId(reportId);
        reportPageChartRelDao.insert(reportPageChartRel);
    }

    public void deleteCascadeByPrimaryKey(Integer reportId){
        getDao().deleteByPrimaryKey(reportId);
        deletePageCascadePrimaryKey(reportId);
    }

    private void deletePageCascadePrimaryKey(Integer reportId){
        ReportPageChartRelPage reportPageChartRelPage=new ReportPageChartRelPage();
        reportPageChartRelPage.setReportId(reportId);
        reportPageChartRelPage.setPageSize(10000);
        List<ReportPageChartRel> reportPageChartRelList=reportPageChartRelDao.queryByList(reportPageChartRelPage);
        Set<Integer> pageIdSet=new HashSet<>();
        Set<Integer> chartIdSet=new HashSet<>();
        for(ReportPageChartRel reportPageChartRel:reportPageChartRelList){
            pageIdSet.add(reportPageChartRel.getPageId());
            chartIdSet.add(reportPageChartRel.getChartId());
            reportPageChartRelDao.deleteByPrimaryKey(reportPageChartRel.getId());
        }
        for(Integer pageId:pageIdSet){
            pageDao.deleteByPrimaryKey(pageId);
        }
        for(Integer chartId:chartIdSet){
            chartDao.deleteByPrimaryKey(chartId);
            chartStyleConfigDao.deleteByChartId(chartId);
            chartDataConfigDao.deleteByChartId(chartId);
        }
    }

    public List<Report> queryByDataSourceId(Integer dataSourceId){
        return dao.queryByDataSourceId(dataSourceId);
    }



    public int publishReport(Report report) throws Exception{
        int count= getDao().updateByPrimaryKey(report);
        if(count>0){
            dataSourceSnapshotService.makeDataSourceSnapshot(report.getId());
        }
        return count;
    }

    public int offlineReport(Report report)throws Exception{
        privilegeService.deleteResource(report.getId());
        int count= getDao().updateByPrimaryKey(report);
        if(count>0){
            dataSourceSnapshotService.deleteDataSourceSnapshotByreportId(report.getId());
        }
        return count;
    }

    public Report selectReportWithCharts(Integer reportId)throws Exception{
        Report report = dao.selectByPrimaryKey(reportId);
        if(report==null){
            return null;
        }
        ReportPageChartRelPage reportPageChartRelPage = new ReportPageChartRelPage();
        reportPageChartRelPage.setReportId(reportId);
        reportPageChartRelPage.setPageSize(10000);
        List<ReportPageChartRel> reportPageChartRels = reportPageChartRelDao.queryByList(reportPageChartRelPage);
        PagePage pagePage=new PagePage();
        pagePage.setReportId(reportId);
        pagePage.setPageSize(10000);
        List<Page> pageList=pageDao.queryByList(pagePage);
        for(Page page:pageList){
            List<Chart> chartList = new ArrayList<>();
            List<Integer> chartIds = findChartIds(reportPageChartRels,page.getId());
            for(Integer chartId:chartIds){
                Chart chart = chartDao.selectByPrimaryKey(chartId);
                ChartDataConfigPage chartDataConfigPage = new ChartDataConfigPage();
                chartDataConfigPage.setChartId(chartId);
                ChartDataConfig chartDataConfig = chartDataConfigService.queryBySingle(chartDataConfigPage);
                chartDataConfig = chartDataConfig !=null ?chartDataConfig:new ChartDataConfig();
                chart.setChartDataConfig(chartDataConfig);

                ChartStyleConfigPage chartStyleConfigPage = new ChartStyleConfigPage();
                chartStyleConfigPage.setChartId(chartId);
                ChartStyleConfig chartStyleConfig = chartStyleConfigService.queryBySingle(chartStyleConfigPage);
                chartStyleConfig = chartStyleConfig !=null ?chartStyleConfig:new ChartStyleConfig();
                chart.setChartStyleConfig(chartStyleConfig);

                chart.setReportId(reportId);
                chart.setStatus(report.getStatus());

                chartList.add(chart);
            }
            page.setChartList(chartList);
        }
        report.setPageList(pageList);
        return report;
    }

    private List<Integer> findChartIds(List<ReportPageChartRel> reportPageChartRels, Integer pageId) {
        List<Integer> chartIds = new ArrayList<>();
        for(ReportPageChartRel reportPageChartRel:reportPageChartRels){
            if(reportPageChartRel.getPageId().intValue()==pageId.intValue()&&reportPageChartRel.getChartId()!=null){
                chartIds.add(reportPageChartRel.getChartId());
            }
        }
        return chartIds;
    }


    private Set<Integer> findPageIds(List<ReportPageChartRel> reportPageChartRels) {
        Set<Integer> pageIds = new HashSet<>();
        for(ReportPageChartRel reportPageChartRel:reportPageChartRels){
            pageIds.add(reportPageChartRel.getPageId());
        }
        return pageIds;
    }
}

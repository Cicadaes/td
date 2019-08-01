package com.talkingdata.marketing.core.service.campaign;

import java.io.File;
import java.io.InputStream;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.talkingdata.marketing.core.entity.campaign.SmsReachReport;
import com.talkingdata.marketing.core.util.ExcelUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.dao.campaign.EdmReachReportDao;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.EdmReachReport;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.dto.EdmReachReportDto;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.service.campaign.PipelineCrowdRelService;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.HDFSUtil;
import com.talkingdata.marketing.core.util.MathUtil;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_EDM_REACH_REPORT EdmReachReportService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-10-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("edmReachReportService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class EdmReachReportService extends BaseService<EdmReachReport, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(EdmReachReportService.class);

    @Autowired
    private EdmReachReportDao dao;

    @Autowired
    private SegmentService segmentService;

    @Autowired
    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;

    @Autowired
    private ConfigApi configApi;

    @Autowired
    private PipelineCrowdRelService pipelineCrowdRelService;

    @Override
    public EdmReachReportDao getDao() {
        return dao;
    }

    /**
     * 获取邮件报告文件信息
     *
     * @param segmentId  segmentID值
     * @param fileType 文件类型，成功或失败
     * @return
     * @throws Exception
     */
    public File getNoticeFile(Integer segmentId, String fileType) throws Exception {
        List<Integer> segmentIds = new ArrayList<>(1);
        segmentIds.add(segmentId);
        List<SegmentTaskCalcObjectRecord> segmentTaskCalcObjectRecords = segmentTaskCalcObjectRecordService.listBySegmentIds(segmentIds);
        if (segmentTaskCalcObjectRecords.isEmpty()) { return null; }

        String hdfsBasePath = configApi.getParam(ParamConstants.MARKETING_HDFS_REPORT_PATH, ParamConstants.SYSTEM_CODE);
        String hdfsReportPath = hdfsBasePath + File.separator + "edm" + File.separator + "%s";
        Set<String> hdfsReportPaths = new HashSet<>(16);
        hdfsReportPaths = segmentTaskCalcObjectRecords.stream().filter(e -> StringUtils.isNotBlank(e.getAttr1())).map(e -> String.format(hdfsReportPath, e.getAttr1())).collect(Collectors.toSet());
        String localTmpdir = new StringBuilder().append(System.getProperty("java.io.tmpdir")).append(File.separator).append(System.currentTimeMillis())
            .append(File.separator).append(System.currentTimeMillis()).append(segmentId).append(".zip").toString();
        HDFSUtil.copyNoticeReport2Local(hdfsReportPaths, localTmpdir, fileType, "UTF-8");
        return new File(localTmpdir);
    }

    public List<String> findTimeaxisBySegmentId(Integer segmentId) {
        List<String> dateStrings = getDao().findTimeaxisBySegmentId(segmentId);
        return dateStrings;
    }

    public EdmReachReportDto findEmdReachReportDtoByLastTime(Integer segmentId, String granularity, String statisticsDate) throws Exception {
        Crowd crowd = segmentService.getCrowdBySegmentId(segmentId);
        if (crowd == null) {
            throw new MktException("投放所属人群不存在");
        }
        int total = crowd.getEdmEstimatedSize() == null?0:crowd.getEdmEstimatedSize();
        List<EdmReachReport> emdReachReports = getDao().findBySegmentIdAndDate(segmentId, granularity, statisticsDate);
        int totalSuccCount = 0;
        int totalFailCount = 0;
        int totalInvalidAddressCount = 0;
        int totalServerRejectedCount = 0;
        int totalUnknownCount = 0;
        int totalReadCount = 0;
        int totalPersonReadCount = 0;
        int totalClickLinkCount = 0;
        int totalAccountCloseCount = 0;
        int totalInsufficientBalanceCount = 0;


        for (EdmReachReport edmReachReport : emdReachReports){
            totalSuccCount += (edmReachReport.getSuccCount() == null?0:edmReachReport.getSuccCount());
            totalFailCount += (edmReachReport.getFailCount() == null?0:edmReachReport.getFailCount());
            totalInvalidAddressCount += (edmReachReport.getInvalidAddressCount() == null?0:edmReachReport.getInvalidAddressCount());
            totalServerRejectedCount += (edmReachReport.getServerRejectedCount() == null?0:edmReachReport.getServerRejectedCount());
            totalUnknownCount += (edmReachReport.getUnknownCount() == null?0:edmReachReport.getUnknownCount());
            totalReadCount += (edmReachReport.getReadCount() == null?0:edmReachReport.getReadCount());
            totalPersonReadCount += (edmReachReport.getPersonReadCount() == null?0:edmReachReport.getPersonReadCount());
            totalClickLinkCount += (edmReachReport.getClickLinkCount() == null?0:edmReachReport.getClickLinkCount());
            totalAccountCloseCount += edmReachReport.getAccountCloseCount() == null ? 0 : edmReachReport.getAccountCloseCount();
            totalInsufficientBalanceCount += edmReachReport.getInsufficientBalanceCount() == null ? 0 : edmReachReport.getInsufficientBalanceCount();
        }
        EdmReachReportDto edmReachReportDto = new EdmReachReportDto(totalSuccCount, totalFailCount, totalInvalidAddressCount, totalServerRejectedCount, totalUnknownCount,
            totalReadCount, totalPersonReadCount, totalClickLinkCount, totalAccountCloseCount, totalInsufficientBalanceCount, emdReachReports);
        edmReachReportDto.setTotalSuccPercent(MathUtil.getPercent(totalSuccCount,total));
        edmReachReportDto.setTotalFailPercent(MathUtil.getPercent(totalFailCount,total));

        int unKnown = total - totalSuccCount;
        if (unKnown<0) {
            logger.warn("bug:edm总计数小于成功数加失败数,segment id:{}",segmentId);
            edmReachReportDto.setTotalUnknownCount(0);
            edmReachReportDto.setTotalUnknownPercent("0.00%");
        } else {
            edmReachReportDto.setTotalUnknownCount(unKnown);
            edmReachReportDto.setTotalUnknownPercent(MathUtil.getPercent(unKnown,total));
        }

        edmReachReportDto.setTotalInvalidAddressPercent(MathUtil.getPercent(totalInvalidAddressCount,total));
        edmReachReportDto.setTotalServerRejectedPercent(MathUtil.getPercent(totalServerRejectedCount,total));
        edmReachReportDto.setTotalAccountClosePercent(MathUtil.getPercent(totalAccountCloseCount, totalFailCount));
        edmReachReportDto.setTotalInsufficientBalancePercent(MathUtil.getPercent(totalInsufficientBalanceCount, totalFailCount));
        return edmReachReportDto;
    }

    public EdmReachReportDto findByPipelineId(Integer pipelineId, String pipelineNodeId, String granularity, String statisticsDate) throws Exception {
        Crowd crowd = pipelineCrowdRelService.getCrowdByPipelineInfo(pipelineId, pipelineNodeId);
        if (crowd == null) {
            throw new MktException("投放所属人群不存在");
        }
        int total = crowd.getEdmEstimatedSize() == null?0:crowd.getEdmEstimatedSize();
        String all = "all";
        List<EdmReachReport> edmReachReports;
        if (statisticsDate.equals(all)){
            edmReachReports = getDao().findByPipelineId(pipelineId, pipelineNodeId, granularity);
        } else {
            edmReachReports = getDao().findByPipelineIdAndDate(pipelineId, pipelineNodeId, granularity, statisticsDate);
        }
        int totalSuccCount = 0;
        int totalFailCount = 0;
        int totalInvalidAddressCount = 0;
        int totalServerRejectedCount = 0;
        int totalUnknownCount = 0;
        int totalReadCount = 0;
        int totalPersonReadCount = 0;
        int totalClickLinkCount = 0;
        int totalAccountCloseCount = 0;
        int totalInsufficientBalanceCount = 0;

        for (EdmReachReport edmReachReport : edmReachReports){
            totalSuccCount += (edmReachReport.getSuccCount() == null?0:edmReachReport.getSuccCount());
            totalFailCount += (edmReachReport.getFailCount() == null?0:edmReachReport.getFailCount());
            totalInvalidAddressCount += (edmReachReport.getInvalidAddressCount() == null?0:edmReachReport.getInvalidAddressCount());
            totalServerRejectedCount += (edmReachReport.getServerRejectedCount() == null?0:edmReachReport.getServerRejectedCount());
            totalUnknownCount += (edmReachReport.getUnknownCount() == null?0:edmReachReport.getUnknownCount());
            totalReadCount += (edmReachReport.getReadCount() == null?0:edmReachReport.getReadCount());
            totalPersonReadCount += (edmReachReport.getPersonReadCount() == null?0:edmReachReport.getPersonReadCount());
            totalClickLinkCount += (edmReachReport.getClickLinkCount() == null?0:edmReachReport.getClickLinkCount());
            totalAccountCloseCount += edmReachReport.getAccountCloseCount() == null ? 0 : edmReachReport.getAccountCloseCount();
            totalInsufficientBalanceCount += edmReachReport.getInsufficientBalanceCount() == null ? 0 : edmReachReport.getInsufficientBalanceCount();
        }
        EdmReachReportDto edmReachReportDto = new EdmReachReportDto(totalSuccCount, totalFailCount, totalInvalidAddressCount, totalServerRejectedCount, totalUnknownCount,
                totalReadCount, totalPersonReadCount, totalClickLinkCount, totalAccountCloseCount, totalInsufficientBalanceCount, edmReachReports);
        edmReachReportDto.setTotalSuccPercent(MathUtil.getPercent(totalSuccCount,total));
        edmReachReportDto.setTotalFailPercent(MathUtil.getPercent(totalFailCount,total));

        int unKnown = total - totalSuccCount - totalFailCount;
        if (unKnown<0) {
            logger.warn("bug:edm总计数小于成功数加失败数,pipeline id:{}, pipeline node id:{}",pipelineId,pipelineNodeId);
            edmReachReportDto.setTotalUnknownCount(0);
            edmReachReportDto.setTotalUnknownPercent("0.00%");
        } else {
            edmReachReportDto.setTotalUnknownCount(unKnown);
            edmReachReportDto.setTotalUnknownPercent(MathUtil.getPercent(unKnown,total));
        }

        edmReachReportDto.setTotalInvalidAddressPercent(MathUtil.getPercent(totalInvalidAddressCount,total));
        edmReachReportDto.setTotalServerRejectedPercent(MathUtil.getPercent(totalServerRejectedCount,total));
        edmReachReportDto.setTotalAccountClosePercent(MathUtil.getPercent(totalAccountCloseCount, totalFailCount));
        edmReachReportDto.setTotalInsufficientBalancePercent(MathUtil.getPercent(totalInsufficientBalanceCount, totalFailCount));
        return edmReachReportDto;
    }

    public InputStream buildEdmExcelRows(Integer segmentId, String statisticsDate, String granularity) throws Exception {
        List<EdmReachReport> edmReachReports = getDao().findBySegmentIdAndDate(segmentId, granularity, statisticsDate);
        List<List<String>> rows = buildRows(granularity, edmReachReports);
        return ExcelUtil.writeExcelContent(rows, segmentId+"");
    }

    private List<List<String>> buildRows(String granularity, List<EdmReachReport> edmReachReports) throws ParseException {
        List<List<String>> rows = new ArrayList();
        List<String> headerRow = new ArrayList();
        headerRow.add("时间");
        headerRow.add("发送成功次数");
        headerRow.add("打开邮件次数");
        headerRow.add("点击链接人数");
        rows.add(headerRow);
        for (EdmReachReport edmReachReport : edmReachReports) {
            List<String> row = new ArrayList();
            row.add(DateUtil.getFormatDateStr(edmReachReport.getReportDate(),edmReachReport.getReportHour(), granularity));
            row.add(edmReachReport.getSuccCount() == null ? "0" : String.valueOf(edmReachReport.getSuccCount()));
            row.add(edmReachReport.getReadCount() == null ? "0" : String.valueOf(edmReachReport.getReadCount()));
            row.add(edmReachReport.getClickLinkCount() == null ? "0" : String.valueOf(edmReachReport.getClickLinkCount()));
            rows.add(row);
        }
        return rows;
    }

    public void batchInsert(List<EdmReachReport> list) {
        getDao().batchInsert(list);
    }

    public void insertOrUpdate(EdmReachReport report) {
        getDao().insertOrUpdate(report);
    }

    public InputStream buildEdmExcelRows(Integer pipelineId, String pipelineNodeId, String granularity, String statisticsDate) throws Exception {
        List<EdmReachReport> edmReachReports;
        if (StringUtils.isEmpty(statisticsDate)){
            edmReachReports = getDao().findByPipelineId(pipelineId, pipelineNodeId, granularity);
        } else {
            edmReachReports = getDao().findByPipelineIdAndDate(pipelineId, pipelineNodeId, granularity, statisticsDate);
        }
        List<List<String>> rows = buildRows(granularity, edmReachReports);
        return ExcelUtil.writeExcelContent(rows, pipelineId + "_" + pipelineNodeId);
    }
}

package com.talkingdata.marketing.core.service.campaign;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
import com.talkingdata.marketing.core.dao.campaign.SmsReachReportDao;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.campaign.SmsReachReport;
import com.talkingdata.marketing.core.entity.dto.SmsReachReportDto;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.service.campaign.PipelineCrowdRelService;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.HDFSUtil;
import com.talkingdata.marketing.core.util.MathUtil;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_SMS_REACH_REPORT SmsReachReportService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-10-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("smsReachReportService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SmsReachReportService extends BaseService<SmsReachReport, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SmsReachReportService.class);

    @Autowired
    private SmsReachReportDao dao;

    @Autowired
    private SegmentService segmentService;

    @Autowired
    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;

    @Autowired
    private ConfigApi configApi;

    @Autowired
    private PipelineCrowdRelService pipelineCrowdRelService;

    @Override
    public SmsReachReportDao getDao() {
        return dao;
    }

    /**
     * 获取短信报告文件信息
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
        String hdfsReportPath = hdfsBasePath + File.separator + "sms" + File.separator + "%s";
        Set<String> hdfsReportPaths = new HashSet<>(16);
        hdfsReportPaths = segmentTaskCalcObjectRecords.stream().filter(e -> StringUtils.isNotBlank(e.getAttr1())).map(e -> String.format(hdfsReportPath, e.getAttr1())).collect(Collectors.toSet());
        String localTmpdir = new StringBuilder().append(System.getProperty("java.io.tmpdir")).append(File.separator).append(System.currentTimeMillis())
            .append(File.separator).append(System.currentTimeMillis()).append(segmentId).append(".zip").toString();
        HDFSUtil.copyNoticeReport2Local(hdfsReportPaths, localTmpdir, fileType, "GBK");
        return new File(localTmpdir);
    }

    /**
     * 通过pipelineId获取短信报告文件信息
     *
     * @param pipelineId  活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @param fileType 文件类型，成功或失败
     * @return
     * @throws Exception
     */
    public File getNoticeFileByPipelineId(Integer pipelineId, String pipelineNodeId, String fileType) throws Exception {
        List<SegmentTaskCalcObjectRecord> segmentTaskCalcObjectRecords = segmentTaskCalcObjectRecordService.listByPipelineId(pipelineId, pipelineNodeId);
        if (segmentTaskCalcObjectRecords.isEmpty()) { return null; }

        String hdfsBasePath = configApi.getParam(ParamConstants.MARKETING_HDFS_REPORT_PATH, ParamConstants.SYSTEM_CODE);
        String hdfsReportPath = hdfsBasePath + File.separator + "sms" + File.separator + "%s";
        Set<String> hdfsReportPaths = new HashSet<>(16);
        hdfsReportPaths = segmentTaskCalcObjectRecords.stream().filter(e -> StringUtils.isNotBlank(e.getAttr1())).map(e -> String.format(hdfsReportPath, e.getAttr1())).collect(Collectors.toSet());
        String localTmpdir = new StringBuilder().append(System.getProperty("java.io.tmpdir")).append(File.separator).append(System.currentTimeMillis())
                .append(File.separator).append(System.currentTimeMillis()).append(pipelineId).append(pipelineNodeId).append(".zip").toString();
        HDFSUtil.copyNoticeReport2Local(hdfsReportPaths, localTmpdir, fileType, "GBK");
        return new File(localTmpdir);
    }

    public List<String> findTimeaxisBySegmentId(Integer segmentId) {
        List<String> dateStrings = getDao().findTimeaxisBySegmentId(segmentId);
        return dateStrings;
    }

    public List<String> findTimeaxisByPipelineId(Integer pipelineId, String pipelineNodeId) {
        List<String> dateStrings = getDao().findTimeaxisByPipelineId(pipelineId, pipelineNodeId);
        return dateStrings;
    }

    /**
     * 获取投放概览和趋势分析
     *
     * @param segmentId SegmentID
     * @param statisticsDate 循环投放时用，此处暂时不用。
     * @param granularity 时间粒度。值为'd'表示天，值为'h'表示小时。
     * @return
     * @throws Exception
     */
    public SmsReachReportDto findSmsReachReportDtoByDate(Integer segmentId, String statisticsDate, String granularity) throws Exception {
        Crowd crowd = segmentService.getCrowdBySegmentId(segmentId);
        if (crowd == null) {
            throw new MktException("投放所属人群不存在");
        }
        int total = crowd.getSmsEstimatedSize() == null?0:crowd.getSmsEstimatedSize();
        List<SmsReachReport> smsReachReports;
        if (StringUtils.isNotBlank(statisticsDate)){
            smsReachReports = getDao().findBySegmentIdAndDate(segmentId, granularity, statisticsDate);
        } else {
            smsReachReports = getDao().findBySegmentId(segmentId, granularity);
        }
        int totalSuccCount = 0;
        int totalFailCount = 0;
        int totalUnknownCount = 0;
        int totalClickCount = 0;
        int totalIndependentClickCount = 0;
        int totalClickIpCount = 0;
        int totalClickLinkCount = 0;
        int totalInsufficientBalanceCount = 0;
        int totalInvalidPhoneNumberCount = 0;
        int totalUnsubscribeCount = 0;
        int totalOtherCount = 0;
        int totalBlacklistCount = 0;
        int totalUnconnectCount = 0;
        int totalOverrunFailCount = 0;

        for (SmsReachReport smsReachReport : smsReachReports){
            totalSuccCount+=(smsReachReport.getSuccCount() == null?0:smsReachReport.getSuccCount());
            totalFailCount+=(smsReachReport.getFailCount() == null?0:smsReachReport.getFailCount());
            totalUnknownCount+=(smsReachReport.getUnknownCount() == null?0:smsReachReport.getUnknownCount());
            totalClickCount+=(smsReachReport.getClickCount() == null?0:smsReachReport.getClickCount());
            totalIndependentClickCount+=(smsReachReport.getIndependentClickCount() == null?0:smsReachReport.getIndependentClickCount());
            totalClickIpCount+=(smsReachReport.getClickIpCount() == null?0:smsReachReport.getClickIpCount());
            totalClickLinkCount += smsReachReport.getClickLinkCount() == null ? 0 : smsReachReport.getClickLinkCount();
            totalInsufficientBalanceCount += smsReachReport.getInsufficientBalanceCount() == null ? 0 : smsReachReport.getInsufficientBalanceCount();
            totalInvalidPhoneNumberCount += smsReachReport.getInvalidPhoneNumberCount() == null ? 0 : smsReachReport.getInvalidPhoneNumberCount();
            totalUnsubscribeCount += smsReachReport.getUnsubscribeCount() == null ? 0 : smsReachReport.getUnsubscribeCount();
            totalOtherCount += smsReachReport.getOther() == null ? 0 : smsReachReport.getOther();
            totalBlacklistCount += smsReachReport.getBlacklistCount() == null ? 0 : smsReachReport.getBlacklistCount();
            totalUnconnectCount += smsReachReport.getUnconnectCount() == null ? 0 : smsReachReport.getUnconnectCount();
            totalOverrunFailCount += smsReachReport.getOverrunFailCount() == null ? 0 : smsReachReport.getOverrunFailCount();
        }
        SmsReachReportDto smsReachReportDto = new SmsReachReportDto(totalSuccCount, totalFailCount, totalUnknownCount, totalClickCount,
            totalIndependentClickCount, totalClickIpCount, totalClickLinkCount, totalInsufficientBalanceCount, totalInvalidPhoneNumberCount,
            totalUnsubscribeCount, totalOtherCount, totalBlacklistCount, totalUnconnectCount, totalOverrunFailCount, smsReachReports);

        int unKnown = total - totalSuccCount - totalFailCount;
        if (unKnown<0) {
            logger.warn("bug:sms[{}]总计数小于成功数[{}]加失败数[{}],segment id:{}",total, totalSuccCount, totalFailCount, segmentId);
            smsReachReportDto.setTotalUnknownCount(0);
            smsReachReportDto.setTotalUnknownPercent("0.00%");
        } else {
            smsReachReportDto.setTotalUnknownCount(unKnown);
            smsReachReportDto.setTotalUnknownPercent(MathUtil.getPercent(unKnown,total));
        }

        smsReachReportDto.setTotalSuccPercent(MathUtil.getPercent(totalSuccCount,total));
        smsReachReportDto.setTotalFailPercent(MathUtil.getPercent(totalFailCount,total));
        smsReachReportDto.setTotalInsufficientBalancePercent(MathUtil.getPercent(totalInsufficientBalanceCount, totalFailCount));
        smsReachReportDto.setTotalInvalidPhoneNumberPercent(MathUtil.getPercent(totalInvalidPhoneNumberCount, totalFailCount));
        smsReachReportDto.setTotalUnsubscribePercent(MathUtil.getPercent(totalUnsubscribeCount, totalFailCount));
        smsReachReportDto.setTotalOtherPercent(MathUtil.getPercent(totalOtherCount, totalFailCount));
        smsReachReportDto.setTotalBlacklistPercent(MathUtil.getPercent(totalBlacklistCount, totalFailCount));
        smsReachReportDto.setTotalUnconnectPercent(MathUtil.getPercent(totalUnconnectCount, totalFailCount));
        smsReachReportDto.setTotalOverrunFailPercent(MathUtil.getPercent(totalOverrunFailCount, totalFailCount));
        return smsReachReportDto;
    }

    /**
     * 通过活动流程id和活动流程节点id获取投放报告
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @param granularity 时间粒度
     * @param statisticsDate 循环投放时使用，此处暂时不用
     * @return SmsReachReportDto 返回投放报告
     * @throws Exception 抛出异常
     */
    public SmsReachReportDto findByPipelineId(Integer pipelineId, String pipelineNodeId, String granularity, String statisticsDate) throws Exception {

        List<SmsReachReport> smsReachReports;
        if (StringUtils.isEmpty(statisticsDate)){
            smsReachReports = getDao().findByPipelineId(pipelineId, pipelineNodeId, granularity);
        } else {
            smsReachReports = getDao().findByPipelineIdAndDate(pipelineId, pipelineNodeId, granularity, statisticsDate);
        }
        int totalSuccCount = 0;
        int totalFailCount = 0;
        int totalUnknownCount = 0;
        int totalClickCount = 0;
        int totalIndependentClickCount = 0;
        int totalClickIpCount = 0;
        int totalClickLinkCount = 0;
        int totalInsufficientBalanceCount = 0;
        int totalInvalidPhoneNumberCount = 0;
        int totalUnsubscribeCount = 0;
        int totalOtherCount = 0;
        int totalBlacklistCount = 0;
        int totalUnconnectCount = 0;
        int totalOverrunFailCount = 0;

        for (SmsReachReport smsReachReport : smsReachReports){
            totalSuccCount+=(smsReachReport.getSuccCount() == null?0:smsReachReport.getSuccCount());
            totalFailCount+=(smsReachReport.getFailCount() == null?0:smsReachReport.getFailCount());
            totalUnknownCount+=(smsReachReport.getUnknownCount() == null?0:smsReachReport.getUnknownCount());
            totalClickCount+=(smsReachReport.getClickCount() == null?0:smsReachReport.getClickCount());
            totalIndependentClickCount+=(smsReachReport.getIndependentClickCount() == null?0:smsReachReport.getIndependentClickCount());
            totalClickIpCount+=(smsReachReport.getClickIpCount() == null?0:smsReachReport.getClickIpCount());
            totalClickLinkCount += smsReachReport.getClickLinkCount() == null ? 0 : smsReachReport.getClickLinkCount();
            totalInsufficientBalanceCount += smsReachReport.getInsufficientBalanceCount() == null ? 0 : smsReachReport.getInsufficientBalanceCount();
            totalInvalidPhoneNumberCount += smsReachReport.getInvalidPhoneNumberCount() == null ? 0 : smsReachReport.getInvalidPhoneNumberCount();
            totalUnsubscribeCount += smsReachReport.getUnsubscribeCount() == null ? 0 : smsReachReport.getUnsubscribeCount();
            totalOtherCount += smsReachReport.getOther() == null ? 0 : smsReachReport.getOther();
            totalBlacklistCount += smsReachReport.getBlacklistCount() == null ? 0 : smsReachReport.getBlacklistCount();
            totalUnconnectCount += smsReachReport.getUnconnectCount() == null ? 0 : smsReachReport.getUnconnectCount();
            totalOverrunFailCount += smsReachReport.getOverrunFailCount() == null ? 0 : smsReachReport.getOverrunFailCount();
        }
        SmsReachReportDto smsReachReportDto = new SmsReachReportDto(totalSuccCount, totalFailCount, totalUnknownCount, totalClickCount,
                totalIndependentClickCount, totalClickIpCount, totalClickLinkCount, totalInsufficientBalanceCount, totalInvalidPhoneNumberCount,
                totalUnsubscribeCount, totalOtherCount, totalBlacklistCount, totalUnconnectCount, totalOverrunFailCount, smsReachReports);

        if (totalUnknownCount<0) {
            totalUnknownCount = 0;
        }
        //临时方案，因为Pipeline投放没存储期望投放数据的地方
        int total = totalSuccCount + totalFailCount + totalUnknownCount;

        smsReachReportDto.setTotalUnknownCount(totalUnknownCount);
        smsReachReportDto.setTotalUnknownPercent(MathUtil.getPercent(totalUnknownCount,total));
        smsReachReportDto.setTotalSuccPercent(MathUtil.getPercent(totalSuccCount,total));
        smsReachReportDto.setTotalFailPercent(MathUtil.getPercent(totalFailCount,total));
        smsReachReportDto.setTotalInsufficientBalancePercent(MathUtil.getPercent(totalInsufficientBalanceCount, totalFailCount));
        smsReachReportDto.setTotalInvalidPhoneNumberPercent(MathUtil.getPercent(totalInvalidPhoneNumberCount, totalFailCount));
        smsReachReportDto.setTotalUnsubscribePercent(MathUtil.getPercent(totalUnsubscribeCount, totalFailCount));
        smsReachReportDto.setTotalOtherPercent(MathUtil.getPercent(totalOtherCount, totalFailCount));
        smsReachReportDto.setTotalBlacklistPercent(MathUtil.getPercent(totalBlacklistCount, totalFailCount));
        smsReachReportDto.setTotalUnconnectPercent(MathUtil.getPercent(totalUnconnectCount, totalFailCount));
        smsReachReportDto.setTotalOverrunFailPercent(MathUtil.getPercent(totalOverrunFailCount, totalFailCount));
        return smsReachReportDto;
    }

    public InputStream buildSmsExcelRows(Integer pipelineId, String pipelineNodeId, String granularity, String statisticsDate) throws Exception {
        List<SmsReachReport> smsReachReports;
        if (StringUtils.isEmpty(statisticsDate)){
            smsReachReports = getDao().findByPipelineId(pipelineId, pipelineNodeId, granularity);
        } else {
            smsReachReports = getDao().findByPipelineIdAndDate(pipelineId, pipelineNodeId, granularity, statisticsDate);
        }
        List<List<String>> rows = new ArrayList();
        List<String> headerRow = new ArrayList();
        headerRow.add("时间");
        headerRow.add("发送成功数");
        headerRow.add("点击链接数");
        rows.add(headerRow);
        for (SmsReachReport smsReachReport : smsReachReports) {
            List<String> row = new ArrayList();
            row.add(DateUtil.getFormatDateStr(smsReachReport.getReportDate(), smsReachReport.getReportHour(), granularity));
            row.add(smsReachReport.getSuccCount() == null ? "0" : String.valueOf(smsReachReport.getSuccCount()));
            row.add(smsReachReport.getClickLinkCount() == null ? "0" : String.valueOf(smsReachReport.getClickLinkCount()));
            rows.add(row);
        }
        return ExcelUtil.writeExcelContent(rows, pipelineId + "_" + pipelineNodeId);
    }

    public InputStream buildSmsExcelRowsBySegmentId(Integer segmentId, String granularity, String statisticsDate) throws Exception {
        List<SmsReachReport> smsReachReports;
        if (StringUtils.isEmpty(statisticsDate)){
            smsReachReports = getDao().findBySegmentId(segmentId, granularity);
        } else {
            smsReachReports = getDao().findBySegmentIdAndDate(segmentId, granularity, statisticsDate);
        }
        List<List<String>> rows = new ArrayList();
        List<String> headerRow = new ArrayList();
        headerRow.add("时间");
        headerRow.add("发送成功数");
        headerRow.add("点击链接数");
        rows.add(headerRow);
        for (SmsReachReport smsReachReport : smsReachReports) {
            List<String> row = new ArrayList();
            row.add(DateUtil.getFormatDateStr(smsReachReport.getReportDate(), smsReachReport.getReportHour(), granularity));
            row.add(smsReachReport.getSuccCount() == null ? "0" : String.valueOf(smsReachReport.getSuccCount()));
            row.add(smsReachReport.getClickLinkCount() == null ? "0" : String.valueOf(smsReachReport.getClickLinkCount()));
            rows.add(row);
        }
        return ExcelUtil.writeExcelContent(rows, segmentId.toString());
    }

    public void batchInsert(List<SmsReachReport> list) {
        getDao().batchInsert(list);
    }

    public void insertOrUpdate(SmsReachReport report) {
        getDao().insertOrUpdate(report);
    }
}

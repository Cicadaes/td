package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.entity.campaign.EdmReachReport;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.campaign.SmsReachReport;
import com.talkingdata.marketing.core.entity.thirdmodel.edm.EdmReportEnum;
import com.talkingdata.marketing.core.entity.thirdmodel.sms.SmsReportEnum;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.middleware.HDFS;
import com.talkingdata.marketing.core.service.admin.ChannelDefinitionService;
import com.talkingdata.marketing.core.service.campaign.EdmReachReportService;
import com.talkingdata.marketing.core.service.campaign.SegmentTaskCalcObjectRecordService;
import com.talkingdata.marketing.core.service.campaign.SmsReachReportService;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.Path;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 统计任务
 * @author armeng
 */
public class Push1ClockStatTask implements Job,StatefulJob{
    private Logger logger = LoggerFactory.getLogger(getClass());

    private ConfigApi configApi;
    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;
    private SmsReachReportService smsReachReportService;
    private EdmReachReportService edmReachReportService;
    private ChannelDefinitionService channelDefinitionService;

    private static final String REACH_FILE_NAME = "data.csv";

    private static ThreadLocal<DateFormat> threadLocal = new ThreadLocal<DateFormat>() {
        @Override
        protected DateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
    };

    private String reportHdfsPrefix = null;

    /**
     * 统计recordStatDays天内创建的calc record
     */
    int recordStatDays = 3;
    /**
     * The Stat delay minutes.
     */
    int statDelayMinutes = 10;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        initDependence();
        syncPushReport();
    }

    private void initDependence() {
        configApi= SpringContextUtil.getBean(ConfigApi.class);
        segmentTaskCalcObjectRecordService =SpringContextUtil.getBean(SegmentTaskCalcObjectRecordService.class);
        smsReachReportService = SpringContextUtil.getBean(SmsReachReportService.class);
        edmReachReportService = SpringContextUtil.getBean(EdmReachReportService.class);
        channelDefinitionService = SpringContextUtil.getBean(ChannelDefinitionService.class);
    }

    /**
     * Sync push report.
     */
    public void syncPushReport() {
        if (!loadConfigs()) {
            return;
        }
        logger.info("stat push start");
        Map<Integer, ChannelDefinition> channelDefinitionMap = channelDefinitionService.loadChannelDefinition();
        Date statDate = DateUtil.getHoursBefore(new Date(), recordStatDays * 24);
        List<SegmentTaskCalcObjectRecord> records = segmentTaskCalcObjectRecordService.queryByCreateTime(statDate);
        for (SegmentTaskCalcObjectRecord record : records) {
            if (record.getChannelDefinitionId() == null) {
                logger.error("bad channel definition id,record id:{}", record.getId());
                continue;
            }
            ChannelDefinition channelDefinition = channelDefinitionMap.get(record.getChannelDefinitionId());
            if (channelDefinition == null) {
                logger.error("channelDefinition not found,record id:{}",record.getId());
                continue;
            }

            if (channelDefinition.getChannelType() == null) {
                logger.error("bad channel type,record id:{}",record.getId());
                continue;
            }

            String pushId = record.getAttr1();
            if (pushId == null) {
                logger.error("push id is null, record id:{}", record.getId());
                continue;
            }

            Date lastStatTime = record.getLastStatTime();
            if (lastStatTime == null) {
                logger.error("push last stat time is null, record id:{}", record.getId());
                continue;
            }

            String date = getStatDate(lastStatTime);
            String reportFileFullPath = buildPath(channelDefinition, pushId, date, REACH_FILE_NAME);
            logger.info("report file full path:{}",reportFileFullPath);
            boolean isToday = DateUtil.isToday(lastStatTime);
            try {
                boolean reportFileExists = exists(reportFileFullPath);
                Path filePath = new Path(reportFileFullPath);
                if (!isToday) {
                    if (!reportFileExists) {
                        logger.info("report file is not exist,file,calc id:{},full path:{}",record.getId() ,reportFileFullPath);
                        //设置lastStatTime为当天凌晨
                        record.setLastStatTime(DateUtil.getStartTimeInDay(new Date()));
                        segmentTaskCalcObjectRecordService.updateByPrimaryKeySelective(record);
                        continue;
                    }
                    Date fileModifyTime = getFileModifyTime(filePath);
                    if (fileModifyTime != null && lastStatTime.before(fileModifyTime)) {
                        //从lastStatTime读完文件
                        batchSyncReport(filePath, channelDefinition, record, lastStatTime, null);
                    }
                    record.setLastStatTime(DateUtil.getStartTimeInDay(new Date()));
                    segmentTaskCalcObjectRecordService.updateByPrimaryKeySelective(record);
                    continue;
                }
                //如果lastStatTime是当天
                if (!reportFileExists) {
                    logger.info("report file is not exist,file,calc id:{},full path:{}",record.getId() ,reportFileFullPath);
                    continue;
                }
                Date fileModifyTime = getFileModifyTime(filePath);
                if (fileModifyTime == null) {
                    logger.info("report file fileModifyTime is not exist,file,calc id:{},full path:{}",record.getId() ,reportFileFullPath);
                    continue;
                }
                if (lastStatTime.after(fileModifyTime)) {
                    //文件一直没有更新
                    continue;
                }
                Date d = getDateBeforeMinutes(fileModifyTime, statDelayMinutes);
                if (lastStatTime.before(d)) {
                    //从lastStatTime开始读取到“文件修改时间N分钟前”结束
                    batchSyncReport(filePath, channelDefinition, record, lastStatTime, d);
                    record.setLastStatTime(d);
                    segmentTaskCalcObjectRecordService.updateByPrimaryKeySelective(record);
                    continue;
                }
                Date d1 = getDateBeforeMinutes(new Date(), statDelayMinutes);
                if (d1.before(fileModifyTime)) {
                    //文件更新时间在N分钟以内则跳过
                    continue;
                }
                //从lastStatTime读取文件到fileModifyTime
                batchSyncReport(filePath, channelDefinition, record, lastStatTime, fileModifyTime);
                record.setLastStatTime(fileModifyTime);
                segmentTaskCalcObjectRecordService.updateByPrimaryKeySelective(record);
            } catch (Exception e) {
                logger.error("save reach report err, record id:{},err:{}",record.getId(), e);
            }
        }
        logger.info("stat push done");
    }

    private Date getFileModifyTime(Path path) throws IOException{
        FileStatus fileStatus = HDFS.getFileStatus(path);
        if (fileStatus == null) {
            return null;
        }
        return new Date(fileStatus.getModificationTime());
    }

    private Date getDateBeforeMinutes(Date date, int minutes) {
        return new Date(date.getTime() - (long)minutes * 60 * 1000);
    }

    private void batchSyncReport(Path filePath, ChannelDefinition channelDefinition,
                                 SegmentTaskCalcObjectRecord record,
                                 Date beginTime,Date endTime) {
        try( InputStream hdfsInputStream = HDFS.open(filePath);
             Reader hdfsReader = new InputStreamReader(hdfsInputStream)) {
            CSVParser parser = new CSVParser(hdfsReader, CSVFormat.EXCEL.withSkipHeaderRecord());
            if (channelDefinition.getChannelType() == ChannelConstants.SMS) {
                syncSmsReport(record, parser, beginTime, endTime);
            } else if (channelDefinition.getChannelType() == ChannelConstants.EDM) {
                syncEdmReport(record, parser, beginTime, endTime);
            }
        } catch (Exception e) {
            logger.error("save reach report err, record id:{},err:{}",record.getId(), e);
        }
    }

    private String buildPath(ChannelDefinition channelDefinition, String pushId, String date, String fileName) {
        if (channelDefinition.getChannelType() == ChannelConstants.SMS) {
            return String.format("%s/sms/%s/%s/%s", reportHdfsPrefix, pushId, date, fileName);
        } else if (channelDefinition.getChannelType() == ChannelConstants.EDM) {
            return String.format("%s/edm/%s/%s/%s", reportHdfsPrefix, pushId, date, fileName);
        }
        return "";
    }

    private void closeReader(Reader reader, SegmentTaskCalcObjectRecord record) {
        if (reader == null) {
            return;
        }
        try {
            reader.close();
        } catch (IOException e) {
            logger.error("close reader err, record id:{}, err:{}", record.getId(), e);
        }
    }

    private void closeInputStream(InputStream is, SegmentTaskCalcObjectRecord record) {
        if (is == null) {
            return;
        }
        try {
            is.close();
        } catch (IOException e) {
            logger.error("close input stream err, record id:{}, err:{}", record.getId(), e);
        }
    }

    private String getStatDate(Date date) {
        //yyyyMMdd
        return DateUtil.date2String("yyyyMMdd", date);
    }

    private boolean exists(String fullPath) throws Exception{
        Path path = new Path(fullPath);
        return HDFS.exists(path);
    }

    private void syncSmsReport(SegmentTaskCalcObjectRecord calcObjectRecord, CSVParser parser,
                               Date beginTime, Date endTime) {
        Map<String, SmsReachReport> smsReportMap = new HashMap(16);
        for (CSVRecord csvRecord : parser) {
            try {
                Date recordTime = threadLocal.get().parse(csvRecord.get(SmsReportEnum.CREATE_TIME.getCode()));
                if (recordTime == null) {
                    continue;
                }
                if (beginTime != null && recordTime.before(beginTime)) {
                    continue;
                }
                if (endTime != null && recordTime.after(endTime)) {
                    break;
                }
                String reportTime = csvRecord.get(SmsReportEnum.TIME.getCode());
                SmsReachReport report = smsReportMap.get(reportTime);
                report = buildSmsReachReport(report, calcObjectRecord, csvRecord);
                smsReportMap.put(reportTime, report);
            } catch (Exception e) {
                logger.warn("本条sms格式错误，跳过,calc id:{}, err:{}", calcObjectRecord.getId(), e);
                continue;
            }
        }
        List<SmsReachReport> list = new ArrayList(smsReportMap.values());
        if (list.size() > 0) {
            smsReachReportService.batchInsert(list);
        }
    }

    private SmsReachReport buildSmsReachReport(SmsReachReport report, SegmentTaskCalcObjectRecord calcObjectRecord, CSVRecord csvRecord) {
        if (report == null) {
            report = new SmsReachReport();
        }
        report.setCampaignId(calcObjectRecord.getCampaignId());
        report.setSegmentId(calcObjectRecord.getSegmentId());
        report.setCreateTime(new Date());
        report.setCreateBy(calcObjectRecord.getCreateBy());
        report.setCreator(calcObjectRecord.getCreator());
        report.setReportDate(parseDate(csvRecord.get(SmsReportEnum.TIME.getCode())));
        report.setReportHour(parseHour(csvRecord.get(SmsReportEnum.TIME.getCode())));

        Integer successCount = Integer.parseInt(csvRecord.get(SmsReportEnum.SUC_NUMBER.getCode()));
        if (report.getSuccCount() == null) {
            report.setSuccCount(successCount);
        } else if (successCount != null) {
            report.setSuccCount(successCount+report.getSuccCount());
        }
        Integer failCount = Integer.parseInt(csvRecord.get(SmsReportEnum.ERR_NUMBER.getCode()));
        if (report.getFailCount() == null) {
            report.setFailCount(failCount);
        } else if (failCount != null) {
            report.setFailCount(failCount+report.getFailCount());
        }
        return report;
    }

    private void syncEdmReport(SegmentTaskCalcObjectRecord calcObjectRecord, CSVParser parser,
                               Date beginTime, Date endTime) throws Exception {
        Map<String, EdmReachReport> edmReportMap = new HashMap(16);
        for (CSVRecord csvRecord : parser) {
            try {
                Date recordTime = threadLocal.get().parse(csvRecord.get(SmsReportEnum.CREATE_TIME.getCode()));
                if (recordTime == null) {
                    continue;
                }
                if (beginTime != null && recordTime.before(beginTime)) {
                    continue;
                }
                if (endTime != null && recordTime.after(endTime)) {
                    break;
                }
                String reportTime = csvRecord.get(EdmReportEnum.REPORT_TIME.getCode());
                EdmReachReport report = edmReportMap.get(reportTime);
                report = buildEdmReachReport(report, calcObjectRecord, csvRecord);
                edmReportMap.put(reportTime, report);
            } catch (Exception e) {
                logger.warn("本条edm格式错误，跳过,calc id:{}, err:{}", calcObjectRecord.getId(), e);
                continue;
            }
        }
        List<EdmReachReport> list = new ArrayList(edmReportMap.values());
        if (list.size() > 0) {
            edmReachReportService.batchInsert(list);
        }
    }

    private EdmReachReport buildEdmReachReport(EdmReachReport report, SegmentTaskCalcObjectRecord calcObjectRecord, CSVRecord csvRecord) throws Exception{
        if (report == null) {
            report = new EdmReachReport();
        }
        report.setCampaignId(calcObjectRecord.getCampaignId());
        report.setSegmentId(calcObjectRecord.getSegmentId());
        report.setReportDate(parseDate(csvRecord.get(EdmReportEnum.REPORT_TIME.getCode())));
        report.setReportHour(parseHour(csvRecord.get(EdmReportEnum.REPORT_TIME.getCode())));
        report.setCreateTime(new Date());
        report.setCreateBy(calcObjectRecord.getCreateBy());
        report.setCreator(calcObjectRecord.getCreator());

        Integer sent = Integer.parseInt(csvRecord.get(EdmReportEnum.SENT_INCREMENT.getCode()));
        if (report.getSuccCount() == null) {
            report.setSuccCount(sent);
        } else if (sent != null) {
            report.setSuccCount(sent+report.getSuccCount());
        }
        Integer failNum = Integer.parseInt(csvRecord.get(EdmReportEnum.TOTAL_REJECT_INCREMENT.getCode()));
        if (report.getFailCount() == null) {
            report.setFailCount(failNum);
        } else if (failNum != null) {
            report.setFailCount(failNum+report.getFailCount());
        }

        Integer invalidNum = Integer.parseInt(csvRecord.get(EdmReportEnum.INVALID_INCREMENT.getCode()));
        if (report.getInvalidAddressCount() == null) {
            report.setInvalidAddressCount(invalidNum);
        } else if (invalidNum != null) {
            report.setInvalidAddressCount(invalidNum+report.getInvalidAddressCount());
        }

        Integer rejectNum = Integer.parseInt(csvRecord.get(EdmReportEnum.REJECT_INCREMENT.getCode()));
        if (report.getServerRejectedCount() == null) {
            report.setServerRejectedCount(rejectNum);
        } else if (rejectNum != null) {
            report.setServerRejectedCount(rejectNum+report.getServerRejectedCount());
        }

        Integer openNum = Integer.parseInt(csvRecord.get(EdmReportEnum.OPEN_INCREMENT.getCode()));
        if (report.getPersonReadCount() == null) {
            report.setPersonReadCount(openNum);
        } else if (openNum != null) {
            report.setPersonReadCount(openNum+report.getPersonReadCount());
        }

        Integer clickNum = Integer.parseInt(csvRecord.get(EdmReportEnum.CLICK_INCREMENT.getCode()));
        if (report.getClickLinkCount() == null) {
            report.setClickLinkCount(clickNum);
        } else if (clickNum != null) {
            report.setClickLinkCount(openNum+report.getClickLinkCount());
        }
        return report;
    }

    private String parseDate(String date) {
        //2017102515 to 20171025
        return date.substring(0, 8);
    }

    private Integer parseHour(String date) {
        //2017102515 to 15
        String hour = date.substring(8, date.length());
        return Integer.parseInt(hour);
    }

    private boolean loadConfigs() {
        reportHdfsPrefix = configApi.getParam(ParamConstants.MARKETING_HDFS_REPORT_PATH, ParamConstants.SYSTEM_CODE);
        if (reportHdfsPrefix == null || "".equals(reportHdfsPrefix)) {
            logger.error("{} 参数没有配置，请在config系统中配置", ParamConstants.MARKETING_HDFS_REPORT_PATH);
            return false;
        }
        String days = configApi.getParam(ParamConstants.MARKETING_RECORD_STAT_DAYS, ParamConstants.SYSTEM_CODE);
        if (days == null || "".equals(days)) {
            logger.info("{} 参数没有配置，默认配置为:{}", ParamConstants.MARKETING_RECORD_STAT_DAYS, recordStatDays);
        } else {
            try {
                recordStatDays = Integer.parseInt(days);
            } catch (Exception e) {
                logger.warn("{} 参数配置类型不正确，请重新配置", ParamConstants.MARKETING_RECORD_STAT_DAYS);
                return false;
            }
        }

        String delay = configApi.getParam(ParamConstants.MARKETING_RECORD_STAT_DELAY_MINUTES, ParamConstants.SYSTEM_CODE);
        if (delay == null || "".equals(delay)) {
            logger.info("{} 参数没有配置，默认配置为:{}", ParamConstants.MARKETING_RECORD_STAT_DELAY_MINUTES, statDelayMinutes);
        } else {
            try {
                statDelayMinutes = Integer.parseInt(delay);
            } catch (Exception e) {
                logger.warn("{} 参数配置类型不正确，请重新配置", ParamConstants.MARKETING_RECORD_STAT_DELAY_MINUTES);
                return false;
            }
        }
        return true;
    }


}

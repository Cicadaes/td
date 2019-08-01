package com.talkingdata.marketing.batch.etl;

import com.talkingdata.marketing.batch.config.ApplicationContextManager;
import com.talkingdata.marketing.batch.etl.pipelinenotice.PipelinePushNoticeJob;
import com.talkingdata.marketing.batch.etl.pipelinenotice.PipelineShortMessageNoticeJob;
import org.apache.commons.cli.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.talkingdata.marketing.core.constant.BatchNoticeConstants.BatchNoticeEtlJobTypeConstants.*;

/**
 * ETL任务执行
 *
 * @author hongsheng
 * @create 2017-11-17-下午2:21
 * @since JDK 1.8
 */
public class ExecuteEtlJob {

    private static final Logger logger = LoggerFactory.getLogger(ExecuteEtlJob.class);

    private static final String ETL_JOB_TYPE = "type";
    private static final String ETL_JOB_PATH_OUTPUT = "outputPath";
    private static final String ETL_JOB_CROWD_IDTYPE = "idTypeCode";

    public static void main(String[] args) throws Exception {
        logger.info("[ETL任务]----开始执行");
        Options options = new Options();
        options.addOption("t", ETL_JOB_TYPE, true, "通知类型");
        options.addOption("output", ETL_JOB_PATH_OUTPUT, false, "HDFS输出文件夹路径");
        options.addOption("idtype", ETL_JOB_CROWD_IDTYPE, false, "人群ID类型");

        CommandLineParser parser = new PosixParser();
        CommandLine commandLine = parser.parse(options, args);
        if (!commandLine.hasOption(ETL_JOB_TYPE)) {
            logger.error("[ETL任务]----终止，未指定执行类型Type");
            return;
        }
        String type = commandLine.getOptionValue(ETL_JOB_TYPE);
        try {
            switch (type) {
                case TYPE_CROWD:
                    String output = commandLine.getOptionValue("outputPath");
                    String idTypeCode = commandLine.getOptionValue("idTypeCode");
                    break;
                case TYPE_NOTICE_PUSH:
                    ApplicationContextManager.getInstance().getBean("pipelinePushNoticeJob", PipelinePushNoticeJob.class).executeNotice();
                    break;
                case TYPE_NOTICE_SMS:
                    ApplicationContextManager.getInstance().getBean("pipelineShortMessageNoticeJob", PipelineShortMessageNoticeJob.class).executeNotice();
                    break;
                default:
                    logger.error("[ETL任务]----终止，执行类型[{}]不存在", type);
                    break;
            }
        } catch (Exception e) {
            logger.error("[ETL任务]----异常执行，异常信息{}", e);
        } finally {
            ApplicationContextManager.getInstance().getApplicationContext().destroy();
        }
        logger.info("[ETL任务]----结束执行");
    }
}

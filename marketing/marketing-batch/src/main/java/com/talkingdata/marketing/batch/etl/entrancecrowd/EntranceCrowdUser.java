package com.talkingdata.marketing.batch.etl.entrancecrowd;

import com.talkingdata.marketing.batch.config.ApplicationContextManager;
import com.talkingdata.marketing.batch.dao.PipelineCrowdDao;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import org.apache.commons.cli.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;

/**
 * 通过人群id生成去重的offset存至HDFS
 *
 * @author Created by ran.li on 2017/11/15.
 */
public class EntranceCrowdUser {

    private static final Logger logger = LoggerFactory.getLogger(EntranceCrowdUser.class);

    public static void main(String[] args) throws ParseException, UnsupportedEncodingException {
        logger.info("[生成需计算人群userId]----开始执行");
        Options options = new Options();
        options.addOption("p", "pipelineId", false, "pipelineID");
        options.addOption("c", "crowdId", false, "人群ID");
        options.addOption("r", "crowdRefId", false, "用户管家人群ID");
        options.addOption("i", "idTypeCode", false, "人群ID类型");
        options.addOption("o", "hdfsOffsetPath", false, "HDFS人群offset输出路径");
        options.addOption("t", "hdfsTablePath", false, "HDFS表信息输出路径");
        CommandLineParser parser = new PosixParser();
        CommandLine commandLine = parser.parse(options, args);
        String pipelineId = commandLine.getOptionValue("pipelineId");
        String crowdId = commandLine.getOptionValue("crowdId");
        String crowdRefId = commandLine.getOptionValue("crowdRefId");
        String idTypeCode = commandLine.getOptionValue("idTypeCode");
        String hdfsFilePath = commandLine.getOptionValue("hdfsOffsetPath");
        String hdfsTablePath = commandLine.getOptionValue("hdfsTablePath");

        execute(pipelineId, crowdId, crowdRefId, idTypeCode, hdfsFilePath, hdfsTablePath);

        logger.info("[生成需计算人群userId]----结束执行");
    }

    private static void execute(String pipelineId, String crowdId, String crowdRefId, String idTypeCode, String hdfsOffsetPath, String hdfsTablePath)
            throws UnsupportedEncodingException {
        //更新执行状态
        PipelineCrowdDao pipelineCrowdDao = ApplicationContextManager.getInstance().getBean("pipelineCrowdDao", PipelineCrowdDao.class);
        pipelineCrowdDao.updatePipelineCrowdRelByCrowdId(pipelineId, crowdRefId, PipelineCrowdDao.PROCESSING_CALC_STATUS);

        //调取dmp接口生成offset文件
        CrowdApi crowdApi = ApplicationContextManager.getInstance().getBean("crowdApi", CrowdApi.class);
        String filePath = crowdApi.writeOffsetToHdfs(pipelineId, crowdId, crowdRefId, idTypeCode, hdfsOffsetPath, hdfsTablePath);
        logger.info("write crowd offset to HDFS success, filePath = " + filePath);

    }


}

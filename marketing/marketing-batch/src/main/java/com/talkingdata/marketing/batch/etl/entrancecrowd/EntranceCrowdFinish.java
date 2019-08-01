package com.talkingdata.marketing.batch.etl.entrancecrowd;

import com.talkingdata.marketing.batch.config.ApplicationContextManager;
import com.talkingdata.marketing.batch.dao.PipelineCrowdDao;
import org.apache.commons.cli.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 标记计算人群状态
 *
 * @author Created by ran.li on 2017/11/15.
 */
public class EntranceCrowdFinish {

    private static final Logger logger = LoggerFactory.getLogger(EntranceCrowdFinish.class);

    public static void main(String[] args) throws ParseException {
        logger.info("[标记计算人群状态]----开始执行");
        Options options = new Options();
        options.addOption("p", "pipelineId", false, "pipelineID");
        options.addOption("c", "crowdRefId", false, "用户管家人群ID");
        options.addOption("t", "calcType", false, "计算类型");
        CommandLineParser parser = new PosixParser();
        CommandLine commandLine = parser.parse(options, args);
        String pipelineId = commandLine.getOptionValue("pipelineId");
        String crowdRefId = commandLine.getOptionValue("crowdRefId");
        String calcType = commandLine.getOptionValue("calcType");

        execute(pipelineId, crowdRefId, calcType);

        logger.info("[标记计算人群状态]----结束执行");
    }

    private static void execute(String pipelineId, String crowdRefId, String calcType) {
        PipelineCrowdDao pipelineCrowdDao = ApplicationContextManager.getInstance().getBean("pipelineCrowdDao", PipelineCrowdDao.class);

        //更新执行状态
        if(calcType.equals(PipelineCrowdDao.CALC_TYPE_PERIOD)) {
            pipelineCrowdDao.updatePipelineCrowdRelByCrowdId(pipelineId, crowdRefId, PipelineCrowdDao.WAIT_CALC_STATUS);
        }else if(calcType.equals(PipelineCrowdDao.CALC_TYPE_NEVER)){
            pipelineCrowdDao.updatePipelineCrowdRelByCrowdId(pipelineId, crowdRefId, PipelineCrowdDao.COMPLETE_CALC_STATUS);
        }
    }

}

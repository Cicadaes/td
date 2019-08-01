package com.talkingdata.marketing.batch.etl.entrancecrowd;

import com.talkingdata.marketing.batch.bean.CrowdDTO;
import com.talkingdata.marketing.batch.config.ApplicationContextManager;
import com.talkingdata.marketing.batch.dao.PipelineCrowdDao;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcOutputOperator;
import org.apache.commons.cli.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.Date;
import java.util.List;

/**
 * 生成需要计算的人群id
 *
 * @author Created by ran.li on 2017/11/15.
 */
public class EntranceCrowdGenerate {

    private static final Logger logger = LoggerFactory.getLogger(EntranceCrowdGenerate.class);

    private static final String ID_TYPE_CODE = "tdid";

    public static void main(String[] args) {
        logger.info("[生成需计算人群]----开始执行");
        try {
            Options options = new Options();
            options.addOption("o", "outputFile", false, "人群id输出文件路径");
            CommandLineParser parser = new PosixParser();
            CommandLine commandLine = parser.parse(options, args);
            String outputFile = commandLine.getOptionValue("outputFile");

            execute(outputFile);
        } catch (Exception e) {
            logger.error("[生成需计算人群]----异常执行，异常信息", e);
        } finally {
            ApplicationContextManager.getInstance().getApplicationContext().destroy();
        }
        logger.info("[生成需计算人群]----结束执行");
    }

    private static Boolean execute(String outputFile) {
        PipelineCrowdDao pipelineCrowdDao = ApplicationContextManager.getInstance().getBean("pipelineCrowdDao", PipelineCrowdDao.class);

        FileWriter fileWriter = null;
        BufferedWriter bw = null;
        try {
            File pathFile = new File(outputFile);
            if (pathFile.exists()) {
                pathFile.delete();
            }

            //获取需要执行pipeline的人群
            fileWriter = new FileWriter(outputFile);
            bw = new BufferedWriter(fileWriter);
            List <CrowdDTO> crowds = pipelineCrowdDao.queryTodoPipelineCrowds();
            for (CrowdDTO crowd : crowds) {
                Date lastUpdateTime = crowd.getCalcTime();
                Integer calcPeriod = crowd.getCalcPeriod();
                if (lastUpdateTime != null && calcPeriod != null) {
                    long now = System.currentTimeMillis();
                    long diff = now - (lastUpdateTime.getTime() + calcPeriod * 24 * 60 * 60 * 1000);
                    if (diff <= 0) {
                        bw.append(crowd.getPipelineId() + "").append(CrowdCalcOutputOperator.SEPARATER);
                        bw.append(crowd.getCrowdId() + "").append(CrowdCalcOutputOperator.SEPARATER);
                        bw.append(crowd.getRefId() + "").append(CrowdCalcOutputOperator.SEPARATER);
                        bw.append(ID_TYPE_CODE).append(CrowdCalcOutputOperator.SEPARATER);
                        bw.append(crowd.getCalcType() + "").append(CrowdCalcOutputOperator.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                    }
                }
            }
            bw.flush();
        } catch (Exception e) {
            logger.error("写到文件失败：", e);
            e.printStackTrace();
        } finally {
            try {
                if (null != bw) {
                    bw.close();
                }
                if (null != fileWriter) {
                    fileWriter.close();
                }
            } catch (Exception e) {
            }
        }
        return true;
    }


}

package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.pipeline.executor.PipelineExecutor;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.io.FileUtils;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

/**
 * Entrance Node Operator Test
 * @author hongsheng
 * @create 2017-10-21-下午2:23
 * @since JDK 1.8
 */
public class EntranceNodeOperatorTest {
    /**
     * 验证入口算子
     *  1.单独次数验证：执行pipelineExecutor.executor(eventPackage)，次数比限制次数多1次
     *  2.单独时间验证：将算子中时间限制值设置0，可以无限执行pipelineExecutor.executor(eventPackage)均有结果 或者 设为大于0，则是第一次有结果，其他skip
     *  3.混合验证：1与2配置设置即可
     * @throws IOException
     */
    @Test
    public void executorTest() throws IOException {
        PipelineExecutor pipelineExecutor = new PipelineExecutor();
        pipelineExecutor.executor(getEventPackage());
        pipelineExecutor.executor(getEventPackage());
        pipelineExecutor.executor(getEventPackage());
        pipelineExecutor.executor(getEventPackage());
        pipelineExecutor.executor(getEventPackage());
        pipelineExecutor.executor(getEventPackage());
        pipelineExecutor.executor(getEventPackage());
    }

    private EventPackage getEventPackage() throws IOException {
        String data = FileUtils.readFileToString(new File(PipelineExecutorTest.class.getResource("/pipelineexecutor/EventPackage.txt").getPath()), "UTF-8");
        return JsonUtil.toObject(data, EventPackage.class);
    }
}

package com.talkingdata.marketing.streaming.pipeline.executor;

import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.File;
import java.io.IOException;

/**
 * Pipeline Executor Test
 * @author hongsheng
 * @create 2017-10-20-下午4:47
 * @since JDK 1.8
 */
public class PipelineExecutorTest {

    private ApplicationContext context;

    @Before
    public void init() {
        context = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
    }

    /**
     * 全局校验
     *  注意进入规则的验证：
     *  1.单独次数验证：执行pipelineExecutor.validator(eventPackage)，次数比限制次数多1次
     *  2.单独时间验证：将规则中时间限制值设置0，可以无限执行pipelineExecutor.validator(eventPackage)均能返回true 或者 设为大于0的数，则是第一返回true,其他全是false
     *  3.混合验证：1与2配置设置即可
     * @throws IOException
     */
    @Test
    public void validatorTest() throws IOException  {
        EventPackage eventPackage = getEventPackage();
        PipelineExecutor pipelineExecutor = new PipelineExecutor();
        boolean result = pipelineExecutor.validator(eventPackage);
        System.out.println("result is : " + result);
    }

    private EventPackage getEventPackage() throws IOException {
        String data = FileUtils.readFileToString(new File(PipelineExecutorTest.class.getResource("/pipelineexecutor/EventPackage.txt").getPath()), "UTF-8");
        return JsonUtil.toObject(data, EventPackage.class);
    }

}

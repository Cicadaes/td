package service;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.constant.PipelineDefinitionConstant;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.page.campaign.PipelineDefinitionPage;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import com.talkingdata.marketing.core.util.DateUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Date;
import java.util.List;

/**
 * Pipeline Definition Test Class
 * @author hongsheng
 * @create 2017-10-26-上午10:31
 * @since JDK 1.8
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class PipelineDefinitionServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(PipelineDefinitionServiceTest.class);

    @Autowired
    private PipelineDefinitionService pipelineDefinitionService;

    @Test
    public void findByCampaignIdTest() {
        List<PipelineDefinition> pipelineDefinitions = pipelineDefinitionService.findByCampaignId(329);
        pipelineDefinitions.forEach(pipelineDefinition ->{logger.info(pipelineDefinition.toString());});
    }

    @Test
    public void findApplyExpirePipeLineTest() throws Exception {
        PipelineDefinitionPage page = new PipelineDefinitionPage();
        page.getPager().setPageEnabled(false);
        page.setStatus(PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_TO_ONLINE+"");
        page.setStartTime2(DateUtil.formatDateTime(new Date(),"yyyy-MM-dd HH:mm:ss"));
        List<PipelineDefinition> pipelineDefinitionList =  pipelineDefinitionService.queryByList(page);
        logger.info("==========营销活动过期申请自动审核不通过任务.发现符合条件的营销活动有 {} 条",pipelineDefinitionList.size());
    }
}

package marketing.service;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

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
}

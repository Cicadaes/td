package service;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.service.campaign.PipelineConfigService;
import com.talkingdata.marketing.web.controller.campaign.PipelineDefinitionController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author xiaoming.kang
 * @date 2018/03/12.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class PipelineConfigServiceTest {

    @Autowired
    private PipelineConfigService pipelineConfigService;

    @Autowired
    private PipelineDefinitionController controller;


    @Test
    public void findPipelineShortMessageLabelTest() throws Exception{
/*        try{
            pipelineConfigService.findPipelineShortMessageLabel(1292);
        }catch (Exception e){
            e.printStackTrace();
            if(e instanceof MktException){
                MktException ee = (MktException)e;
                ee.printStackTrace();
            }
        }*/

        controller.pipelineShortMessageLabel(1292);

    }
}

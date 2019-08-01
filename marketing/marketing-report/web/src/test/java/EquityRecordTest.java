import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.dto.PipelineEquityRecordCacheDto;
import com.talkingdata.marketing.core.service.campaign.EquityRecordService;
import com.talkingdata.marketing.core.service.campaign.EquityService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class EquityRecordTest {
    @Autowired
    private EquityService equityService;
    @Autowired
    EquityRecordService equityRecordService;

    @Test
    public void allocateEquity() throws Exception {
        equityService.allocateEquity(245, 14);
    }

    @Test
    public void recycleEquity() throws Exception {
        equityService.recycleEquity(14);
    }

    @Test
    public void distribute() throws Exception {
        PipelineDefinition pipelineDefinition = new PipelineDefinition();
        pipelineDefinition.setCampaignId(245);
        pipelineDefinition.setId(14);
        PipelineEquityRecordCacheDto recordCacheDto = equityService.distribute(pipelineDefinition, "PE20170918000002");
        System.out.println(recordCacheDto.getEquityValueList());
    }

    @Test
    public void testReload() throws Exception {
        equityService.reload(245, 14, "PE20170918000002");
    }

    @Test
    public void testCleanTask() throws Exception {
        equityRecordService.clean();
    }
}

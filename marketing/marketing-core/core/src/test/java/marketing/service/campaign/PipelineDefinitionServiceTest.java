package marketing.service.campaign;

import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import marketing.BaseTest;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

/**
 * @author hongsheng
 * @create 2017-11-20-下午4:06
 * @since JDK 1.8
 */
public class PipelineDefinitionServiceTest extends BaseTest {

    @Autowired
    private PipelineDefinitionService pipelineDefinitionService;

    @Test
    public void findSimpleInstanceByIdsTest() throws Exception {
        Set<Integer> param = new HashSet<>();
        param.add(301);
        param.add(313);
        List<PipelineDefinition> pipelineDefinitions = pipelineDefinitionService.findSimpleInstanceByIds(param);
        logger.info("findSimpleInstanceByIdsTest()结果：{}", pipelineDefinitions);
    }
}

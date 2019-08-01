package service;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.service.campaign.EquityConfigService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

/**
 * EquityConfigService Test Class
 * @author hongsheng
 * @create 2017-10-31-下午5:03
 * @since JDK 1.8
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class EquityConfigServiceTest {

    @Autowired
    private EquityConfigService equityConfigService;

    @Test
    public void updateEquityNameTest() throws Exception {
        equityConfigService.updateEquityName(87, "修改测试");
    }
}

package service;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.service.campaign.BatchNoticeService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

/**
 * BatchNoticeService Test Class
 * @author hongsheng
 * @create 2017-12-14-上午11:36
 * @since JDK 1.8
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class BatchNoticeServiceTest {

    @Autowired
    private BatchNoticeService batchNoticeService;

    @Test
    public void updateStatusByUniqueIndexTest() throws Exception {
        batchNoticeService.updateStatusByUniqueIndex(1, 1, "1.0", 6);
    }
}

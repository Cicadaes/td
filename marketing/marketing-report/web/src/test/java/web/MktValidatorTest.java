package web;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;


/**
 * MktValidator Test Class
 * @author hongsheng
 * @create 2017-10-26-下午12:09
 * @since JDK 1.8
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class MktValidatorTest {

    private static final Logger logger = LoggerFactory.getLogger(MktValidatorTest.class);

    @Autowired
    private MktValidator mktValidator;

    @Test
    public void validateCampaignTimeFrameTest() throws Exception {
        mktValidator.validateCampaignTimeFrame(329,
            DateUtil.string2Date("yyyy-MM-dd HH:mm:ss","2017-10-26 00:00:00"),
            DateUtil.string2Date("yyyy-MM-dd HH:mm:ss","2017-12-01 00:00:00"));
        logger.info("result is : {}");
    }

    @Test
    public void validatePipelineTimeFrameTest() throws Exception {
        try {
            mktValidator.validatePipelineTimeFrame(329,
                    DateUtil.string2Date("yyyy-MM-dd HH:mm:ss", "2017-10-29 00:00:00"),
                    DateUtil.string2Date("yyyy-MM-dd HH:mm:ss", "2017-11-01 00:00:00"));
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}

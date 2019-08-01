import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.dto.SegmentDto;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class SegmentTest {
    @Autowired
    private SegmentService segmentService;
    @Test
    public void testCheckExistByName() throws Exception {
//        System.out.println(segmentService.checkExistByName("高小琴"));
//        System.out.println(segmentService.checkExistByName("铲掉铲掉"));
    }


    @Test
    public void testDtoQueryById()throws Exception{
        SegmentDto dto = segmentService.getDao().queryBySegmentId(704);
        System.out.println("dto="+ JsonUtil.toJson(dto));
    }


    @Test
    public void testGetProcessSegment()throws Exception{
        List<Segment> dto = segmentService.getProcessSegment();
        System.out.println("dto="+ JsonUtil.toJson(dto));
    }
}
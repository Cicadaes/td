package marketing.service.campaign;

import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import com.talkingdata.marketing.core.service.campaign.BatchNoticeService;
import marketing.BaseTest;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * BatchNoticeService Test Class
 *
 * @author hongsheng
 * @create 2017-11-17-下午5:24
 * @since JDK 1.8
 */
public class BatchNoticeServiceTest extends BaseTest {

    @Autowired
    private BatchNoticeService batchNoticeService;

    @Test
    public void updateCalcStatus2ProgressByIdsTest() throws Exception {
        Set<Integer> param = new HashSet<>();
        param.add(1);
        param.add(1);
        param.add(3);

        batchNoticeService.updateCalcStatus2ProgressByIds(param);
    }

    @Test
    public void listToBeNoticeDataByIdTypeTest() throws Exception {
        List<BatchNotice> batchNotices = batchNoticeService.listToBeNoticeDataByIdType(ChannelConstants.PUSH);
        logger.info("listToBeNoticeDataByIdTypeTest()测试结果是：{}", batchNotices);
    }

    /**
     * 打印数据的ID值
     *
     * @param batchNotices
     */
    public void displayBeNoticeList(List<BatchNotice> batchNotices) {
        batchNotices.forEach(e -> System.out.println(e.getId()));
    }

}

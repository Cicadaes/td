package service;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.entity.campaign.EquityRecord;
import com.talkingdata.marketing.core.page.campaign.EquityRecordPage;
import com.talkingdata.marketing.core.service.campaign.EquityRecordService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author xiaoming.kang
 * @date 2018/03/16.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class EquityRecordServiceTest {
    @Autowired
    private EquityRecordService equityRecordService;

    @Test
    public void insertGame() throws Exception {
        int n = 1;
        int total = 987;
        List list = new ArrayList();
        for (; n < total+1; n++) {
            EquityRecord equityRecord = new EquityRecord();
            equityRecord.setCampaignId(747);
            equityRecord.setPipelineDefinitionId(1322);
            equityRecord.setEquityConfigId(307);
            equityRecord.setEquityCode("PE20180316003");
            equityRecord.setEquityValue("T" + n);
            equityRecord.setStatus(0);
            equityRecord.setTenantId("talking131");
            equityRecord.setCreator("杨涛");
            equityRecord.setCreateBy("tao.yang@tendcloud.com");
            equityRecord.setCreateTime(new Date());
            list.add(equityRecord);
            if (n % 100 == 0) {
                equityRecordService.insertBatch(list);
                list = new ArrayList();
            }

            if(n == total && list.size() >0){
                equityRecordService.insertBatch(list);
            }
        }
    }

    @Test
    public void updateRecord() throws Exception{

        EquityRecordPage page = new EquityRecordPage();
        page.setCampaignId(747+"");
        page.setStatus(0+"");
        page.getPager().setPageEnabled(false);

        List<EquityRecord> recordList = equityRecordService.queryByList(page);

        for(EquityRecord record : recordList){
            String value = record.getEquityValue();
            record.setEquityValue("T"+(11013+Integer.parseInt(value.substring(1))));
            equityRecordService.updateByPrimaryKeySelective(record);
        }

    }

}

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.constant.IdTypeConstants;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.middleware.PushMessageApi;
import com.talkingdata.marketing.core.page.campaign.CrowdPage;
import com.talkingdata.marketing.core.service.campaign.CrowdService;
import org.apache.commons.lang.StringUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class CrowdApiTest {
    @Autowired
    private CrowdApi crowdApi;
    @Autowired
    private PushMessageApi pushMessageApi;
    @Autowired
    private CrowdService crowdService;

    @Test
    public void getCrowdInfo() throws Exception {
        CrowdInfoResp crowdInfo = crowdApi.getCrowdInfo(666);
        System.out.println(crowdInfo);
    }

    @Test
    public void getRecount() throws Exception {

        System.out.println(crowdApi.recount(666));
    }

    @Test
    public void createCrowd() throws Exception {
        byte[] param = InputStream2byte("/home/zmy/templateUtf8.csv");
        System.out.println(crowdApi.createCrowd("222","tdid",new String(param),"talking131","loginName","userName"));
    }
    public byte[] InputStream2byte(String path){
        byte[] data = null;
        try (FileInputStream input = new FileInputStream(new File(path));ByteArrayOutputStream output = new ByteArrayOutputStream();){
            byte[] buf = new byte[1024];
            int numBytesRead = 0;
            while ((numBytesRead = input.read(buf)) != -1) {
                output.write(buf, 0, numBytesRead);
            }
            data = output.toByteArray();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return data;
    }

    @Test
    public void testCache() throws Exception {
        for (int i = 0; i < 8; i++) {
            System.out.println(crowdApi.getEventMapping());
            Thread.sleep(10000);
        }
    }
    @Test
    public void testpushMessageApi() throws Exception {
        for (int i = 0; i < 8; i++) {
            System.out.println(pushMessageApi.getBaseUrl());
            Thread.sleep(10000);
        }
    }
    @Test
    public void testDownloadCrowd() throws Exception {
        /**
         * 通知
         */
//        Integer result1 = crowdApi.getCrowdDownloadCalcId(4257, Constant.DV_TDID);
//        System.out.println(result1);
        //增量
//        Integer result1 = crowdApi.noticeCrowdDownloadWithVersion(667,"1515599941235", IdTypeConstants.TDID);
//        System.out.println(result1);
        /**
         * 检查
         */
//        Integer result2 = crowdApi.crowdDownloadCheck(1952);//为上面返回值result1
//        System.out.println(result2);
        /**
         * 获取下数据
         */
        List<String> result3 = crowdApi.downloadByCalcId(1952);//为上面返回值result1
        System.out.println(result3.size());
        System.out.println(result3);
    }

    @Test
    public void testSnapshotCrowd() {
        System.out.println(crowdApi.snapshotCrowd(4257, "20170713175536"));
    }

    @Test
    public void testSnapshotCrowdAll() {
        CrowdPage page = new CrowdPage();
        //page.getPager().setPageEnabled(false);
        page.setRefName("测试");
        if (StringUtils.isNotBlank(page.getRefName())) {
            page.setRefNameOperator("like");
            page.setRefName(String.format("%%%s%%", page.getRefName()));
        }
        try {
            List<Crowd> crowdList = crowdService.getCrowdByTp(page);
            String version = String.valueOf(System.currentTimeMillis());
            for (Crowd crowd : crowdList) {
                if(null != crowd.getRefId()){
                    System.out.println(crowdApi.snapshotCrowd(crowd.getRefId(), version));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
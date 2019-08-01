import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.service.common.RedisUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CountDownLatch;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class RedisTest {

    private static final Logger logger = LoggerFactory.getLogger(RedisTest.class);

    @Autowired
    private StringRedisTemplate template;

    @Autowired
    private RedisUtils redis;

    @Test
    public void test() throws Exception {
        ValueOperations<String, String> ops = this.template.opsForValue();
        String key = "spring.boot.redis.test1";
        if (!this.template.hasKey(key)) {
            ops.set(key, "foo1");
        }
    }

    @Test
    public void testList() throws Exception {
//        long leftpush = redis.leftpush("key", "value");
//        System.out.println(leftpush);
        System.out.println("值只值只" + redis.rightPop("key"));
    }

    @Test
    public void benchmarkRedisPush() throws Exception {
        int threadTotal = 20;
        Date start = new Date();
        CountDownLatch countDownLatch = new CountDownLatch(threadTotal);
        for (int i=0;i<threadTotal;i++) {
            Thread t = new Thread(new PushWorker(String.format("thread-%d",i), countDownLatch));
            t.start();
        }

        countDownLatch.await();
        System.out.println("used:"+(System.currentTimeMillis()-start.getTime()));
    }

    private class PushWorker implements Runnable {
        private CountDownLatch countDownLatch;
        private String threadName;
        String key = "campaign_1_2_1";
        public PushWorker(String threadName, CountDownLatch countDownLatch) {
            this.threadName = threadName;
            this.countDownLatch = countDownLatch;
        }

        @Override
        public void run() {
            List<String> ids = new ArrayList();

            for (int i=0;i<10000;i++) {
                ids.add(String.valueOf(i));
            }
            try {
                redis.leftPushAll(key, ids);
            } catch (Exception e) {
                logger.error("left push all err thread name:"+threadName, e);
            } finally {
                countDownLatch.countDown();
            }
            System.out.println(threadName+"done");
        }
    }

    @Test
    public void benchmarkRedisPop() {
        int threadTotal = 10;
        Date start = new Date();
        CountDownLatch countDownLatch = new CountDownLatch(threadTotal);
        for (int i=0;i<threadTotal;i++) {
            Thread t = new Thread(new PopWorker(String.format("thread-%d",i), countDownLatch));
            t.start();
        }
        try {
            countDownLatch.await();
        }catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("used:"+(System.currentTimeMillis()-start.getTime()));
    }

    private class PopWorker implements Runnable {
        private CountDownLatch countDownLatch;
        private String threadName;
        String key = "campaign_1_2_1";
        public PopWorker(String threadName, CountDownLatch countDownLatch) {
            this.threadName = threadName;
            this.countDownLatch = countDownLatch;
        }

        @Override
        public void run() {
            try {
                while(true) {
                    String str = redis.rightPop(key);
                    if (str == null) {
                        break;
                    }
                    logger.info(threadName+" pop:"+str);
                }
                } catch (Exception e) {
                    logger.error("right pop err thread name:"+threadName, e);
                } finally {
                    countDownLatch.countDown();
            }


            System.out.println(threadName+"done");
        }
    }

}

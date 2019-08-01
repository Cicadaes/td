package td.enterprise.wanalytics.etl.task.rerun;

import com.google.code.fqueue.FQueue;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.util.HttpClientUtil;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * junmin.li
 */
public class FSQueueReader implements Runnable {

    private static final Logger logger = Logger.getLogger(FSQueueReader.class);

    private static AtomicInteger returnCnt = new AtomicInteger(0);

    public void run() {

        FQueue q = FSQueueManager.getInstance().getWiFiReceiveFQueue();
        int s = q.size();
        if (s <= 0) {
            return;
        }
        byte[] data = q.poll();
        try {
            if (data != null && data.length != 0) {
                try {
                    HttpClientUtil.post(SendCollectorDataTask.COLLECTOR_URL, new String(data), "utf-8");
                    if(returnCnt.addAndGet(1) % 5000 == 0){
                        logger.info("已发送:" + returnCnt);
                    }
                } catch (Exception e) {
                    if (returnCnt.addAndGet(1) % 1000 == 0) {
                        logger.info("============== write to kafka error,return:" + returnCnt.get());
                    }
                }
            }
        } catch (Exception e) {
            logger.error("发送失败",e);
        }
    }

}

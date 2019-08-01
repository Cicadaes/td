package td.enterprise.wanalytics.etl.task.rerun;


import org.apache.log4j.Logger;

import java.util.concurrent.atomic.AtomicInteger;


/**
 * Created by loong on 4/13/16.
 */
public class FSQueueWriter implements Runnable {

    private static final Logger logger = Logger.getLogger(FSQueueWriter.class);

    private String jsonData;

    private static AtomicInteger cnt = new AtomicInteger(0);

    public FSQueueWriter(String jsonData) {
        this.jsonData = jsonData;
    }

    @Override
    public void run() {
        try {

            boolean succ = FSQueueManager.getInstance().getWiFiReceiveFQueue().offer(jsonData.getBytes());
            if (!succ) {
                logger.error("Fail to add to fqueue, Raw data:" + jsonData);
            } else {
                if (cnt.addAndGet(1) % 10000 == 0) {
                    logger.info("Write to fqueue:" + cnt.get());
                }
            }
        } catch (Exception e) {
            logger.error("Fail to add to fqueue, exception occured, Raw data:" + jsonData + "\r\n", e);
        }
    }

}

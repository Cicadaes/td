package td.enterprise.collector.control;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import td.enterprise.collector.fqueue.FSQueueManager;
import td.enterprise.common.util.LogUtils;
import td.enterprise.constants.ThreadConstants;

import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;

public class FSQueueWriter implements Runnable {

    private static final Logger  logger = LoggerFactory.getLogger(FSQueueWriter.class);

    private WiFiDataEntity       dataEntity;

    private static AtomicInteger cnt    = new AtomicInteger(0);

    public FSQueueWriter(WiFiDataEntity dataEntity) {
        this.dataEntity = dataEntity;
    }

    @Override
    public void run() {
        long startTime = System.currentTimeMillis();
        ByteArrayOutputStream bo = null;
        ObjectOutputStream out = null;
        try {
            bo = new ByteArrayOutputStream();
            out = new ObjectOutputStream(bo);
            out.writeObject(dataEntity);

            boolean succ = FSQueueManager.getInstance().getWiFiReceiveFQueue().offer(bo.toByteArray());
            if (!succ) {
                logger.error("Fail to add to fqueue, Raw data:" + dataEntity);
            } else {
                if (cnt.addAndGet(1) % 10000 == 0) {
                    logger.info("Write to fqueue:" + cnt.get());
                }
            }
        } catch (Exception e) {
            logger.error("Fail to add to fqueue, exception occured, Raw data:" + dataEntity + "\r\n", e);
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bo != null) {
                try {
                    bo.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        long runTime = System.currentTimeMillis() - startTime;
        if (runTime > ThreadConstants.RUN_TIME_PRINTLOG) {
            LogUtils.log4Task.info("FSQueueWriter runtime :{} ms", runTime);
        }
    }

}

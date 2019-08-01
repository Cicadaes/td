package com.talkingdata.analytics.wifi.collector.control;

import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.fqueue.FSQueueManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.concurrent.atomic.AtomicInteger;


/**
 * Created by loong on 4/13/16.
 */
public class FSQueueWriter implements Runnable {

    private static final Logger errorLogger = LoggerFactory.getLogger("error");

    private static final Logger logger = LoggerFactory.getLogger(FSQueueWriter.class);

    private WiFiDataEntity dataEntity;

    private static AtomicInteger cnt = new AtomicInteger(0);

    public FSQueueWriter(WiFiDataEntity dataEntity) {
        this.dataEntity = dataEntity;
    }

    @Override
    public void run() {
        ByteArrayOutputStream bo = null;
        ObjectOutputStream out = null;
        try {
            bo = new ByteArrayOutputStream();
            out = new ObjectOutputStream(bo);
            out.writeObject(dataEntity);

            boolean succ = FSQueueManager.getInstance().getWiFiReceiveFQueue().offer(bo.toByteArray());
            if (!succ) {
                errorLogger.error("Fail to add to fqueue, Raw data:" + dataEntity);
            } else {
                if (cnt.addAndGet(1) % 10000 == 0) {
                    logger.info("Write to fqueue:" + cnt.get());
                }
            }
        } catch (Exception e) {
            errorLogger.error("Fail to add to fqueue, exception occured, Raw data:" + dataEntity + "\r\n", e);
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
    }

}

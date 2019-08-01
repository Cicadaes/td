package com.talkingdata.analytics.wifi.collector.control;

import com.google.code.fqueue.FQueue;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.fqueue.FSQueueManager;
import com.talkingdata.analytics.wifi.collector.service.CollectorService;
import com.talkingdata.analytics.wifi.collector.service.KafkaService;
import com.talkingdata.analytics.wifi.collector.util.Codeconvert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by loong on 4/13/16.
 */
public class FSQueueReader implements Runnable {

    private static final Logger errorLogger = LoggerFactory.getLogger("error");

    private static final Logger logger = LoggerFactory.getLogger(FSQueueReader.class);

    private static AtomicInteger returnCnt = new AtomicInteger(0);
    private static AtomicInteger readcntNotnull = new AtomicInteger(0);


    public void run() {

        // 往Kafka写数据，先测试是否可用
        if (!CollectorService.getInstance().getKafkaService().isWifiKafkaUseable()) {
            logger.warn("Kafka is not available!");
            return;
        }

        FQueue q = FSQueueManager.getInstance().getWiFiReceiveFQueue();

        int s = q.size();
        if (s <= 0) {
            return;
        }
        byte[] data = q.poll();

        ByteArrayInputStream bi = null;
        ObjectInputStream in = null;

        try {
            if (data != null && data.length != 0) {
                bi = new ByteArrayInputStream(data);
                in = new ObjectInputStream(bi);
                // send to remote fqueue
                WiFiDataEntity dataEntity = (WiFiDataEntity) in.readObject();
                try {
                    CollectorService.getInstance().send(KafkaService.SRC_TYPE_WIFI, data, dataEntity.getWifidata().getApmac());
                    if (readcntNotnull.addAndGet(1) % 10000 == 0) {
                        logger.info("================= read and write to kafka count:" + readcntNotnull.get());
                    }
                } catch (Exception e) {
                    // 发送失败，写回本地队列
                    AsyncProcesser.getInstance().in(dataEntity);
                    if (returnCnt.addAndGet(1) % 1000 == 0) {
                        logger.info("============== write to kafka error,return:" + returnCnt.get());
                    }
                }
            }
        } catch (Exception e) {
            errorLogger.error("The data get from fqueue can't be unpacked. Raw data: " + Codeconvert.ByteToStr(data, 0, data.length) + "\r\n", e);
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bi != null) {
                try {
                    bi.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}

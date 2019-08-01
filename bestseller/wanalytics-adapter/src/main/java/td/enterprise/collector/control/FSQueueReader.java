package td.enterprise.collector.control;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.concurrent.atomic.AtomicInteger;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.collector.fqueue.FSQueueManager;
import td.enterprise.collector.service.CollectorService;
import td.enterprise.collector.service.KafkaService;
import td.enterprise.collector.util.Codeconvert;
import td.enterprise.common.util.LogUtils;
import td.enterprise.constants.ThreadConstants;

import com.google.code.fqueue.FQueue;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;

@Slf4j
public class FSQueueReader implements Runnable {

    private static AtomicInteger returnCnt      = new AtomicInteger(0);
    private static AtomicInteger readcntNotnull = new AtomicInteger(0);

    public void run() {

        // 往Kafka写数据，先测试是否可用
        if (!CollectorService.getInstance().getKafkaService().isWifiKafkaUseable()) {
            LogUtils.log4Fqueue.warn("Kafka is not available!");
            return;
        }
        long startTime = System.currentTimeMillis();
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
                        LogUtils.log4Fqueue.info("================= read and write to kafka count:" + readcntNotnull.get());
                    }
                } catch (Exception e) {
                    // 发送失败，写回本地队列
                    AsyncProcesser.getInstance().in(dataEntity);
                    if (returnCnt.addAndGet(1) % 1000 == 0) {
                        LogUtils.log4Fqueue.info("============== write to kafka error,return:" + returnCnt.get());
                    }
                }
            }
        } catch (Exception e) {
            log.error("The data get from fqueue can't be unpacked. Raw data: " + Codeconvert.ByteToStr(data, 0, data.length) + "\r\n", e);
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

        long runTime = System.currentTimeMillis() - startTime;
        if (runTime > ThreadConstants.RUN_TIME_PRINTLOG) {
            LogUtils.log4Task.info("FSQueueReader runtime :{} ms", runTime);
        }
    }

}

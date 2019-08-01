package td.enterprise.task;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.collector.config.Configuration;
import td.enterprise.collector.control.OfflineFSQueueReader;
import td.enterprise.collector.counter.ApmacHeartCounter;
import td.enterprise.common.util.LogUtils;
import td.enterprise.common.util.StringUtil;
import td.enterprise.constants.QueueConstants;
import td.enterprise.constants.ThreadConstants;

import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;

@Slf4j
public class QueueUtil {

    private static QueueUtil                     instance;

    private static BlockingQueue<WiFiDataEntity> writeQueue;

    private QueueUtil() {
        writeQueue = new LinkedBlockingQueue<WiFiDataEntity>(1000);

        ThreadPoolExecutor execsIn = (ThreadPoolExecutor) Executors.newFixedThreadPool(ThreadConstants.QUEUE_THREAD_SIZE, new TdThreadFactory(
                "queueWrite"));

        String topic = Configuration.get("kafka.collector.wifi.topic");
        if (StringUtil.isEmpty(topic)) {
            LogUtils.log4Fqueue.error("topic is null");
        }

        for (int i = 0; i < ThreadConstants.QUEUE_THREAD_SIZE; i++) {
            execsIn.execute(new Runnable() {

                @Override
                public void run() {
                    while (true) {
                        List<WiFiDataEntity> returnList = new ArrayList<>(QueueConstants.MESSAGE_SIZE);

                        WiFiDataEntity dataEntity = null;
                        long startTime = 0;
                        WifiData wifiData = null;
                        List<WifiTa> wifiList = null;
                        long runTime = 0;

                        for (int i = 0; i < QueueConstants.MESSAGE_SIZE; i++) {
                            dataEntity = QueueUtil.getInstance().poll();
                            if (null != dataEntity) {
                                returnList.add(dataEntity);
                                startTime = System.currentTimeMillis();
                                wifiData = dataEntity.getWifidata();
                                wifiList = wifiData.getWifitalist();

                                if (wifiList != null) {
                                    ApmacHeartCounter.collector(wifiData.getApmac() + "," + wifiList.size() + "," + dataEntity.getTsreceive());
                                }
                                runTime = System.currentTimeMillis() - startTime;
                                if (runTime > 100) {
                                    LogUtils.log4Task.info("ApmacHeartCounter_collector runtime :{} ms", runTime);
                                }
                            }
                        }
                        OfflineFSQueueReader.sendKafka(topic, returnList);
                    }
                }
            });
        }
    }

    /**
     * 单例
     * @return
     */
    public final static QueueUtil getInstance() {
        if (instance == null) {
            synchronized (QueueUtil.class) {
                if (instance == null) {
                    instance = new QueueUtil();
                }
            }
        }
        return instance;
    }

    public void put(WiFiDataEntity wiFiDataEntity) {
        try {
            writeQueue.put(wiFiDataEntity);
        } catch (Exception e) {
            LogUtils.log4Task.error("QueueUtil put Error:", e);
        }
    }

    public WiFiDataEntity take() {
        try {
            return writeQueue.take();
        } catch (Exception e) {
            LogUtils.log4Task.error("QueueUtil take Error:", e);
            return null;
        }
    }

    public WiFiDataEntity poll() {
        try {
            return writeQueue.poll(60L, TimeUnit.SECONDS);
        } catch (Exception e) {
            LogUtils.log4Task.error("QueueUtil take Error:", e);
            return null;
        }
    }

    public int getQueueSize() {
        return writeQueue.size();
    }
}

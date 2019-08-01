package td.enterprise.collector.control;

import java.io.ByteArrayOutputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.List;

import kafka.producer.KeyedMessage;
import lombok.extern.slf4j.Slf4j;
import td.enterprise.collector.service.CollectorService;
import td.enterprise.common.util.LogUtils;
import td.enterprise.constants.QueueConstants;
import td.enterprise.constants.ThreadConstants;
import td.enterprise.task.QueueUtil;

import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;

@Slf4j
public class OfflineFSQueueReader {

    public static void sendKafka(String topic, List<WiFiDataEntity> returnList) {

        // 往Kafka写数据，先测试是否可用
        if (!CollectorService.getInstance().getKafkaService().isWifiKafkaUseable()) {
            LogUtils.log4Fqueue.warn("Kafka is not available!");
            return;
        }
        long startTime = System.currentTimeMillis();

        List<KeyedMessage<String, byte[]>> messageList = new ArrayList<>(QueueConstants.MESSAGE_SIZE);
        for (WiFiDataEntity dataEntity : returnList) {
            if (dataEntity == null) {
                continue;
            }
            try (ByteArrayOutputStream bo = new ByteArrayOutputStream(); ObjectOutputStream out = new ObjectOutputStream(bo)) {
                out.writeObject(dataEntity);

                messageList.add(new KeyedMessage<String, byte[]>(topic, dataEntity.getWifidata().getApmac(), bo.toByteArray()));
            } catch (Exception e) {
                LogUtils.log4Fqueue.error("" + dataEntity.toString(), e);
            }
        }
        if (messageList.size() == 0) {
            return;
        }
        try {
            CollectorService.getInstance().send(messageList);

            LogUtils.log4Fqueue.info("================= read and write to kafka messageList:{}", messageList.size());
        } catch (Exception e) {
            // 发送失败，写回本地队列
            for (WiFiDataEntity dataEntity : returnList) {
                QueueUtil.getInstance().put(dataEntity);
            }
            LogUtils.log4Fqueue.info("============== write to kafka error,returnList:{}", returnList.size());
        }

        long runTime = System.currentTimeMillis() - startTime;
        if (runTime > ThreadConstants.RUN_TIME_PRINTLOG) {
            LogUtils.log4Task.info("OfflineFSQueueReader runtime :{} ms", runTime);
        }
    }
}

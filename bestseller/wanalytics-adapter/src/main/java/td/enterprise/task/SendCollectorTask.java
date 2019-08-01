package td.enterprise.task;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.collector.control.AsyncProcesser;
import td.enterprise.collector.counter.ApmacHeartCounter;
import td.enterprise.common.util.LogUtils;

import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;

@Slf4j
public class SendCollectorTask implements Runnable {

    private String         collectorUrl;
    private String         fileName;
    private WiFiDataEntity wiFiDataEntity;

    public SendCollectorTask(String collectorUrl, String fileName, WiFiDataEntity wiFiDataEntity) {
        super();
        this.collectorUrl = collectorUrl;
        this.fileName = fileName;
        this.wiFiDataEntity = wiFiDataEntity;
    }

    @Override
    public void run() {
        try {
            WifiData wifiData = wiFiDataEntity.getWifidata();
            List<WifiTa> wifiList = wifiData.getWifitalist();

            long startTime = System.currentTimeMillis();
            if (wifiList != null) {
                ApmacHeartCounter.collector(wifiData.getApmac() + "," + wifiList.size() + "," + wiFiDataEntity.getTsreceive());
            }
            Long runTime = System.currentTimeMillis() - startTime;
            if (runTime > 100) {
                LogUtils.log4Task.info("ApmacHeartCounter_collector runtime :{} ms", runTime);
            }

            // 向后端发送数据

            AsyncProcesser.getInstance().in(wiFiDataEntity);
            AsyncProcesser.getInstance().out();

            /* String sensorData = JsonUtils.objectToJsonStr(wiFiDataEntity);
             //向 Collector 发送数据
             long startTime = System.currentTimeMillis();
             //String response = HttpClientUtil.post(collectorUrl, sensorData, "utf-8");
             String response = HttpAsyncUtil.getInstance().postGzip(collectorUrl, sensorData);

             LogUtils.log4Http.info("sendData_fileName:{}, runTime:{} ms ,response:{}, sendData:{}", //
                     fileName, (System.currentTimeMillis() - startTime), response, sensorData);*/
        } catch (Exception e) {
            log.error("SendCollectorTaskError:", e);
        }

    }

}

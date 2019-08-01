package td.enterprise.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import td.enterprise.common.util.LogUtils;
import td.enterprise.constants.FTPConstants;
import td.enterprise.dao.BaseDao;
import td.enterprise.entity.FTPLine;
import td.enterprise.task.QueueUtil;
import td.enterprise.task.SendCollectorTask;
import td.enterprise.task.ThreadUtil;

import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;

@Service("dataService")
@Slf4j
public class DataService<T> extends BaseService<T> {

    @Value("${collector.url}")
    private String collectorUrl;

    @Override
    public BaseDao<T> getDao() {
        return null;
    }

    public void processData(Collection<FTPLine> lineList, String fileName) {
        processFTPLinesMerge(lineList, fileName);
    }

    private void processFTPLinesMerge(Collection<FTPLine> lineList, String fileName) {
        Map<WifiData, List<WifiTa>> apMacMap = new LinkedHashMap<>(lineList.size());
        for (FTPLine line : lineList) {
            String apmac = line.getApMac();
            Long ts = line.getTime();
            String mac = line.getStationMac();
            Integer rssi = line.getSignalStrength();
            Integer channel = line.getChannel();

            String rssis = String.valueOf(rssi);
            Long tssend = ts;

            WifiData wifiData = WifiData.builder().apmac(apmac).tssend(tssend).build();
            WifiTa wifi = WifiTa.builder().mac(mac).rssi(rssis).channel(channel).build();

            if (apMacMap.containsKey(wifiData)) {
                List<WifiTa> wifiList = apMacMap.get(wifiData);
                wifiList.add(wifi);
            } else {
                List<WifiTa> wifiList = new ArrayList<>();
                wifiList.add(wifi);
                wifiData.setNum(1);
                apMacMap.put(wifiData, wifiList);
            }
        }

        int successNum = 0;
        int errorNum = 0;
        for (Map.Entry<WifiData, List<WifiTa>> entry : apMacMap.entrySet()) {

            WifiData wifiData = entry.getKey();
            List<WifiTa> wifiList = entry.getValue();

            wifiData.setWifitalist(wifiList);
            if (wifiList.size() > 1) {
                wifiData.setNum(wifiList.size());
            }

            WiFiDataEntity wiFiDataEntity = new WiFiDataEntity();
            wiFiDataEntity.setDevtype(FTPConstants.FTP_DEV_TYPE);
            wiFiDataEntity.setWifidata(wifiData);
            wiFiDataEntity.setTsreceive(wifiData.getTssend());

            SendCollectorTask task = new SendCollectorTask(collectorUrl, fileName, wiFiDataEntity);
            ThreadUtil.getInstance().submit(task);

            successNum++;

            /*SendCollectorTask task = new SendCollectorTask(collectorUrl, fileName, wiFiDataEntity);
            ThreadUtil.getInstance().submit(task);
            successNum++;
            if (successNum % sleepSize == 0) {
                try {
                    Thread.sleep(100L);
                } catch (InterruptedException e) {
                    log.error("InterruptedException:", e);
                }
            }*/

        }
        LogUtils.log4Task.info("fileName:{},successNum:{},errorNum:{}", fileName, successNum, errorNum);
    }

    /**
     * 补数的时候用
     * @param lineList
     * @param fileName
     *
     */

    public void offlineProcessData(Collection<FTPLine> lineList, String fileName) {
        String apmac = null;
        Long ts = null;
        String mac = null;
        Integer rssi = null;
        Integer channel = null;
        String rssis = null;
        Long tssend = null;
        WifiData wifiData = null;
        WifiTa wifi = null;
        List<WifiTa> wifiList = null;
        Map<WifiData, List<WifiTa>> apMacMap = new LinkedHashMap<>(lineList.size());
        for (FTPLine line : lineList) {
            apmac = line.getApMac();
            ts = line.getTime();
            mac = line.getStationMac();
            rssi = line.getSignalStrength();
            channel = line.getChannel();

            rssis = String.valueOf(rssi);
            tssend = ts;

            wifiData = WifiData.builder().apmac(apmac).tssend(tssend).build();
            wifi = WifiTa.builder().mac(mac).rssi(rssis).channel(channel).build();

            if (apMacMap.containsKey(wifiData)) {
                wifiList = apMacMap.get(wifiData);
                wifiList.add(wifi);
            } else {
                wifiList = new ArrayList<>();
                wifiList.add(wifi);
                wifiData.setNum(1);
                apMacMap.put(wifiData, wifiList);
            }
        }

        int successNum = 0;
        int errorNum = 0;
        WiFiDataEntity wiFiDataEntity = null;

        for (Map.Entry<WifiData, List<WifiTa>> entry : apMacMap.entrySet()) {

            wifiData = entry.getKey();
            wifiList = entry.getValue();

            wifiData.setWifitalist(wifiList);
            if (wifiList.size() > 1) {
                wifiData.setNum(wifiList.size());
            }

            wiFiDataEntity = new WiFiDataEntity();
            wiFiDataEntity.setDevtype(FTPConstants.FTP_DEV_TYPE);
            wiFiDataEntity.setWifidata(wifiData);
            wiFiDataEntity.setTsreceive(wifiData.getTssend());

            QueueUtil.getInstance().put(wiFiDataEntity);

            successNum++;
        }
        LogUtils.log4Task.info("apMacMap:{},queueSize:{}", apMacMap.size(), QueueUtil.getInstance().getQueueSize());
        LogUtils.log4Task.info("fileName:{},successNum:{},errorNum:{}", fileName, successNum, errorNum);
    }
}

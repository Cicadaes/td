package com.talkingdata.analytics.wifi.collector.util;

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;
import com.talkingdata.analytics.wifi.collector.databean.offline.JsonData;
import com.talkingdata.analytics.wifi.collector.databean.offline.ProMacData;
import com.talkingdata.analytics.wifi.collector.databean.offline.ResultData;
import com.talkingdata.analytics.wifi.collector.databean.offline.UserMacData;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by loong on 4/22/16.
 */
public class OfflineJsonDataParser {
    private static final String DEV_TYPE = "001";

    public List<WiFiDataEntity> standard(JsonData jsonData) throws IOException {
        List<WiFiDataEntity> result = new ArrayList<WiFiDataEntity>();
        long tsreceive = System.currentTimeMillis();
        for (ResultData resultData : parse(jsonData.getData())) {
            WiFiDataEntity wiFiDataEntity = new WiFiDataEntity();
            wiFiDataEntity.setVersion(jsonData.getVersion());
            wiFiDataEntity.setDevtype(DEV_TYPE);
            WifiData wifiData = new WifiData();
            String[] apInfos = resultData.getApInfo().split(" ");
            wifiData.setApmac(apInfos[1]);
            wifiData.setTssend(Long.parseLong(apInfos[0]));
            wifiData.setNum(resultData.getUserMacData().getUserMacRssi().size());
            List<WifiTa> wifiTas = new ArrayList<WifiTa>(wifiData.getNum());
            for (String s : resultData.getUserMacData().getUserMacRssi()) {
                WifiTa wifiTa = new WifiTa();
                String[] mac_rssi = s.split(" ");
                wifiTa.setMac(mac_rssi[0]);
                wifiTa.setRssi(mac_rssi[1]);
                wifiTas.add(wifiTa);
            }
            wifiData.setWifitalist(wifiTas);
            wiFiDataEntity.setWifidata(wifiData);
            wiFiDataEntity.setTsreceive(tsreceive);
            result.add(wiFiDataEntity);
        }
        return result;
    }

    private static List<ResultData> parse(List<String> dataList) throws IOException {
        List<ResultData> resultDatas = new ArrayList<ResultData>();
        for (String s : dataList) {
            byte[] bs = Base64.decode(s);
            ByteArrayInputStream bais = new ByteArrayInputStream(bs);
            DataInputStream dis = new DataInputStream(bais);
            ProMacData proMacData = new ProMacData();
            proMacData.setVersion(dis.readByte());
            proMacData.setFlag(dis.readByte());
            proMacData.setLen(dis.readShort());
            proMacData.setTime(dis.readShort());
            byte[] apMacBs = new byte[6];
            dis.read(apMacBs);
            proMacData.setApMac(readApMac(apMacBs));
            proMacData.setUxStamp(dis.readInt());
            proMacData.setUserMacNum(dis.readInt());
            UserMacData userMacData = new UserMacData();
            String apInfo = String.format("%d ", proMacData.getUxStamp()) + proMacData.getApMac() + " ";
            final int MacLen = 6;
            byte[] buff = new byte[MacLen];
            for (int i = 0; i < proMacData.getUserMacNum(); i++) {
                byte b = dis.readByte();
                dis.readByte();
                dis.read(buff);
                userMacData.getUserMacRssi().add(readApMac(buff) + " " + String.format("%d", b));
            }
            dis.close();
            resultDatas.add(new ResultData(apInfo, userMacData));
        }
        return resultDatas;
    }

    /**
     * 新版协议,mac地址不带分隔符,故注释代码
     *
     * @param bs
     * @return
     */
    private static String readApMac(byte[] bs) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < bs.length; i++) {
            byte e = bs[i];
//            if (i > 0) {
//                sb.append(":");
//            }
            String hex = Integer.toHexString(e & 0xFF);
            if (hex.length() == 1) {
                hex = '0' + hex;
            }
            sb.append(hex);
        }
        return sb.toString();
    }
}
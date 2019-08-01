package td.enterprise.wanalytics.etl.task.rerun;

import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.WiFiDataEntity;
import td.enterprise.wanalytics.etl.bean.WifiData;
import td.enterprise.wanalytics.etl.bean.WifiTa;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.JsonUtils;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;

public class GetDataFromFile {

    public static final Logger logger = Logger.getLogger(GetDataFromFile.class);

    protected static void getData(String inputPath, String outputPath) {
        File fileDir = new File(inputPath);
        if (fileDir.isDirectory()) {
            File[] tempList = fileDir.listFiles();
            for (File file : tempList) {
                queryList(file, outputPath);
            }
        }
    }

    public static synchronized List <Map <String, Object>> queryList(File file, String outputPath) {
        List <Map <String, Object>> list = new ArrayList <Map <String, Object>>();

        if (file != null) {
            BufferedReader br = null;
            FileReader fr = null;
            String line;
            try {
                fr = new FileReader(file);
                br = new BufferedReader(fr);
                // 一次读入一行，直到读入null为文件结束
                while ((line = br.readLine()) != null) {
                    // 解析文件内容
                    String[] content = line.split("==");
                    if (content.length < 2) {
                        logger.error("单行数据格式错误！filename=" + file.getName() + ";line=" + line);
                        continue;
                    }
                    String[] split = content[1].split(" ");
                    if (split.length < 5) {
                        logger.error("单行数据格式错误！filename=" + file.getName() + ";line=" + line);
                        continue;
                    }
                    String ts = split[0];
                    String apmac = split[1];
                    String mac = split[2];
                    String rssi = split[3];
                    if (ts.length() == 10) {
                        ts += "000";
                    }

                    Map <String, Object> map = new HashMap <String, Object>();
                    map.put("reportTime", ts);
                    map.put("detectApName", apmac);
                    map.put("stationMac", mac);
                    map.put("rssi", rssi);
                    list.add(map);

                    //每10万条合并一次
                    if (list.size() % 100000 == 0) {
                        String[] words = file.getName().split("\\.");
                        if (words.length >= 1) {
                            String count = words[words.length - 1];
                            formatToOffline(list, false, outputPath, count);
                        }
                        list.clear();
                        list = new ArrayList <>();//初始化列表
                    }
                }

                //最后输出
                String[] words = file.getName().split("\\.");
                if (words.length >= 1) {
                    String count = words[words.length - 1];
                    formatToOffline(list, false, outputPath, count);
                }
                list = new ArrayList <>();//初始化列表

            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                FileUtil.close(br,fr);
            }
        }
        return list;
    }

    protected static void formatToOffline(List <Map <String, Object>> list, boolean needPost, String outputPath, String count) {
        Map <String, String> hashMap = new HashMap <String, String>();
        for (Map <String, Object> object : list) {
            String ts = (String) object.get("reportTime");
            String apmac = (String) object.get("detectApName");
            Integer rssi = Integer.parseInt((String) object.get("rssi"));
            String mac = (String) object.get("stationMac");

            apmac = apmac.replaceAll("-", "");
            mac = mac.replaceAll("-", "");

            String key = ts + ";" + apmac + "," + mac;
            String rssis = hashMap.get(key);
            if (rssis == null) {
                rssis = rssi + "";
            } else {
                rssis += ";" + rssi;
            }
            hashMap.put(key, rssis);
        }
        merge(hashMap, needPost, outputPath, count);
    }

    public static void merge(Map <String, String> hashMap, boolean needPost, String outputPath, String count) {
        //合并相同时间戳和APmac为一条
        HashMap <String, ArrayList <WifiTa>> apmacmap = new HashMap <>();
        Iterator <Entry <String, String>> iterator = hashMap.entrySet().iterator();
        while (iterator.hasNext()) {
            Entry <String, String> ffe = iterator.next();
            String[] split = ffe.getKey().split(",");
            String key = split[0];
            ArrayList <WifiTa> arrayList = apmacmap.get(key);
            if (arrayList == null) {
                arrayList = new ArrayList <WifiTa>();
            }
            WifiTa wifiTa = new WifiTa();
            wifiTa.setMac(split[1]);
            wifiTa.setRssi(ffe.getValue());
            arrayList.add(wifiTa);
            apmacmap.put(key, arrayList);
        }

        //发送数据
        Iterator <Entry <String, ArrayList <WifiTa>>> ite = apmacmap.entrySet().iterator();
        while (ite.hasNext()) {
            try {
                Entry <String, ArrayList <WifiTa>> next2 = ite.next();
                String[] tsapmc = next2.getKey().split(";");
                String ts = tsapmc[0];
                String apmac = tsapmc[1];

                WiFiDataEntity wiFiDataEntity = new WiFiDataEntity();
                wiFiDataEntity.setVersion("1.0");
                wiFiDataEntity.setDevtype("002");
                wiFiDataEntity.setKeytype("1.1");
                wiFiDataEntity.setTsreceive(Long.parseLong(ts));

                WifiData wifiData = new WifiData();
                wifiData.setApmac(apmac);
                wifiData.setTssend(Long.parseLong(ts));

                wifiData.setWifitalist(next2.getValue());
                wifiData.setNum(next2.getValue().size());
                wiFiDataEntity.setWifidata(wifiData);

                String jsonStr = JsonUtils.objectToJsonStr(wiFiDataEntity);

                if (needPost) {
                    //list内容压缩，发送到collector
//						String url = "http://118.89.237.179/collector/g/w";
//						String url = "http://172.23.5.108/collector";//test data
//						HttpClientUtil.post(url, jsonStr, "utf-8");
                } else {
                    //追加写入文件
                    GregorianCalendar gc = new GregorianCalendar();
                    gc.setTimeInMillis(Long.parseLong(ts));
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd-HH");
                    String date = format.format(gc.getTime());
                    String fileName = outputPath + "/data.log." + date + "." + count;
                    File file = new File(outputPath);
                    boolean exists = true;
                    if (!file.exists() && !file.isDirectory()) {
                        exists = false;
                        file.mkdir();
                    }
                    FileWriter writer = null;
                    try {
                        //打开一个写文件器，构造函数中的第二个参数true表示以追加形式写文件
                        writer = new FileWriter(fileName, true);
                        writer.write(jsonStr);
                        writer.write("\n");
                        writer.flush();
                        logger.info("追加：" + exists + "--" + fileName);
                    } catch (IOException e) {
                        e.printStackTrace();
                    } finally {
                        if (writer != null) {
                            writer.close();
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


}

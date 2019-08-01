package com.talkingdata.analytics.wifi.collector.control;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talkingdata.analytics.wifi.collector.config.FilterMacConfig;
import com.talkingdata.analytics.wifi.collector.counter.ApmacHeartCounter;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;
import com.talkingdata.analytics.wifi.collector.util.MacWhiteListUtil;
import com.talkingdata.analytics.wifi.collector.util.Rssi5GTo2d4G;
import com.talkingdata.analytics.wifi.collector.util.ServletGzipUtil;
import org.apache.commons.fileupload.FileItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Calculationfile {
    private static final Logger errorLogger = LoggerFactory.getLogger("error");
    private static final Logger wifidataLogger = LoggerFactory.getLogger("wifidata");
	private static final Logger dataLogger = LoggerFactory.getLogger("data");
	private static final Logger logger = LoggerFactory.getLogger(Calculationfile.class);
    private static ExecutorService threadpool = Executors.newFixedThreadPool(10);
    private static MacWhiteListUtil macWhiteListUtil = MacWhiteListUtil.getInstance();
	//json格式化
	private static ObjectMapper JSON_MAPPER = new ObjectMapper();

    private static ConcurrentLinkedQueue<FileItem> queue = new ConcurrentLinkedQueue<FileItem>(); // 消息队列
    
    private static ConcurrentLinkedQueue<File> lastqueue = new ConcurrentLinkedQueue<File>(); // 消息队列
    
    
    public static boolean collectorfile(FileItem file){
    	try{
    		queue.add(file);
    		threadpool.execute(new Save());
    	}catch(Exception exception){
    		errorLogger.error("文件添加失败！ "+exception);
    		return false;
    	}
		return true;
    }
    
    public static boolean checkmissfile(File file){
    	try{
    		lastqueue.add(file);
    		threadpool.execute(new Savelast());
    	}catch(Exception exception){
    		errorLogger.error("文件添加失败！ "+exception);
    		return false;
    	}
		return true;
    }
    
    
    public static class Save implements Runnable{
		@Override
		public void run() {
			try{
			if (!queue.isEmpty()) {
				FileItem next = queue.poll();
				if (next!=null) {
					wifidataLogger.info("filename="+next.getName());
					InputStream inputStream;
					BufferedReader br ;
					inputStream = next.getInputStream();
					BufferedInputStream gzipfile = ServletGzipUtil.isGzipfile(inputStream);
					br = new BufferedReader(new InputStreamReader(gzipfile, "utf8"));
					String line;
					HashMap<String, String> hashMap = new HashMap<>();
					while((line=br.readLine())!=null){
						try{
							wifidataLogger.info(next.getName()+"=="+line);
							//解析文件内容
							String[] split = line.split(" ");
							if (split.length<5) {
								errorLogger.error("单行数据格式错误！filename="+next.getName()+";line="+line);
								continue;
							}
							String ts = split[0];
							String apmac = split[1];
							String mac = split[2];
							String rssi = split[3];
							String frequency = split[4];
							if (ts.length()==10) {
								ts+="000";
							}
							if ("5G".equals(frequency)) {
								String newrssi=Rssi5GTo2d4G.changeRssi5To2d4(rssi);
//								logger.debug("信号转换,5G信号"+rssi+",转换为2.4G信号"+newrssi);
								rssi=newrssi;
							}
							String replaceAll = mac.replaceAll(":", "");
							
							//过滤
							if (FilterMacConfig.isOn() &&!macWhiteListUtil.contains(replaceAll.substring(0, 6))) {
								continue;
							}
							
							//合并信号强度
							String key = ts+","+apmac+","+mac;
							String rssis= hashMap.get(key);
							if (rssis==null) {
								rssis=rssi;
							}else{
								rssis+=";"+rssi;
							}
							hashMap.put(key, rssis);
						}catch(Exception e){
							errorLogger.error(next.getName()+"处理数据失败 --- ", e);
							br.close();
							return;
						}
					}
					if (br!=null) {
						br.close();
					}
					merge(hashMap);
					next.delete();
					logger.debug("临时文件被删除"+ next.getName());
			}
		}
    	
		}catch(Exception exception){
			errorLogger.error("未知错误，数据处理失败",exception);
		}
		}

		private void merge(HashMap<String, String> hashMap) {
			//合并相同时间戳和APmac为一条
			HashMap<String, ArrayList<WifiTa>> apmacmap = new HashMap<>();
			Iterator<Entry<String, String>> iterator = hashMap.entrySet().iterator();
			while(iterator.hasNext()){
				Entry<String, String> ffe = iterator.next();
				String[] split = ffe.getKey().split(",");
				String key = split[0]+","+split[1];
				ArrayList<WifiTa> arrayList = apmacmap.get(key);
				if (arrayList==null) {
					arrayList = new ArrayList<WifiTa>();
				}
				WifiTa wifiTa = new WifiTa();
				wifiTa.setMac(split[2]);
				wifiTa.setRssi(ffe.getValue());
				arrayList.add(wifiTa);
				apmacmap.put(key, arrayList);
			}
			//发送数据
			Iterator<Entry<String, ArrayList<WifiTa>>> ite = apmacmap.entrySet().iterator();
			while(ite.hasNext()){
				try {
					Entry<String, ArrayList<WifiTa>> next2 = ite.next();
					String[] split = next2.getKey().split(",");
					
					WiFiDataEntity wiFiDataEntity = new WiFiDataEntity();
					wiFiDataEntity.setDevtype("001");
					wiFiDataEntity.setTsreceive(System.currentTimeMillis());
					
					WifiData wifiData = new WifiData();
					wifiData.setApmac(split[1]);
					wifiData.setTssend(Long.parseLong(split[0]));
					
					wifiData.setWifitalist(next2.getValue());
					wiFiDataEntity.setWifidata(wifiData);
					
					logger.debug("Get standard data : " + wiFiDataEntity);
					
					//写出数据
					
	                WifiData wifidata = wiFiDataEntity.getWifidata();
	                String apmac = wifidata.getApmac();
	                String replaceAll = apmac.replaceAll(":", "");
	                List<WifiTa> wifitalist = wifidata.getWifitalist();
	                if (wifitalist!=null && wifitalist.size()>0 && replaceAll!=null) {
	                	ApmacHeartCounter.collector(replaceAll+","+wifitalist.size()+","+wiFiDataEntity.getTsreceive());
					}

					//同时写入dataLogger
					String jsonData = JSON_MAPPER.writeValueAsString(wiFiDataEntity);
					dataLogger.info(jsonData);

					AsyncProcesser.getInstance().in(wiFiDataEntity);
					if (Valve.isOn()) {
						AsyncProcesser.getInstance().out();
					}
					
				} catch (Exception e) {
					errorLogger.error("未知错误，数据处理失败",e);
				}
			}
		}
    }
    
    public static class Savelast implements Runnable{
		@Override
		public void run() {
			try{
			if (!lastqueue.isEmpty()) {
				File next = lastqueue.poll();
				if (next!=null) {
					wifidataLogger.info("filename="+next.getName());
					logger.debug("开始处理上次未完场的数据filename="+next.getName());
					BufferedReader br ;
					FileInputStream fileInputStream = new FileInputStream(next);
					BufferedInputStream gzipfile = ServletGzipUtil.isGzipfile(fileInputStream);
					br = new BufferedReader(new InputStreamReader(gzipfile, "utf8"));
					String line;
					HashMap<String, String> hashMap = new HashMap<>();
					while((line=br.readLine())!=null){
						try{
							wifidataLogger.info(next.getName()+"=="+line);
							//解析文件内容
							String[] split = line.split(" ");
							if (split.length<5) {
								errorLogger.error("单行数据格式错误！filename="+next.getName()+";line="+line);
								continue;
							}
							String ts = split[0];
							String apmac = split[1];
							String mac = split[2];
							String rssi = split[3];
							String frequency = split[4];
							if (ts.length()==10) {
								ts+="000";
							}
							if ("5G".equals(frequency)) {
								String newrssi=Rssi5GTo2d4G.changeRssi5To2d4(rssi);
								logger.debug("信号转换,5G信号"+rssi+",转换为2.4G信号"+newrssi);
								rssi=newrssi;
							}
							String replaceAll = mac.replaceAll(":", "");
							
							//过滤
							if (FilterMacConfig.isOn() &&!macWhiteListUtil.contains(replaceAll.substring(0, 6))) {
								continue;
							}
							
							String key = ts+","+apmac+","+mac;
							String rssis= hashMap.get(key);
							if (rssis==null) {
								rssis=rssi;
							}else{
								rssis+=";"+rssi;
							}
							hashMap.put(key, rssis);
						}catch(Exception e){
							errorLogger.error(next.getName()+"处理数据失败 --- ", e);
							br.close();
							return;
						}
					}
					if (br!=null) {
						br.close();
					}
					
					HashMap<String, ArrayList<WifiTa>> apmacmap = new HashMap<>();
					Iterator<Entry<String, String>> iterator = hashMap.entrySet().iterator();
					while(iterator.hasNext()){
						Entry<String, String> ffe = iterator.next();
						String[] split = ffe.getKey().split(",");
						String key = split[0]+","+split[1];
						ArrayList<WifiTa> arrayList = apmacmap.get(key);
						if (arrayList==null) {
							arrayList = new ArrayList<WifiTa>();
						}
						WifiTa wifiTa = new WifiTa();
						wifiTa.setMac(split[2]);
						wifiTa.setRssi(ffe.getValue());
						arrayList.add(wifiTa);
						apmacmap.put(key, arrayList);
					}
					
					Iterator<Entry<String, ArrayList<WifiTa>>> ite = apmacmap.entrySet().iterator();
					while(ite.hasNext()){
						try {
							
							Entry<String, ArrayList<WifiTa>> next2 = ite.next();
							String[] split = next2.getKey().split(",");
							
							
							WiFiDataEntity wiFiDataEntity = new WiFiDataEntity();
							wiFiDataEntity.setDevtype("001");
							wiFiDataEntity.setTsreceive(System.currentTimeMillis());
							
							WifiData wifiData = new WifiData();
							wifiData.setApmac(split[1]);
							wifiData.setTssend(Long.parseLong(split[0]));
							
							wifiData.setWifitalist(next2.getValue());
							wiFiDataEntity.setWifidata(wifiData);
							
//							logger.debug("Get standard data : " + wiFiDataEntity);
							
							//写出数据
							
							AsyncProcesser.getInstance().in(wiFiDataEntity);
							if (Valve.isOn()) {
								AsyncProcesser.getInstance().out();
							}
							
						} catch (Exception e) {
							errorLogger.error("未知错误，数据处理失败",e);
						}
					}
					next.delete();
					logger.debug("临时文件被删除"+ next.getName());
			}
		}
    	
		}catch(Exception exception){
			errorLogger.error("未知错误，数据处理失败",exception);
		}
		}
    	
    	
    }
    
    
    
    
}

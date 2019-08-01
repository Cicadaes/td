package com.talkingdata.analytics.wifi.collector.processor.impl;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.talkingdata.analytics.wifi.collector.config.Configuration;
import com.talkingdata.analytics.wifi.collector.control.AsyncProcesser;
import com.talkingdata.analytics.wifi.collector.control.Calculationfile;
import com.talkingdata.analytics.wifi.collector.control.Valve;
import com.talkingdata.analytics.wifi.collector.counter.ApmacHeartCounter;
import com.talkingdata.analytics.wifi.collector.databean.TaEvent;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;
import com.talkingdata.analytics.wifi.collector.exception.UnZipDataException;
import com.talkingdata.analytics.wifi.collector.processor.Processor;
import com.talkingdata.analytics.wifi.collector.servlet.response.ResponseEntity;
import com.talkingdata.analytics.wifi.collector.util.Codeconvert;
import com.talkingdata.analytics.wifi.collector.util.LocalInfor;
import com.talkingdata.analytics.wifi.collector.util.MacWhiteListUtil;
import com.talkingdata.analytics.wifi.collector.util.ServletGzipUtil;

import net.sf.json.JSONObject;

/**
 * Created by loong on 4/15/16.
 */
public class RequestProcessor implements Processor {
    private static final Logger errorLogger = LoggerFactory.getLogger("error");
    private static final Logger offlineLogger = LoggerFactory.getLogger("offline");
    private static final Logger dataLogger = LoggerFactory.getLogger("data");
    private static final Logger logger = LoggerFactory.getLogger(RequestProcessor.class);
    private static final int BUFFER_SIZE = 1024;
//    private static final String OFFLINE = "offline:";
    private boolean isInit = false;
    private static MacWhiteListUtil macWhiteListUtil = MacWhiteListUtil.getInstance();
    private static String tmpFileDir = Configuration.get("tmp_file_dir");
    //json格式化
    private static ObjectMapper JSON_MAPPER = new ObjectMapper();
    @SuppressWarnings("rawtypes")
	public static Map<String, Class> classMap = new HashMap<String, Class>();
    static {
		classMap.put("wifitalist", WifiTa.class);
		classMap.put("taevent", TaEvent.class);
		
		if (tmpFileDir!=null && !"".equals(tmpFileDir)) {
			File file = new File(tmpFileDir);
			if (!file.exists()) {
				file.mkdirs();
			}
		}
	}

    @Override
    public void processWiFiData(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        processData(req, resp,false);
    }

    @Override
    public void processNewWiFiData(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    	processFileData(req, resp);
    }

    @Override
    public void processOfflineWiFiData(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        processData(req, resp,true);
    }


    /**
     * @param req           http request
     * @param resp          http response
     * @throws IOException
     */
    private void processData(HttpServletRequest req, HttpServletResponse resp,boolean isOffline) throws IOException {
        // 初始化设置
        setConfig(req);
        byte[] buffer;
        PrintWriter printWriter = ServletGzipUtil.createGzipPrintWriter(req, resp);
        String jsonsj = "";
        try {
            buffer = unZipData(req);
            if (buffer == null) {
                printWriter.write(ResponseEntity.NULL_REQ_EXCEPTION);
                throw new UnZipDataException("Unzip buffer is null!");
            }
            
            //====================================针对线下增强探针 标准格式的转换=========================
            String jsonString = new String(buffer);
            jsonsj = jsonString;
            JSONObject jsonObject =JSONObject.fromObject(jsonString);
    		Object object = jsonObject.get("wifidata");
    		if (object!=null) {
    			JSONObject fromObject = JSONObject.fromObject(object);
    			fromObject.remove("typeid");
    			Object remove2 = fromObject.remove("count");
    			if (remove2!=null) {
    				fromObject.put("num", remove2);
    			}
    			fromObject.remove("location");
    			jsonObject.put("wifidata", fromObject);
			}
    		//====================================针对线下增强探针 标准格式的转换=========================
            //记录log
            try {
            	WiFiDataEntity wiFiDataEntity = (WiFiDataEntity) JSONObject.toBean(jsonObject, WiFiDataEntity.class, classMap);
                //实时请求
            	if(isOffline == false){
                    //添加数据接收时间
                    wiFiDataEntity.setTsreceive(System.currentTimeMillis());
                }
                //counter计算
                WifiData wifidata = wiFiDataEntity.getWifidata();
                String apmac = wifidata.getApmac();
                String replaceAll = apmac.replaceAll(":", "");
                List<WifiTa> wifitalist = wifidata.getWifitalist();
                if (wifitalist != null && wifitalist.size()>0 && replaceAll!=null) {
                	ApmacHeartCounter.collector(replaceAll + "," + wifitalist.size() + "," + wiFiDataEntity.getTsreceive());
				}
                
                //过滤
                wiFiDataEntity = filterData(wiFiDataEntity);
                
                changeRssi(wiFiDataEntity);

                if(isOffline == false){
                    String jsonData = JSON_MAPPER.writeValueAsString(wiFiDataEntity);
                    dataLogger.info(jsonData);
                    logger.debug("Get standard data : " + wiFiDataEntity);
                }else { //离线请求
                    offlineLogger.info(jsonString);
                    logger.debug("Get offline data : " + wiFiDataEntity);
                }
                // 向后端发送数据
                AsyncProcesser.getInstance().in(wiFiDataEntity);
                if (Valve.isOn()) {
                    AsyncProcesser.getInstance().out();
                }
            } catch (Exception e) {
                errorLogger.error("Format data error : " ,e);
                ResponseEntity responseEntity = new ResponseEntity(ResponseEntity.FAILED_CODE, "Incorrect data format!");
                printWriter.write(responseEntity.toJsonString());
                printWriter.close();
                return;
            }
            printWriter.write(ResponseEntity.REQ_OK);
        } catch (Exception e) {
            errorLogger.error("Collector fatal error --- ", e);
            errorLogger.error("data="+jsonsj);
            errorLogger.info("=======================================================================================================");
            ResponseEntity responseEntity = new ResponseEntity(ResponseEntity.FAILED_CODE, "Service error!");
            printWriter.write(responseEntity.toJsonString());
        } finally {
            assert printWriter != null;
            printWriter.close();
        }
    }
    /**
     * 针对 TD标准格式的rssi信号，把信号值转换成负值
     * @param wiFiDataEntity
     */
    private void changeRssi(WiFiDataEntity wiFiDataEntity) {
    	WifiData wifidata = wiFiDataEntity.getWifidata();
    	if (wifidata!=null) {
    		List<WifiTa> wifitalist = wifidata.getWifitalist();
    		if (wifitalist!=null && wifitalist.size()!=0) {
    			for (WifiTa wifiTa : wifitalist) {
    				String rssi = wifiTa.getRssi();
    				if (rssi!=null && !rssi.equals("")) {
						try{
							String[] split = rssi.split(";");
							String rssis= "";
							boolean needchange = false;
							for (int i = 0; i < split.length; i++) {
								int parseInt = Integer.parseInt(split[i]);
								if (parseInt>0) {
									needchange=true;
									int j = parseInt*-1;
									rssis+= j+"";
								}
								if ( i!=(split.length-1)) {
									rssis+=";";
								}
							}
							if (needchange) {
								wifiTa.setRssi(rssis);
							}
						}catch(NumberFormatException e){
							logger.error("collector数据，数字转换异常",e);
						}
					}
				}
    		}
		}
	}
    
    private void processFileData(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // 初始化设置
    	setConfig(req);
    	PrintWriter printWriter = resp.getWriter();
//    	PrintWriter printWriter = ServletGzipUtil.createGzipPrintWriter(req, resp);
    	DiskFileItemFactory diskFileItemFactory = new DiskFileItemFactory();
    	if (tmpFileDir!=null && !"".equals(tmpFileDir)) {
    		diskFileItemFactory.setRepository(new File(tmpFileDir));
		}
    	diskFileItemFactory.setFileCleaningTracker(null);
    	ServletFileUpload upload = new ServletFileUpload(diskFileItemFactory);
    	try {
			List<FileItem> parseRequest = upload.parseRequest(req);
			Iterator<FileItem> iterator = parseRequest.iterator();
			while(iterator.hasNext()){
				FileItem next = iterator.next();
				if (Calculationfile.collectorfile(next)) {
					logger.debug("接收文件成功，filename="+next.getName());
				}else{
					ResponseEntity responseEntity = new ResponseEntity(ResponseEntity.FAILED_CODE, "Service error!");
		            printWriter.write(responseEntity.toJsonString());
		            return;
				}
			}
			printWriter.write(ResponseEntity.REQ_OK);
		} catch (FileUploadException e1) {
			errorLogger.error("Collector fatal error --- ", e1);
			ResponseEntity responseEntity = new ResponseEntity(ResponseEntity.FAILED_CODE, "Service error!");
            printWriter.write(responseEntity.toJsonString());
		}catch (Exception e) {
			errorLogger.error("Collector fatal big error --- ", e);
			ResponseEntity responseEntity = new ResponseEntity(ResponseEntity.FAILED_CODE, "Service error!");
            printWriter.write(responseEntity.toJsonString());
		}finally {
            assert printWriter != null;
            printWriter.close();
        }
    }

    /**
     * 根据某些规则过滤数据
     *
     * @param wiFiDataEntity
     * @return
     */
    private WiFiDataEntity filterData(WiFiDataEntity wiFiDataEntity) {
        List<WifiTa> wList = wiFiDataEntity.getWifidata().getWifitalist();
        Iterator<WifiTa> it = wList.iterator();
        while (it.hasNext()) {
            WifiTa wifiTa = it.next();

            if(null !=  wifiTa.getMac()) {
                //mac全部转换小写，不区分大小写
                String macLowered = wifiTa.getMac().toLowerCase();
                wifiTa.setMac(macLowered);
            }
//            //过滤mac白名单
//            if (FilterMacConfig.isOn() && !macWhiteListUtil.contains(macLowered.substring(0, 6))) {
//                it.remove();
//                continue;
//            }
//            //其他过滤
//            if (wifiTa.getMac() == null && wifiTa.getTaevent().size() > 0) {
//                it.remove();
//            }
        }
        wiFiDataEntity.getWifidata().setWifitalist(wList);
        return wiFiDataEntity;
    }


    private byte[] unZipData(HttpServletRequest req) {
        byte[] buffer = new byte[BUFFER_SIZE];
        BufferedInputStream buf = null;
        try {
        	buf = ServletGzipUtil.isGzipRequest(req);
            ByteArrayOutputStream bao = new ByteArrayOutputStream();
            int len;
            while ((len = buf.read(buffer)) != -1) {
                bao.write(buffer, 0, len);
            }
            bao.close();
            buf.close();
            return bao.toByteArray();
        } catch (Exception e) {
            errorLogger.error("Socket fatal error:[" + e.getMessage() + "] raw buffer:["
                    + Codeconvert.ByteToStr(buffer, 0, buffer.length) + "]");
            return null;
        } finally {
            try {
                assert buf != null;
                buf.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void setConfig(HttpServletRequest req) {
        if (!this.isInit) {
            // 获得本机信息
            LocalInfor.setInfor(req.getLocalName(), req.getLocalPort(), System.getProperty("user.dir"));

            // 修改文件路径
            int port = LocalInfor.localport;
            String Host = LocalInfor.localip;
            Host.replaceAll(".", "_");
            System.clearProperty("WORKDIR");
            System.setProperty("WORKDIR", "_" + Host + "_" + port);
            this.isInit = true;
        }
    }

}

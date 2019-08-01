package com.talkingdata.analytics.wifi.collector.util;

import com.talkingdata.analytics.wifi.collector.config.Configuration;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by loong on 4/22/16.
 */
public class MacWhiteListUtil {
	
	private static final Logger logger = LoggerFactory.getLogger(MacWhiteListUtil.class);
	
    private static MacWhiteListUtil macWhiteListUtil = null;
    private static List<String> whiteList;

    private MacWhiteListUtil() {
    }

    public static MacWhiteListUtil getInstance() {
        if (macWhiteListUtil == null) {
            macWhiteListUtil = new MacWhiteListUtil();
        }
        return macWhiteListUtil;
    }

    private void loadFile() {
        whiteList = new ArrayList<String>();
//        InputStream input = this.getClass().getResourceAsStream("/mac.txt");
//        BufferedReader reader = new BufferedReader(new InputStreamReader(input));
        FileReader fileReader = null;
        BufferedReader bufferedReader = null;
        try {
        	String filePath = Configuration.get("mac_file");
        	File file = new File(filePath);
        	if(file.exists() && file.isFile()){
        		 logger.info("load mac info from file:" + filePath);
        		 fileReader = new FileReader(file);
        		 bufferedReader = new BufferedReader(fileReader);
        	}else{
        		 logger.info("load mac info from class path mac.txt" );
        		 InputStream input = this.getClass().getResourceAsStream("/mac.txt");
        		 bufferedReader = new BufferedReader(new InputStreamReader(input));
        	}
            String line;
            while ((line = bufferedReader.readLine()) != null) {
            	//白名单mac全部转换小写，不区分大小写
                whiteList.add(line.toLowerCase());
            }
            if(whiteList.isEmpty()){
            	 logger.error("White mac list is empty ! Config error!",new RuntimeException("White mac list is empty ! Config error!"));
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
            	 if( fileReader != null ){
                  	fileReader.close();
                  }
                  if(bufferedReader != null){
                  	bufferedReader.close();
                  }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }


    public boolean contains(String mac) {
        if (whiteList == null) {
            loadFile();
        }
        return whiteList.contains(mac);
    }
}

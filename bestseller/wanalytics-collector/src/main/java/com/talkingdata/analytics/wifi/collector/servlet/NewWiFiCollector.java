package com.talkingdata.analytics.wifi.collector.servlet;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.talkingdata.analytics.wifi.collector.config.Configuration;
import com.talkingdata.analytics.wifi.collector.control.Calculationfile;
import com.talkingdata.analytics.wifi.collector.processor.Processor;
import com.talkingdata.analytics.wifi.collector.processor.impl.RequestProcessor;

/**
 * Created by loong on 4/13/16.
 */
public class NewWiFiCollector extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static Processor processor = new RequestProcessor();

	private static final Logger errorLogger = LoggerFactory.getLogger("error");
	@Override
	public void init() throws ServletException {
		try{
			String tmpFileDir = Configuration.get("tmp_file_dir");
			if (tmpFileDir!=null && !"".equals(tmpFileDir)) {
				File file = new File(tmpFileDir);
				if (!file.exists()) {
					file.mkdirs();
				}
				File[] listFiles = file.listFiles();
				if (listFiles.length>0) {
					for (File file2 : listFiles) {
						Calculationfile.checkmissfile(file2);
					}
				}
			}
		}catch(Exception e){
			errorLogger.error("处理残留数据失败！");
		}
		super.init();
	}
	
	
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processor.processNewWiFiData(req, resp);
    }


}

package com.talkingdata.analytics.wifi.collector.servlet;

import com.talkingdata.analytics.wifi.collector.processor.Processor;
import com.talkingdata.analytics.wifi.collector.processor.impl.RequestProcessor;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * junmin.li 处理离线请求
 */
public class OfflineWiFiCollector extends HttpServlet {
    private static Processor processor = new RequestProcessor();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processor.processOfflineWiFiData(req, resp);
    }


}

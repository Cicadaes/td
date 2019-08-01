package com.talkingdata.analytics.wifi.collector.servlet;

import com.talkingdata.analytics.wifi.collector.processor.Processor;
import com.talkingdata.analytics.wifi.collector.processor.impl.RequestProcessor;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by loong on 4/13/16.
 */
public class WiFiCollector extends HttpServlet {
    private static Processor processor = new RequestProcessor();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processor.processWiFiData(req, resp);
    }


}

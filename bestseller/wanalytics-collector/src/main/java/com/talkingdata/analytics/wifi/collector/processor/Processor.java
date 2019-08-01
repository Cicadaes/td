package com.talkingdata.analytics.wifi.collector.processor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by loong on 4/15/16.
 */
public interface Processor {

    /**
     * 处理wifi上传的标准格式数据
     *
     * @param req  http request
     * @param resp http response
     * @throws IOException
     */
    void processWiFiData(HttpServletRequest req, HttpServletResponse resp) throws IOException;

    /**
     * 处理线下上传的非标准格式数据
     *
     * @param req  http request
     * @param resp http response
     * @throws IOException
     */
	void processNewWiFiData(HttpServletRequest req, HttpServletResponse resp) throws IOException;


    /**
     * 处理离线wifi数据
     *
     * @param req  http request
     * @param resp http response
     * @throws IOException
     */
    void processOfflineWiFiData(HttpServletRequest req, HttpServletResponse resp) throws IOException;
}

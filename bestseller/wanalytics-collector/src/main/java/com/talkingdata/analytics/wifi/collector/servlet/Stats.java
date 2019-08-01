package com.talkingdata.analytics.wifi.collector.servlet;


import com.talkingdata.analytics.wifi.collector.fqueue.FSQueueManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Stats extends HttpServlet {

	private static final long serialVersionUID = -71436602305738582L;

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		System.out.println(req.getHeader("User-Agent"));
		PrintWriter out = resp.getWriter();
		out.write("recive fqueue size: " + FSQueueManager.getInstance().getWiFiReceiveFQueueSize());
		out.write("\r\n");
	}
	
}

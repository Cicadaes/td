package com.talkingdata.analytics.wifi.collector.servlet;

import com.talkingdata.analytics.wifi.collector.config.FilterMacConfig;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by loong on 6/27/16.
 */
public class FilterMacController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getParameter("action") != null) {
            int action = Integer.parseInt(req.getParameter("action"));
            switch (action) {
                case 0://获取当前开关状态
                    resp.getWriter().print(FilterMacConfig.isOn());
                    break;
                case 1://控制开关
                    if (req.getParameter("switch") != null) {
                        int switchStatus = Integer.parseInt(req.getParameter("switch"));
                        switch (switchStatus) {
                            case 0:
                                if (FilterMacConfig.isOn()) {
                                    FilterMacConfig.off();
                                }
                                break;
                            case 1:
                                if (!FilterMacConfig.isOn()) {
                                    FilterMacConfig.on();
                                }
                                break;
                        }
                        resp.getWriter().print("succ");
                    } else {
                        resp.getWriter().print("failed");
                    }
                    break;
            }
        } else {
            resp.getWriter().print("failed");
        }
    }
}

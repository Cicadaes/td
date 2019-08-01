package com.talkingdata.datacloud.web;

import java.io.IOException;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CrossOriginFilter implements Filter {

    public void init(FilterConfig filterConfig) throws ServletException {}

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse _response = (HttpServletResponse) response;

        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");
        _response.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
        _response.setHeader("Access-Control-Allow-Credentials", "true");
        _response.setHeader("Content-Type", "text/html;charset=utf-8");

        if ((request instanceof HttpServletRequest) && ((HttpServletRequest) request).getMethod().equals("OPTIONS")) {
            _response.setStatus(200);
            return;
        }

        chain.doFilter(request, response);
    }

    public void destroy() {}

}

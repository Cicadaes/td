package com.talkingdata.datacloud.util;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Ocean on 2016/11/23.
 */
public class AuthExcludeUrlFilter implements Filter {

    private List<String> excludeHosts;
    private List<RestPattern> excludeRestPattern;
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        excludeRestPattern = new ArrayList<>();
        excludeHosts = new ArrayList<>();
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            String resourcePath = this.getClass().getClassLoader().getResource("/").getPath();
            Document document = builder.parse(resourcePath + "auth.xml");

            //init exclude rest
            NodeList excludeRestChildNodes = document.getElementsByTagName("excludeRest");
            for (int i = 0; i < excludeRestChildNodes.getLength(); i++) {
                Node nNode = excludeRestChildNodes.item(i);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    String method = FilterUtil.processRequestPattern(eElement.getAttribute("method"));
                    String urlPattern = FilterUtil.processRequestPattern(eElement.getAttribute("urlPattern"));
                    excludeRestPattern.add(new RestPattern(method,urlPattern,null));
                }
            }
            //init exclude rest
            NodeList excludeHostChildNodes = document.getElementsByTagName("excludeHost");
            for (int i = 0; i < excludeHostChildNodes.getLength(); i++) {
                Node nNode = excludeHostChildNodes.item(i);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    String host = eElement.getAttribute("host");
                    excludeHosts.add(host);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest)request;
//        String host = httpServletRequest.getRemoteHost();
        String host = httpServletRequest.getServerName();
        String method = httpServletRequest.getMethod();
        String pathInfo =  httpServletRequest.getPathInfo();
        String servletPath = httpServletRequest.getServletPath();
        if(pathInfo != null){
            servletPath = servletPath + pathInfo;
        }
        for(RestPattern restPattern :excludeRestPattern) {
            if (FilterUtil.mapping(restPattern.restPath, servletPath) && FilterUtil.mapping(restPattern.restMethod,method)) {
                request.getRequestDispatcher(servletPath).forward(request, response);
                return;
            }
        }
        for(String requestHost :excludeHosts) {
            if (requestHost.equals(host)) {
                request.getRequestDispatcher(servletPath).forward(request, response);
                return;
            }
        }
        chain.doFilter(request,response);
    }

    @Override
    public void destroy() {

    }
}


package com.talkingdata.datacloud.visual.util;

import com.alibaba.fastjson.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Ocean on 2016/11/24.
 */
public class FilterUtil {

    /**
     * 匹配校验
     * @param excludePath
     * @param servletPath
     * @return
     */
    public static boolean mapping(String excludePath,String servletPath){
        Pattern pattern = Pattern.compile(excludePath);
        Matcher matcher = pattern.matcher(servletPath);
        boolean mapping = matcher.matches();
        return mapping;
    }

    /**
     * 前期处理pattern
     * @param urlPattern
     * @return
     */
    public static String processRequestPattern(String urlPattern){
        urlPattern = urlPattern.replaceAll("###","[0-9]+");
        urlPattern = urlPattern.replaceAll("\\*",".*");
        urlPattern = "^"+ urlPattern + "$";
        return urlPattern;
    }

    /**
     * 查找该url所需要的权限点
     * @param method
     * @param path
     * @param restPatternList
     * @return 权限点列表,用户有其中任一权限点均可
     */
    public static List<String> findRequiredCode(String method, String path, List<RestPattern> restPatternList){
        List<String> requiredCodeList = new ArrayList<>();
        for(RestPattern restPattern :restPatternList) {
            if (FilterUtil.mapping(restPattern.restPath, path) && FilterUtil.mapping(restPattern.restMethod, method)) {
                requiredCodeList.add(restPattern.privilegePoint);
            }
        }
        return requiredCodeList;
    }

    /**
     * 设置无权限时的response
     * @param response
     * @throws IOException
     */
    public static void setNoPrivilegeResponse(ServletResponse response) throws IOException {
        setNoPrivilegeResponse(response,"You have no privilege to access this page");
    }

    public static void setNoPrivilegeResponse(ServletResponse response,String msg) throws IOException {
        ((HttpServletResponse) response).setStatus(403);
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter writer = response.getWriter();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("status",403);
        jsonObject.put("msg", msg);
        writer.append(jsonObject.toString());
        writer.close();
    }

    public static void initRestPatternList(List<RestPattern> restPatternList, String workspaceAuth) {
        restPatternList.clear();
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            String resourcePath = FilterUtil.class.getClassLoader().getResource("/").getPath();
            Document document = builder.parse(resourcePath + "auth.xml");
            //init system auth
            NodeList childNodes = document.getElementsByTagName(workspaceAuth);
            for (int i = 0; i < childNodes.getLength(); i++) {
                Node nNode = childNodes.item(i);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    String urlPattern = eElement.getAttribute("urlPattern");
                    String methods = eElement.getAttribute("method");
                    String[] methodArray = methods.split(",");
                    String privilegePoints = eElement.getAttribute("privilegePoint");
                    String[] privilegePointArray = privilegePoints.split(",");
                    for(String method:methodArray){
                        for(String privilegePoint:privilegePointArray){
                            restPatternList.add(new RestPattern(FilterUtil.processRequestPattern(method),FilterUtil.processRequestPattern(urlPattern),privilegePoint));
                        }
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Integer getIdFromUrl(String url,String pattern){
        try{
            url = url.substring(url.indexOf(pattern)+pattern.length());
            if(url.indexOf("/")>0){
                url = url.substring(0,url.indexOf("/"));
            }
            return Integer.parseInt(url);
        }
        catch (Exception e){
            return null;
        }
    }

    public static boolean hasCookie(Cookie[] cookies, String cookieName) {
        for(Cookie cookie:cookies){
            if(cookie.getName().equals(cookieName)){
                return true;
            }
        }
        return false;
    }

}

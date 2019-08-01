package com.talkingdata.marketing.web.controller.admin;

import com.talkingdata.marketing.web.conf.SsoConf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("")
public class IndexController {

    @Autowired
    private SsoConf ssoConf;

    @RequestMapping("/index.jsp")
    public String index() {
        return "index";
    }

    @RequestMapping(value = "/cas", method = GET)
    @ResponseBody
    public Map getCasUrl() {
        HashMap<String, String> map = new HashMap<>(16);
        map.put("casServerLoginUrl",ssoConf.getCasServerLoginUrl());
        map.put("securityUrl",ssoConf.getSecurityUrl());
        return map;
    }

    @RequestMapping(value = "/checkCas", method = GET)
    @ResponseBody
    public Boolean checkCas() {
        return Boolean.TRUE;
    }
}

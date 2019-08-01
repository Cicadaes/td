package com.talkingdata.marketing.web.conf;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author chunyan.ji
 */
@Component
public class SsoConf {
    @Value("${sso.client.serverName}")
    private String serverName;
    @Value("${sso.client.casServer}")
    private String casServer;
    @Value("${sso.client.casServerLoginUrl}")
    private String casServerLoginUrl;
    @Value("${sso.client.casServerLogoutUrl}")
    private String casServerLogoutUrl;
    @Value("${sso.client.security}")
    private String securityUrl;
    @Value("${sso.client.enable}")
    private Boolean enable;

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getCasServer() {
        return casServer;
    }

    public void setCasServer(String casServer) {
        this.casServer = casServer;
    }

    public String getCasServerLoginUrl() {
        return casServerLoginUrl;
    }

    public void setCasServerLoginUrl(String casServerLoginUrl) {
        this.casServerLoginUrl = casServerLoginUrl;
    }

    public String getCasServerLogoutUrl() {
        return casServerLogoutUrl;
    }

    public void setCasServerLogoutUrl(String casServerLogoutUrl) {
        this.casServerLogoutUrl = casServerLogoutUrl;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public String getSecurityUrl() {
        return securityUrl;
    }

    public void setSecurityUrl(String securityUrl) {
        this.securityUrl = securityUrl;
    }
}

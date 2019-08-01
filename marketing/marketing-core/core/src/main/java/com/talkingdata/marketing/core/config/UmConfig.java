package com.talkingdata.marketing.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * The type Um config.
 * @author armeng
 */
@Component
public class UmConfig {
    @Value("${config.url}")
    private String url;
    @Value("${config.systemCode}")
    private String systemCode;

    /**
     * Gets url.
     *
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * Sets url.
     *
     * @param url the url
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Gets system code.
     *
     * @return the system code
     */
    public String getSystemCode() {
        return systemCode;
    }

    /**
     * Sets system code.
     *
     * @param systemCode the system code
     */
    public void setSystemCode(String systemCode) {
        this.systemCode = systemCode;
    }
}

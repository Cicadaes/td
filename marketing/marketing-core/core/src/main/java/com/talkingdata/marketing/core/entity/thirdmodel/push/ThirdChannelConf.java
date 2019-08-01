package com.talkingdata.marketing.core.entity.thirdmodel.push;

import java.util.Map;

/**
 * The type Third channel conf.
 * @author xiaoming.kang
 */
public class ThirdChannelConf {
    private String sourceName;
    private String channelKey;
    private String bindKey;
    private Map<String, String> bindValue;

    /**
     * Gets source name.
     *
     * @return the source name
     */
    public String getSourceName() {
        return sourceName;
    }

    /**
     * Sets source name.
     *
     * @param sourceName the source name
     */
    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    /**
     * Gets channel key.
     *
     * @return the channel key
     */
    public String getChannelKey() {
        return channelKey;
    }

    /**
     * Sets channel key.
     *
     * @param channelKey the channel key
     */
    public void setChannelKey(String channelKey) {
        this.channelKey = channelKey;
    }

    /**
     * Gets bind key.
     *
     * @return the bind key
     */
    public String getBindKey() {
        return bindKey;
    }

    /**
     * Sets bind key.
     *
     * @param bindKey the bind key
     */
    public void setBindKey(String bindKey) {
        this.bindKey = bindKey;
    }

    /**
     * Gets bind value.
     *
     * @return the bind value
     */
    public Map<String, String> getBindValue() {
        return bindValue;
    }

    /**
     * Sets bind value.
     *
     * @param bindValue the bind value
     */
    public void setBindValue(Map<String, String> bindValue) {
        this.bindValue = bindValue;
    }
}

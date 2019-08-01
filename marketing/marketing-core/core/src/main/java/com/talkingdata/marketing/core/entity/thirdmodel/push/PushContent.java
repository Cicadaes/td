package com.talkingdata.marketing.core.entity.thirdmodel.push;

import java.util.List;

/**
 * The type Push content.
 * 该类型不允许使用,与push的交互类
 * @author xiaoming.kang
 */
public class PushContent {
    private String app;
    private String os;
    private List<Message> messages;

    /**
     * Gets app.
     *
     * @return the app
     */
    public String getApp() {
        return app;
    }

    /**
     * Sets app.
     *
     * @param app the app
     */
    public void setApp(String app) {
        this.app = app;
    }

    /**
     * Gets os.
     *
     * @return the os
     */
    public String getOs() {
        return os;
    }

    /**
     * Sets os.
     *
     * @param os the os
     */
    public void setOs(String os) {
        this.os = os;
    }

    /**
     * Gets messages.
     *
     * @return the messages
     */
    public List<Message> getMessages() {
        return messages;
    }

    /**
     * Sets messages.
     *
     * @param messages the messages
     */
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}

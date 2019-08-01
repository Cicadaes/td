package com.talkingdata.marketing.core.entity.thirdmodel.push;

/**
 * The type Product sync req.
 * @author xiaoming.kang
 */
public class ProductSyncReq {
    private String appid;
    private String appname;
    private String source;
    private String pid;

    /**
     * Gets appid.
     *
     * @return the appid
     */
    public String getAppid() {
        return appid;
    }

    /**
     * Sets appid.
     *
     * @param appid the appid
     */
    public void setAppid(String appid) {
        this.appid = appid;
    }

    /**
     * Gets appname.
     *
     * @return the appname
     */
    public String getAppname() {
        return appname;
    }

    /**
     * Sets appname.
     *
     * @param appname the appname
     */
    public void setAppname(String appname) {
        this.appname = appname;
    }

    /**
     * Gets source.
     *
     * @return the source
     */
    public String getSource() {
        return source;
    }

    /**
     * Sets source.
     *
     * @param source the source
     */
    public void setSource(String source) {
        this.source = source;
    }

    /**
     * Gets pid.
     *
     * @return the pid
     */
    public String getPid() {
        return pid;
    }

    /**
     * Sets pid.
     *
     * @param pid the pid
     */
    public void setPid(String pid) {
        this.pid = pid;
    }
}

package com.talkingdata.marketing.core.entity.thirdmodel.push;

/**
 * The type Push stat model.
 * @author xiaoming.kang
 */
public class PushStatModel {
    private Integer sent;
    private Integer receive;
    private Integer show;
    private Integer read;

    /**
     * Gets sent.
     *
     * @return the sent
     */
    public Integer getSent() {
        return sent;
    }

    /**
     * Sets sent.
     *
     * @param sent the sent
     */
    public void setSent(Integer sent) {
        this.sent = sent;
    }

    /**
     * Gets receive.
     *
     * @return the receive
     */
    public Integer getReceive() {
        return receive;
    }

    /**
     * Sets receive.
     *
     * @param receive the receive
     */
    public void setReceive(Integer receive) {
        this.receive = receive;
    }

    /**
     * Gets show.
     *
     * @return the show
     */
    public Integer getShow() {
        return show;
    }

    /**
     * Sets show.
     *
     * @param show the show
     */
    public void setShow(Integer show) {
        this.show = show;
    }

    /**
     * Gets read.
     *
     * @return the read
     */
    public Integer getRead() {
        return read;
    }

    /**
     * Sets read.
     *
     * @param read the read
     */
    public void setRead(Integer read) {
        this.read = read;
    }
}

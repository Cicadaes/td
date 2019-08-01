package com.talkingdata.marketing.core.vo.push;

/**
 *
 * @author armeng
 * @date 2018/01/03
 */
public class SmsPushData extends AbstractPushData {

    private String content;

    private String channelNumber;

    private String sign;

    /**
     * Gets content.
     *
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * Sets content.
     *
     * @param content the content
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * Gets channel number.
     *
     * @return the channel number
     */
    public String getChannbelNumber() {
        return channelNumber;
    }

    /**
     * Sets channel number.
     *
     * @param channelNumber the channel number
     */
    public void setChannelNumber(String channelNumber) {
        this.channelNumber = channelNumber;
    }


    /**
     * Gets sign.
     *
     * @return the sign
     */
    public String getSign() {
        return sign;
    }

    /**
     * Sets sign.
     *
     * @param sign the sign
     */
    public void setSign(String sign) {
        this.sign = sign;
    }
}

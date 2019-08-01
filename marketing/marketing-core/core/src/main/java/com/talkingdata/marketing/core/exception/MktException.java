package com.talkingdata.marketing.core.exception;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * The type Mkt exception.
 * @author xiaoming.kang
 */
public class MktException extends Exception {

    private Integer retCode;

    private String msgDes;

    /**
     * Instantiates a new Mkt exception.
     *
     * @param msgDes the msg des
     */
    public MktException(String msgDes) {
        this(Code.MIDDLE_PART.getCode(), msgDes);
    }

    /**
     * The enum Code.
     */
    public enum Code {

        /**
         * Right top code.
         */
//显示在右上角
        RIGHT_TOP (4000),
        /**
         * Middle part code.
         */
//显示中间部分
        MIDDLE_PART(4300);

        Code(int code) {
            this.code = code;
        }

        /**
         * The Code.
         */
        Integer code;

        /**
         * Gets code.
         *
         * @return the code
         */
        public Integer getCode() {
            return this.code;
        }
    }

    /**
     * Instantiates a new Mkt exception.
     *
     * @param code   the code
     * @param msgDes the msg des
     */
    public MktException(Code code, String msgDes) {
        this(code.getCode(), msgDes);
    }

    /**
     * Instantiates a new Mkt exception.
     *
     * @param retCode the ret code
     * @param msgDes  the msg des
     */
    public MktException(Integer retCode, String msgDes) {
        super(new StringBuilder("")
                .append("retCode=" +retCode)
                .append(",")
                .append("msgDes=" + msgDes)
                .toString());
        this.retCode = retCode;
        this.msgDes = msgDes;
    }

    /**
     * Gets ret code.
     *
     * @return the ret code
     */
    public Integer getRetCode() {
        return retCode;
    }

    /**
     * Sets ret code.
     *
     * @param retCode the ret code
     */
    public void setRetCode(Integer retCode) {
        this.retCode = retCode;
    }

    /**
     * Gets msg des.
     *
     * @return the msg des
     */
    public String getMsgDes() {
        return msgDes;
    }

    /**
     * Sets msg des.
     *
     * @param msgDes the msg des
     */
    public void setMsgDes(String msgDes) {
        this.msgDes = msgDes;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("retCode", retCode)
                .append("msgDes", msgDes)
                .toString();
    }
}

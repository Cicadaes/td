package com.talkingdata.marketing.batch.es;

/**
 * ES异常类型
 *
 * @author hongsheng
 * @create 2017-11-24-下午4:25
 * @since JDK 1.8
 */
public class EsException extends Exception {

    public EsException() {
        super();
    }

    public EsException(String message) {
        super(message);
    }

    public EsException(String message, Throwable cause) {
        super(message, cause);
    }
}

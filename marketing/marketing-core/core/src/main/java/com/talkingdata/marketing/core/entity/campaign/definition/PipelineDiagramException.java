package com.talkingdata.marketing.core.entity.campaign.definition;

/**
 * PIPELINE异常
 * @author tao.yang
 * @create 2017 -08-29-上午11:48
 * @since JDK 1.8
 */
public class PipelineDiagramException extends Exception {


    /**
     * Instantiates a new Pipeline diagram exception.
     */
    public PipelineDiagramException() {
    }

    /**
     * Instantiates a new Pipeline diagram exception.
     *
     * @param message the message
     */
    public PipelineDiagramException(String message) {
        super(message);
    }

    /**
     * Instantiates a new Pipeline diagram exception.
     *
     * @param message the message
     * @param cause   the cause
     */
    public PipelineDiagramException(String message, Throwable cause) {
        super(message, cause);
    }
}

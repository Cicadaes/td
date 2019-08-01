package com.talkingdata.marketing.streaming.pipeline.exception;

/**
 * PIPELINE EXCEPTION
 * @create 2017-08-29-上午11:48
 * @since JDK 1.8
 * @author sheng.hong
 */
public class PipelineDiagramException extends Exception {


    public PipelineDiagramException() {
    }

    public PipelineDiagramException(String message) {
        super(message);
    }

    public PipelineDiagramException(String message, Throwable cause) {
        super(message, cause);
    }
}

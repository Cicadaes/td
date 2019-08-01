package com.talkingdata.marketing.batch.bean;

/**
 * @author Created by tend on 2017/11/22.
 */
public class BatchProcessDetailWrapper {

    private BatchProcessDetail processDetail;
    /**
     * 在查询时，当前批次查询的结束毫秒值
     */
    private Long timeMillis;

    public BatchProcessDetailWrapper(BatchProcessDetail processDetail, Long timeMillis) {
        this.processDetail = processDetail;
        this.timeMillis = timeMillis;
    }

    public BatchProcessDetail getProcessDetail() {
        return processDetail;
    }

    public void setProcessDetail(BatchProcessDetail processDetail) {
        this.processDetail = processDetail;
    }

    public Long getTimeMillis() {
        return timeMillis;
    }

    public void setTimeMillis(Long timeMillis) {
        this.timeMillis = timeMillis;
    }
}

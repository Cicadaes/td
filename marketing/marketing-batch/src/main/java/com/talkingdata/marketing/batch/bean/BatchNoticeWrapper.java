package com.talkingdata.marketing.batch.bean;


import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;

/**
 * BatchNotice包装类
 *
 * @author hongsheng
 * @create 2017-11-22-下午4:29
 * @since JDK 1.8
 */
public class BatchNoticeWrapper{

    /**
     * 通知
     */
    private BatchNotice batchNotice;
    /**
     * ES第一次查询时间，毫秒值
     */
    private Long time;
    /**
     * 循环标志(true-是，false-不是)
     */
    private Boolean cycleFlag;
    /**
     * 通知数据
     */
    private AbstractNodeDefinition nodeDefinition;

    public BatchNoticeWrapper() {}

    public BatchNoticeWrapper(BatchNotice batchNotice, Long time, Boolean cycleFlag, AbstractNodeDefinition nodeDefinition) {
        this.batchNotice = batchNotice;
        this.time = time;
        this.cycleFlag = cycleFlag;
        this.nodeDefinition = nodeDefinition;
    }

    public BatchNotice getBatchNotice() {
        return batchNotice;
    }

    public void setBatchNotice(BatchNotice batchNotice) {
        this.batchNotice = batchNotice;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public Boolean getCycleFlag() {
        return cycleFlag;
    }

    public void setCycleFlag(Boolean cycleFlag) {
        this.cycleFlag = cycleFlag;
    }

    public AbstractNodeDefinition getNodeDefinition() {
        return nodeDefinition;
    }

    public void setNodeDefinition(AbstractNodeDefinition nodeDefinition) {
        this.nodeDefinition = nodeDefinition;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("BatchNoticeWrapper{");
        sb.append("batchNotice=").append(batchNotice);
        sb.append(", time=").append(time);
        sb.append(", cycleFlag=").append(cycleFlag);
        sb.append('}');
        return sb.toString();
    }
}

package com.talkingdata.marketing.core.entity.dto;

import java.math.BigDecimal;

/**
 * The type Campaign stat dto.
 * @author xiaoming.kang
 */
public class CampaignStatDto {
    private int total;
    private int finish;
    private int inProgress;
    private int notStart;

    private BigDecimal finishPercent;
    private BigDecimal inProgressPercent;
    private BigDecimal notStartPercent;

    /**
     * Gets total.
     *
     * @return the total
     */
    public int getTotal() {
        return total;
    }

    /**
     * Sets total.
     *
     * @param total the total
     */
    public void setTotal(int total) {
        this.total = total;
    }

    /**
     * Gets finish.
     *
     * @return the finish
     */
    public int getFinish() {
        return finish;
    }

    /**
     * Sets finish.
     *
     * @param finish the finish
     */
    public void setFinish(int finish) {
        this.finish = finish;
    }

    /**
     * Gets in progress.
     *
     * @return the in progress
     */
    public int getInProgress() {
        return inProgress;
    }

    /**
     * Sets in progress.
     *
     * @param inProgress the in progress
     */
    public void setInProgress(int inProgress) {
        this.inProgress = inProgress;
    }

    /**
     * Gets not start.
     *
     * @return the not start
     */
    public int getNotStart() {
        return notStart;
    }

    /**
     * Sets not start.
     *
     * @param notStart the not start
     */
    public void setNotStart(int notStart) {
        this.notStart = notStart;
    }

    /**
     * Gets finish percent.
     *
     * @return the finish percent
     */
    public BigDecimal getFinishPercent() {
        return finishPercent;
    }

    /**
     * Sets finish percent.
     *
     * @param finishPercent the finish percent
     */
    public void setFinishPercent(BigDecimal finishPercent) {
        this.finishPercent = finishPercent;
    }

    /**
     * Gets in progress percent.
     *
     * @return the in progress percent
     */
    public BigDecimal getInProgressPercent() {
        return inProgressPercent;
    }

    /**
     * Sets in progress percent.
     *
     * @param inProgressPercent the in progress percent
     */
    public void setInProgressPercent(BigDecimal inProgressPercent) {
        this.inProgressPercent = inProgressPercent;
    }

    /**
     * Gets not start percent.
     *
     * @return the not start percent
     */
    public BigDecimal getNotStartPercent() {
        return notStartPercent;
    }

    /**
     * Sets not start percent.
     *
     * @param notStartPercent the not start percent
     */
    public void setNotStartPercent(BigDecimal notStartPercent) {
        this.notStartPercent = notStartPercent;
    }
}

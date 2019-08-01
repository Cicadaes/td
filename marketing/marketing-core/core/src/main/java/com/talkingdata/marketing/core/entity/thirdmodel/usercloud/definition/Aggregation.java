package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;

/**
 * The type Aggregation.
 * @author xiaoming.kang
 */
public class Aggregation implements Serializable {

    private AggregationField count;
    private AggregationField sum;
    private AggregationField min;
    private AggregationField max;
    private AggregationField avg;

    /**
     * Gets count.
     *
     * @return the count
     */
    public AggregationField getCount() {
        return count;
    }

    /**
     * Sets count.
     *
     * @param count the count
     */
    public void setCount(AggregationField count) {
        this.count = count;
    }

    /**
     * Gets sum.
     *
     * @return the sum
     */
    public AggregationField getSum() {
        return sum;
    }

    /**
     * Sets sum.
     *
     * @param sum the sum
     */
    public void setSum(AggregationField sum) {
        this.sum = sum;
    }

    /**
     * Gets min.
     *
     * @return the min
     */
    public AggregationField getMin() {
        return min;
    }

    /**
     * Sets min.
     *
     * @param min the min
     */
    public void setMin(AggregationField min) {
        this.min = min;
    }

    /**
     * Gets max.
     *
     * @return the max
     */
    public AggregationField getMax() {
        return max;
    }

    /**
     * Sets max.
     *
     * @param max the max
     */
    public void setMax(AggregationField max) {
        this.max = max;
    }

    /**
     * Gets avg.
     *
     * @return the avg
     */
    public AggregationField getAvg() {
        return avg;
    }

    /**
     * Sets avg.
     *
     * @param avg the avg
     */
    public void setAvg(AggregationField avg) {
        this.avg = avg;
    }
}

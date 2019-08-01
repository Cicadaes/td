package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube;

import java.util.List;

/**
 * The type Cube measure.
 * @author xiaoming.kang
 */
public class CubeMeasure {
    private List<CubeSelectModelMeasure> measures;

    /**
     * Gets measures.
     *
     * @return the measures
     */
    public List<CubeSelectModelMeasure> getMeasures() {
        return measures;
    }

    /**
     * Sets measures.
     *
     * @param measures the measures
     */
    public void setMeasures(List<CubeSelectModelMeasure> measures) {
        this.measures = measures;
    }
}

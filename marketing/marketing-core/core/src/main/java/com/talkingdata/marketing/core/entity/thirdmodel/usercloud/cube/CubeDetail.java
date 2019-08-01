package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube;

/**
 * The type Cube detail.
 * @author xiaoming.kang
 */
public class CubeDetail {
    private Integer cubeId;
    private CubeInfo cubeInfo;
    private CubeDimension dimension;
    private CubeMeasure measure;

    /**
     * Gets cube id.
     *
     * @return the cube id
     */
    public Integer getCubeId() {
        return cubeId;
    }

    /**
     * Sets cube id.
     *
     * @param cubeId the cube id
     */
    public void setCubeId(Integer cubeId) {
        this.cubeId = cubeId;
    }

    /**
     * Gets cube info.
     *
     * @return the cube info
     */
    public CubeInfo getCubeInfo() {
        return cubeInfo;
    }

    /**
     * Sets cube info.
     *
     * @param cubeInfo the cube info
     */
    public void setCubeInfo(CubeInfo cubeInfo) {
        this.cubeInfo = cubeInfo;
    }

    /**
     * Gets dimension.
     *
     * @return the dimension
     */
    public CubeDimension getDimension() {
        return dimension;
    }

    /**
     * Sets dimension.
     *
     * @param dimension the dimension
     */
    public void setDimension(CubeDimension dimension) {
        this.dimension = dimension;
    }

    /**
     * Gets measure.
     *
     * @return the measure
     */
    public CubeMeasure getMeasure() {
        return measure;
    }

    /**
     * Sets measure.
     *
     * @param measure the measure
     */
    public void setMeasure(CubeMeasure measure) {
        this.measure = measure;
    }
}

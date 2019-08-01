package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube;

import java.util.List;

/**
 * The type Cube dimension.
 * @author xiaoming.kang
 */
public class CubeDimension {
    private List<CubeSelectModelDimension> dimensions;

    /**
     * Gets dimensions.
     *
     * @return the dimensions
     */
    public List<CubeSelectModelDimension> getDimensions() {
        return dimensions;
    }

    /**
     * Sets dimensions.
     *
     * @param dimensions the dimensions
     */
    public void setDimensions(List<CubeSelectModelDimension> dimensions) {
        this.dimensions = dimensions;
    }
}

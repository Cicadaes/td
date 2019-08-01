package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube;

import java.util.List;

/**
 * The type Cube select model dimension.
 * @author xiaoming.kang
 */
public class CubeSelectModelDimension {
    private List<CubeSelectModelColumn> selected;

    /**
     * Gets selected.
     *
     * @return the selected
     */
    public List<CubeSelectModelColumn> getSelected() {
        return selected;
    }

    /**
     * Sets selected.
     *
     * @param selected the selected
     */
    public void setSelected(List<CubeSelectModelColumn> selected) {
        this.selected = selected;
    }
}

package com.talkingdata.wifianalytics.offline.compute.job.task.standard;

import com.talkingdata.wifianalytics.offline.compute.job.task.key.CubeKey;
import com.talkingdata.wifianalytics.offline.compute.job.task.key.HighLevelKey;
import com.tenddata.bitmap.Bitmap;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by loong on 4/27/16.
 */
public class StandardResult {
    /**
     * 数据库中的主键对应bitmap的存储表
     */
    private Map<CubeKey, Bitmap> cubes;

    /**
     * 不包含时间纬度的keySet
     */
    private Set<HighLevelKey> highLevelPrimaryKey;

    public StandardResult() {
        this.cubes = new HashMap<CubeKey, Bitmap>();
        this.highLevelPrimaryKey = new HashSet<HighLevelKey>();
    }

    public Map<CubeKey, Bitmap> getCubes() {
        return cubes;
    }

    public void setCubes(Map<CubeKey, Bitmap> cubes) {
        this.cubes = cubes;
    }

    public Set<HighLevelKey> getHighLevelPrimaryKey() {
        return highLevelPrimaryKey;
    }

    public void setHighLevelPrimaryKey(Set<HighLevelKey> highLevelPrimaryKey) {
        this.highLevelPrimaryKey = highLevelPrimaryKey;
    }
}

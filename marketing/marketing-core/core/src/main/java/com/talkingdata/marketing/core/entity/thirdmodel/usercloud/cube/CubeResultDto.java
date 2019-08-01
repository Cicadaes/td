package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube;

import java.util.List;
import java.util.Map;

/**
 * The type Cube result dto.
 * @author xiaoming.kang
 */
public class CubeResultDto {
    private List<List<String>> key_list;
    private List<Map<String,String>> results;

    /**
     * Gets key list.
     *
     * @return the key list
     */
    public List<List<String>> getKey_list() {
        return key_list;
    }

    /**
     * Sets key list.
     *
     * @param key_list the key list
     */
    public void setKey_list(List<List<String>> key_list) {
        this.key_list = key_list;
    }

    /**
     * Gets results.
     *
     * @return the results
     */
    public List<Map<String, String>> getResults() {
        return results;
    }

    /**
     * Sets results.
     *
     * @param results the results
     */
    public void setResults(List<Map<String, String>> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        return "key_list:" + key_list + ", results:" + results;
    }
}

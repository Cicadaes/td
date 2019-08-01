package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Analysis item dto.
 * @author xiaoming.kang
 */
public class AnalysisItemDto {
    private String name;
    private Long value;

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets value.
     *
     * @return the value
     */
    public Long getValue() {
        return value;
    }

    /**
     * Sets value.
     *
     * @param value the value
     */
    public void setValue(Long value) {
        this.value = value;
    }
}

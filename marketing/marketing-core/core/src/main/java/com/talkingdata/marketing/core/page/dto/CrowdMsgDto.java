package com.talkingdata.marketing.core.page.dto;

/**
 * The type Crowd msg dto.
 * @author xiaoming.kang
 */
public class CrowdMsgDto {
    private String content;
    private Boolean json;

    /**
     * Gets json.
     *
     * @return the json
     */
    public Boolean getJson() {
        return json;
    }

    /**
     * Sets json.
     *
     * @param json the json
     */
    public void setJson(Boolean json) {
        this.json = json;
    }

    /**
     * Gets content.
     *
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * Sets content.
     *
     * @param content the content
     */
    public void setContent(String content) {
        this.content = content;
    }
}

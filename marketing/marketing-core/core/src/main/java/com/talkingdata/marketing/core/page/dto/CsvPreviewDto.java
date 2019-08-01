package com.talkingdata.marketing.core.page.dto;

import java.util.List;
import java.util.Map;

/**
 * The type Csv preview dto.
 * @author xiaoming.kang
 */
public class CsvPreviewDto {
    /**
     * The Content.
     */
    List<Map> content;
    /**
     * The Quotes.
     */
    List<String> quotes;

    /**
     * Gets content.
     *
     * @return the content
     */
    public List<Map> getContent() {
        return content;
    }

    /**
     * Sets content.
     *
     * @param content the content
     */
    public void setContent(List<Map> content) {
        this.content = content;
    }

    /**
     * Gets quotes.
     *
     * @return the quotes
     */
    public List<String> getQuotes() {
        return quotes;
    }

    /**
     * Sets quotes.
     *
     * @param quotes the quotes
     */
    public void setQuotes(List<String> quotes) {
        this.quotes = quotes;
    }
}

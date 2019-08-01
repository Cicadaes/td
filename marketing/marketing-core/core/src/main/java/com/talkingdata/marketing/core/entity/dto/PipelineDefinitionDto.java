package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.page.dto.PipelineEquityConfigDefinitionDto;
import java.util.List;

/**
 * The type Pipeline definition dto.
 * @author xiaoming.kang
 */
public class PipelineDefinitionDto extends PipelineDefinition {
    private String campaignName;
    private List<PipelineEquityConfigDefinitionDto> pipelineEquityConfigDefinitionDtos;

    /**
     * Gets campaign name.
     *
     * @return the campaign name
     */
    public String getCampaignName() {
        return campaignName;
    }

    /**
     * Sets campaign name.
     *
     * @param campaignName the campaign name
     */
    public void setCampaignName(String campaignName) {
        this.campaignName = campaignName;
    }

    /**
     * Gets pipeline equity config definition dtos.
     *
     * @return the pipeline equity config definition dtos
     */
    public List<PipelineEquityConfigDefinitionDto> getPipelineEquityConfigDefinitionDtos() {
        return pipelineEquityConfigDefinitionDtos;
    }

    /**
     * Sets pipeline equity config definition dtos.
     *
     * @param pipelineEquityConfigDefinitionDtos the pipeline equity config definition dtos
     */
    public void setPipelineEquityConfigDefinitionDtos(List<PipelineEquityConfigDefinitionDto> pipelineEquityConfigDefinitionDtos) {
        this.pipelineEquityConfigDefinitionDtos = pipelineEquityConfigDefinitionDtos;
    }
}

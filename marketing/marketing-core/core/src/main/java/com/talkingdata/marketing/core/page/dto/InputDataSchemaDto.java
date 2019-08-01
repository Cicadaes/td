package com.talkingdata.marketing.core.page.dto;

import com.talkingdata.marketing.core.entity.admin.InputDataOption;
import com.talkingdata.marketing.core.entity.admin.InputDataSchema;
import java.util.List;

/**
 * The type Input data schema dto.
 * @author xiaoming.kang
 */
public class InputDataSchemaDto extends InputDataSchema{
    private List<InputDataOption> inputDataOptionList;

    /**
     * Gets input data option list.
     *
     * @return the input data option list
     */
    public List<InputDataOption> getInputDataOptionList() {
        return inputDataOptionList;
    }

    /**
     * Sets input data option list.
     *
     * @param inputDataOptionList the input data option list
     */
    public void setInputDataOptionList(List<InputDataOption> inputDataOptionList) {
        this.inputDataOptionList = inputDataOptionList;
    }
}

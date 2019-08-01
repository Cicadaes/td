package com.talkingdata.marketing.core.entity.thirdmodel.push;

/**
 * The type Vm response.
 * @author xiaoming.kang
 */
public class VmResponse {
    private Boolean result;
    private Integer code;
    private String describe;

    /**
     * Gets result.
     *
     * @return the result
     */
    public Boolean getResult() {
        return result;
    }

    /**
     * Sets result.
     *
     * @param result the result
     */
    public void setResult(Boolean result) {
        this.result = result;
    }

    /**
     * Gets code.
     *
     * @return the code
     */
    public Integer getCode() {
        return code;
    }

    /**
     * Sets code.
     *
     * @param code the code
     */
    public void setCode(Integer code) {
        this.code = code;
    }

    /**
     * Gets describe.
     *
     * @return the describe
     */
    public String getDescribe() {
        return describe;
    }

    /**
     * Sets describe.
     *
     * @param describe the describe
     */
    public void setDescribe(String describe) {
        this.describe = describe;
    }
}

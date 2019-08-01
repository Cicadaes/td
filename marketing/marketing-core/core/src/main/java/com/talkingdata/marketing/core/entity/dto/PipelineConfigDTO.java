package com.talkingdata.marketing.core.entity.dto;

/**
 * Pipeline Config 数据封装类
 *   作为config数据返回的model,如提前终止规则，事件。其中一些选择的配置由多种类型的数据合并而来，需要type字段去区分。
 * @author hongsheng
 * @create 2017-09-13-下午5:59
 * @since JDK 1.8
 */
public class PipelineConfigDTO {
    /**code*/
    private String code;
    /**名称*/
    private String name;
    /**值*/
    private String value;
    /**类型，@see PipelineConfigType*/
    private String type;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public enum PipelineConfigType {
        //规则指标
        RULE_INDEX("index"),
        //权益
        CAMPAIGN_EQUITY("equity"),
        //行为
        CAMPAIGN_BEHAVIOR("behavior"),
        //维度
        CAMPAIGN_DIMENSION("dimension"),
        //维度
        CAMPAIGN_FUNNEL("funnel");


        private String name;

        PipelineConfigType(String name){
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    @Override
    public String toString() {
        return "PipelineConfigDTO{" +
                "code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", value='" + value + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}

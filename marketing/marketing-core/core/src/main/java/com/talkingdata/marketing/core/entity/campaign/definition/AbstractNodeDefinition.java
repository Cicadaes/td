package com.talkingdata.marketing.core.entity.campaign.definition;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.google.common.base.Objects;
import com.talkingdata.marketing.core.entity.campaign.definition.node.*;
import java.util.HashSet;
import java.util.Set;

/**
 * pipeline组件的抽象类
 *
 * @author sheng.hong
 * @create 2017-08-16-下午5:20
 * @since JDK 1.8
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = EntranceNodeDefinition.class, name = "entrance"),
    @JsonSubTypes.Type(value = EndNodeDefinition.class, name = "end"),
    @JsonSubTypes.Type(value = FilterNodeDefinition.class, name = "filter"),
    @JsonSubTypes.Type(value = GenerateCrowdNodeDefinition.class, name = "generate"),
    @JsonSubTypes.Type(value = HourMeterNodeDefinition.class, name = "hourMeter"),
    @JsonSubTypes.Type(value = PushNodeDefinition.class, name = "push"),
    @JsonSubTypes.Type(value = ShortMessageNodeDefinition.class, name = "shortMessage"),
    @JsonSubTypes.Type(value = SplitNodeDefinition.class, name = "split"),
    @JsonSubTypes.Type(value = TriggerNodeDefinition.class, name = "trigger")
})
public abstract class AbstractNodeDefinition {
    /**主键*/
    private String id;
    /**pipelineDef ID*/
    private Integer pipelineDefinitionId;
    /**名称*/
    private String name;
    /**code 一般为组件类的classname*/
    private String operatorCode;
    /** 点的X轴 */
    private Integer x;
    /** 点的Y轴 */
    private Integer y;
    /** 宽 */
    private Integer width;
    /** 高 */
    private Integer height;
    /** 描述 */
    private String description;
    /** ICON图片地址 */
    private String icon;

    /**
     * 人群ID，算子依赖的人群ID
     */
    private Set<Integer> crowdIds = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getPipelineDefinitionId() {
        return pipelineDefinitionId;
    }

    public void setPipelineDefinitionId(Integer pipelineDefinitionId) {
        this.pipelineDefinitionId = pipelineDefinitionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode) {
        this.operatorCode = operatorCode;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Set<Integer> getCrowdIds() {
        return crowdIds;
    }

    public void setCrowdIds(Set<Integer> crowdIds) {
        this.crowdIds = crowdIds;
    }

    @Override
    public String toString() {
        return "AbstractNodeDefinition{" +
                "id='" + id + '\'' +
                ", pipelineDefinitionId=" + pipelineDefinitionId +
                ", name='" + name + '\'' +
                ", operatorCode='" + operatorCode + '\'' +
                ", x='" + x + '\'' +
                ", y='" + y + '\'' +
                ", width=" + width +
                ", height=" + height +
                ", description='" + description + '\'' +
                ", icon='" + icon + '\'' +
                ", crowdIds=" + crowdIds +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AbstractNodeDefinition that = (AbstractNodeDefinition) o;
        return Objects.equal(id, that.id) &&
                Objects.equal(pipelineDefinitionId, that.pipelineDefinitionId) &&
                Objects.equal(name, that.name) &&
                Objects.equal(operatorCode, that.operatorCode) &&
                Objects.equal(x, that.x) &&
                Objects.equal(y, that.y) &&
                Objects.equal(width, that.width) &&
                Objects.equal(height, that.height) &&
                Objects.equal(description, that.description) &&
                Objects.equal(icon, that.icon) &&
                Objects.equal(crowdIds, that.crowdIds);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, pipelineDefinitionId, name, operatorCode, x, y, width, height, description, icon, crowdIds);
    }
}

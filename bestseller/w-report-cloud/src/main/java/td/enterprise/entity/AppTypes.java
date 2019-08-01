package td.enterprise.entity;

import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>APP分类表 AppTypesEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-01 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AppTypes {

    private Integer id;
    private String parentId;
    private String type;
    private String typeEn;
    private String tagRef;
    private String seq;
    private Date createTime;
    private String updater;
    private String updateBy;
    private Date updateTime;

    private List<AppTypes> childrenType;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getParentId() {
        return this.parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTypeEn() {
        return this.typeEn;
    }

    public void setTypeEn(String typeEn) {
        this.typeEn = typeEn;
    }

    public String getTagRef() {
        return this.tagRef;
    }

    public void setTagRef(String tagRef) {
        this.tagRef = tagRef;
    }

    public String getSeq() {
        return this.seq;
    }

    public void setSeq(String seq) {
        this.seq = seq;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdater() {
        return this.updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public List<AppTypes> getChildrenType() {
        return childrenType;
    }

    public void setChildrenType(List<AppTypes> childrenType) {
        this.childrenType = childrenType;
    }

}


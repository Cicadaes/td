package td.enterprise.entity;


import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>数据字典子项目 DicItemEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DicItem implements Serializable {

    private Integer id;
    private Integer dicId;
    private String dicItemKey;
    private String dicItemValue;
    private Integer parentId;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;

    private List<DicItem> dicItems;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDicId() {
        return this.dicId;
    }

    public void setDicId(Integer dicId) {
        this.dicId = dicId;
    }

    public String getDicItemKey() {
        return this.dicItemKey;
    }

    public void setDicItemKey(String dicItemKey) {
        this.dicItemKey = dicItemKey;
    }

    public String getDicItemValue() {
        return this.dicItemValue;
    }

    public void setDicItemValue(String dicItemValue) {
        this.dicItemValue = dicItemValue;
    }

    public Integer getParentId() {
        return this.parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public List<DicItem> getDicItems() {
        return dicItems;
    }

    public void setDicItems(List<DicItem> dicItems) {
        this.dicItems = dicItems;
    }
}


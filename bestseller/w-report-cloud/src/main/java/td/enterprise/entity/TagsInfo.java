package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>标签信息 TagsInfoEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public class TagsInfo extends BaseEntity {

    private Integer id;
    private String tagName;
    private String tagFullname;
    private String tagCode;
    private String tagLevel;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTagName() {
        return this.tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getTagFullname() {
        return this.tagFullname;
    }

    public void setTagFullname(String tagFullname) {
        this.tagFullname = tagFullname;
    }

    public String getTagCode() {
        return this.tagCode;
    }

    public void setTagCode(String tagCode) {
        this.tagCode = tagCode;
    }

    public String getTagLevel() {
        return this.tagLevel;
    }

    public void setTagLevel(String tagLevel) {
        this.tagLevel = tagLevel;
    }

}

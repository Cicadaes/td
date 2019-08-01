package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>项目参数 ProjectParamEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-25 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ProjectParam extends BaseEntity {

    private Integer id;
    private Integer projectId;
    private String key;
    private String value;
    private String description;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProjectId() {
        return this.projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getKey() {
        return this.key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return this.value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}


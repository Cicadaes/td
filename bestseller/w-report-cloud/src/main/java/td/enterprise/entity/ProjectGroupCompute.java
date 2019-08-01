package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>项目店组计算配置 ProjectGroupComputeEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ProjectGroupCompute extends BaseEntity {

    private Integer id;
    private Integer projectId;
    private Integer groupId;
    private Integer computeType;

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

    public Integer getGroupId() {
        return this.groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }


    public Integer getComputeType() {
        return this.computeType;
    }

    public void setComputeType(Integer computeType) {
        this.computeType = computeType;
    }
}


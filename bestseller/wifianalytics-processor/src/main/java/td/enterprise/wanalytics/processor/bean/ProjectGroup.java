package td.enterprise.wanalytics.processor.bean;

/**
 * 需要计算排除重复mac的group
 * @author junmin.li
 *
 */
public class ProjectGroup {
    private Integer projectId; //项目Id
    private Integer groupId;  //需要计算的店组ID

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    @Override
    public String toString() {
        return "ProjectGroup{" +
                "projectId=" + projectId +
                ", groupId=" + groupId +
                '}';
    }
}

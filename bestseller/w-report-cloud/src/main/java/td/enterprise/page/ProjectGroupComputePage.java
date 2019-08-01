package td.enterprise.page;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>项目店组计算配置 ProjectGroupComputePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ProjectGroupComputePage extends BasePage {

    private Integer id;
    private Integer projectId;
    private Integer groupId;
    private String createBy;
    private String creator;
    private Date createTime;
    private String updateBy;
    private String updater;
    private Date updateTime;
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

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getUpdater() {
        return this.updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getComputeType() {
        return this.computeType;
    }

    public void setComputeType(Integer computeType) {
        this.computeType = computeType;
    }
}

package td.enterprise.common.azkaban.entity;

import java.util.List;

public class AzkabanFetchFlowsofProjectResponse extends AzkabanResponse {

    /**
     * The project name.
     */
    private String project;

    /**
     * The numerical id of the project.
     */
    private String projectId;

    /**
     * A list of flow ids. Example values: [{"flowId": "aaa"}, {"flowId": "bbb"}]
     */
    private List<Object> flows;


    /* (non-Javadoc)
     * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#failure()
     */
    public boolean failure() {
        return this.getError() != null && !"".equals(this.getError());
    }

    /* (non-Javadoc)
     * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#error()
     */
    public boolean error() {
        return failure();
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public List<Object> getFlows() {
        return flows;
    }

    public void setFlows(List<Object> flows) {
        this.flows = flows;
    }

}

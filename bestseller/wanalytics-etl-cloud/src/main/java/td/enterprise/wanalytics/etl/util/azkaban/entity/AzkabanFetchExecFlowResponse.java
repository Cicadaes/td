package td.enterprise.wanalytics.etl.util.azkaban.entity;


public class AzkabanFetchExecFlowResponse extends AzkabanResponse {

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
		return false;
	}

	private int attempt;

	private String submitUser;

	private long updateTime;

	private String status;

	private long submitTime;

	private int projectId;

	private String flow;

	private long endTime;

	private String type;

	private String nestedId;

	private long startTime;

	private String id;

	private String project;

	private String flowId;

	private String execid;

	private Nodes[] nodes;

	public String getSubmitUser() {
		return submitUser;
	}

	public void setSubmitUser(String submitUser) {
		this.submitUser = submitUser;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getFlow() {
		return flow;
	}

	public void setFlow(String flow) {
		this.flow = flow;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getNestedId() {
		return nestedId;
	}

	public void setNestedId(String nestedId) {
		this.nestedId = nestedId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public String getFlowId() {
		return flowId;
	}

	public void setFlowId(String flowId) {
		this.flowId = flowId;
	}

	public String getExecid() {
		return execid;
	}

	public void setExecid(String execid) {
		this.execid = execid;
	}

	public int getAttempt() {
		return attempt;
	}

	public void setAttempt(int attempt) {
		this.attempt = attempt;
	}

	public long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}

	public long getSubmitTime() {
		return submitTime;
	}

	public void setSubmitTime(long submitTime) {
		this.submitTime = submitTime;
	}

	public int getProjectId() {
		return projectId;
	}

	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}

	public long getEndTime() {
		return endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public long getStartTime() {
		return startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public Nodes[] getNodes() {
		return nodes;
	}

	public void setNodes(Nodes[] nodes) {
		this.nodes = nodes;
	}

}

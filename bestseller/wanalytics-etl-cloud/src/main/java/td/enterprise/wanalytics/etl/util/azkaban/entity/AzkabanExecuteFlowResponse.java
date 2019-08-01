package td.enterprise.wanalytics.etl.util.azkaban.entity;

public class AzkabanExecuteFlowResponse extends AzkabanResponse {

	/**
	 * The executed flow id
	 */
	private String flow;

	/**
	 * The execution id
	 */
	private String execid;
	
	/**
	 * project 
	 */
	private String project;


	/* (non-Javadoc)
	 * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#failure()
	 */
	public boolean failure() {
        return !(execid != null && !"".equals(execid));
    }

	/* (non-Javadoc)
	 * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#error()
	 */
	public boolean error() {
		return failure();
	}
	
	/**
	 * @return the flow
	 */
	public String getFlow() {
		return flow;
	}

	/**
	 * @param flow
	 *            the flow to set
	 */
	public void setFlow(String flow) {
		this.flow = flow;
	}

	/**
	 * @return the execid
	 */
	public String getExecid() {
		return execid;
	}

	/**
	 * @param execid
	 *            the execid to set
	 */
	public void setExecid(String execid) {
		this.execid = execid;
	}

	/**
	 * @return the project
	 */
	public String getProject() {
		return project;
	}

	/**
	 * @param project the project to set
	 */
	public void setProject(String project) {
		this.project = project;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "AzkabanExecuteFlowResponse [flow=" + flow + ", execid=" + execid + ", project=" + project + ", getMessage()=" + getMessage()
				+ ", getStatus()=" + getStatus() + ", getError()=" + getError() + "]";
	}

}

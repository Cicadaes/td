package td.enterprise.wanalytics.etl.util.azkaban.entity;


public class AzkabanCreateProjectResponse extends AzkabanResponse {

	/**
	 * The status of the creation attempt.
	 */
	private String status;
	/**
	 * The url path to redirect
	 */
	private String path;
	/**
	 *  	The action that is suggested for the frontend to execute. (This is designed for the usage of the Azkaban frontend javascripts, external users can ignore this field.)
	 */
	private String action;
	
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
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	
	
}

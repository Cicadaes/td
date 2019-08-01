package td.enterprise.wanalytics.etl.util.azkaban.entity;


import java.util.List;

public class AzkabanFetchRunningFlowResponse extends AzkabanResponse {


	private List<Integer> execIds;

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

	public List<Integer> getExecIds() {
		return execIds;
	}

	public void setExecIds(List<Integer> execIds) {
		this.execIds = execIds;
	}
}

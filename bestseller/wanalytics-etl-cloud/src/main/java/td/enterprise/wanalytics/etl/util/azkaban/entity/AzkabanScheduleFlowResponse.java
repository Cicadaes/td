package td.enterprise.wanalytics.etl.util.azkaban.entity;

public class AzkabanScheduleFlowResponse extends AzkabanResponse {

	/*
	 * (non-Javadoc)
	 * 
	 * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#failure()
	 */
	public boolean failure() {
        return this.getError() != null && !"".equals(this.getError());
    }

	/*
	 * (non-Javadoc)
	 * 
	 * @see td.enterprise.batchmanager.azkaban.entity.AzkabanResponse#error()
	 */
	public boolean error() {
		return failure();
	}

	@Override
	public String toString() {
		return "AzkabanScheduleFlowResponse [failure()=" + failure() + ", error()=" + error() + ", getMessage()=" + getMessage() + ", getStatus()=" + getStatus()
				+ ", getError()=" + getError() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
	}	
}

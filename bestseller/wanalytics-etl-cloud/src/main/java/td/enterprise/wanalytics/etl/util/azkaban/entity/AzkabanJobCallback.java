package td.enterprise.wanalytics.etl.util.azkaban.entity;

public class AzkabanJobCallback {

	private String azkabanServer;

	private String azkabanProjectName;

	private String azkabanFlowId;

	private String azkabanExecutionId;

	private String azkabanJobId;

	private String commanddesc;

	private String status;

	private String scheduleLogId;

	private String calcRecordId;

	private String calcRecordType;

	private String calcRecordSubType;

	private String processTypes;
	
	private String bizObjectId;
	
	private String bizObjectType;

	public String getAzkabanServer() {
		return azkabanServer;
	}

	public void setAzkabanServer(String azkabanServer) {
		this.azkabanServer = azkabanServer;
	}

	public String getAzkabanProjectName() {
		return azkabanProjectName;
	}

	public void setAzkabanProjectName(String azkabanProjectName) {
		this.azkabanProjectName = azkabanProjectName;
	}

	public String getAzkabanFlowId() {
		return azkabanFlowId;
	}

	public void setAzkabanFlowId(String azkabanFlowId) {
		this.azkabanFlowId = azkabanFlowId;
	}

	public String getAzkabanExecutionId() {
		return azkabanExecutionId;
	}

	public void setAzkabanExecutionId(String azkabanExecutionId) {
		this.azkabanExecutionId = azkabanExecutionId;
	}

	public String getAzkabanJobId() {
		return azkabanJobId;
	}

	public void setAzkabanJobId(String azkabanJobId) {
		this.azkabanJobId = azkabanJobId;
	}

	public String getCommanddesc() {
		if ("null".equals(commanddesc)){
			return null;
		}
		return commanddesc;
	}

	public void setCommanddesc(String commanddesc) {
		this.commanddesc = commanddesc;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getScheduleLogId() {
		if ("null".equals(scheduleLogId)){
			return null;
		}
		return scheduleLogId;
	}

	public void setScheduleLogId(String scheduleLogId) {
		this.scheduleLogId = scheduleLogId;
	}

	public String getCalcRecordId() {
		if ("null".equals(calcRecordId)){
			return null;
		}
		return calcRecordId;
	}

	public void setCalcRecordId(String calcRecordId) {
		this.calcRecordId = calcRecordId;
	}

	public String getCalcRecordType() {
		if ("null".equals(calcRecordType)){
			return null;
		}
		return calcRecordType;
	}

	public void setCalcRecordType(String calcRecordType) {
		this.calcRecordType = calcRecordType;
	}

	public String getCalcRecordSubType() {
		if ("null".equals(calcRecordSubType)){
			return null;
		}
		return calcRecordSubType;
	}

	public void setCalcRecordSubType(String calcRecordSubType) {
		this.calcRecordSubType = calcRecordSubType;
	}

	public String getProcessTypes() {
		if ("null".equals(processTypes)){
			return null;
		}
		return processTypes;
	}

	public void setProcessTypes(String processTypes) {
		this.processTypes = processTypes;
	}

	public String getBizObjectId() {
		return bizObjectId;
	}

	public void setBizObjectId(String bizObjectId) {
		this.bizObjectId = bizObjectId;
	}

	public String getBizObjectType() {
		return bizObjectType;
	}

	public void setBizObjectType(String bizObjectType) {
		this.bizObjectType = bizObjectType;
	}

	@Override
	public String toString() {
		return "azkabanServer=" + azkabanServer + ", azkabanProjectName=" + azkabanProjectName + ", azkabanFlowId=" + azkabanFlowId
		        + ", azkabanExecutionId=" + azkabanExecutionId + ", azkabanJobId=" + azkabanJobId + ", commanddesc=" + commanddesc + ", status="
		        + status + ", scheduleLogId=" + scheduleLogId + ", calcRecordId=" + calcRecordId + ", calcRecordType=" + calcRecordType
		        + ", calcRecordSubType=" + calcRecordSubType + ", processTypes=" + processTypes + ", bizObjectId=" + bizObjectId + ", bizObjectType=" + bizObjectType;
	}
}

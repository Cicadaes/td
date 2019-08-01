package td.enterprise.wanalytics.etl.util.azkaban.entity;

public class Nodes {

	private int attempt;

	private long startTime;

	private String id;

	private long updateTime;

	private String status;

	private String nestedId;

	private String type;

	private long endTime;

	private String[] in;

	private Nodes[] nodes;
	
	private String flow;
	
	private String flowId;
	
	public int getAttempt() {
		return attempt;
	}

	public void setAttempt(int attempt) {
		this.attempt = attempt;
	}

	public long getStartTime() {
		return startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getNestedId() {
		return nestedId;
	}

	public void setNestedId(String nestedId) {
		this.nestedId = nestedId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public long getEndTime() {
		return endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public String[] getIn() {
		return in;
	}

	public void setIn(String[] in) {
		this.in = in;
	}

	public Nodes[] getNodes() {
		return nodes;
	}

	public void setNodes(Nodes[] nodes) {
		this.nodes = nodes;
	}

	public String getFlow() {
		return flow;
	}

	public void setFlow(String flow) {
		this.flow = flow;
	}

	public String getFlowId() {
		return flowId;
	}

	public void setFlowId(String flowId) {
		this.flowId = flowId;
	}

}

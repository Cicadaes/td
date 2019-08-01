package com.talkingdata.offline.alarm.bean;

public class TopologyBean {
	
	private String topologies;
	
	private String assignedTotalMem;
	private String owner;
	private String requestedMemOnHeap;
	private String assignedMemOnHeap;
	private String schedulerInfo;
	private String requestedMemOffHeap;
	private String requestedCpu;
	private String replicationCount;
	private String uptimeSeconds;
	private String assignedCpu;
	private String assignedMemOffHeap;
	private String requestedTotalMem;
	
	private String id;
	
	private String encodedId;
	
	private String name;
	
	private String status;
	
	private String uptime;
	
	private String tasksTotal;

	private String workersTotal;
	
	private String executorsTotal;
	
	/*******************************/
	private String windowPretty;
	
	private String window;
	
	private String emitted;
	
	private String transferred;
	
	private String completeLatency;
	
	private String acked;
	
	private String failed;
	
	
	public String getWindowPretty() {
		return windowPretty;
	}

	public void setWindowPretty(String windowPretty) {
		this.windowPretty = windowPretty;
	}

	public String getEmitted() {
		return emitted;
	}

	public void setEmitted(String emitted) {
		this.emitted = emitted;
	}

	public String getTransferred() {
		return transferred;
	}

	public void setTransferred(String transferred) {
		this.transferred = transferred;
	}

	public String getCompleteLatency() {
		return completeLatency;
	}

	public void setCompleteLatency(String completeLatency) {
		this.completeLatency = completeLatency;
	}

	public String getAcked() {
		return acked;
	}

	public void setAcked(String acked) {
		this.acked = acked;
	}

	public String getFailed() {
		return failed;
	}

	public void setFailed(String failed) {
		this.failed = failed;
	}


	public String getWindow() {
		return window;
	}

	public void setWindow(String window) {
		this.window = window;
	}


	public String getUptime() {
		return uptime;
	}

	public void setUptime(String uptime) {
		this.uptime = uptime;
	}


	public String getEncodedId() {
		return encodedId;
	}

	public void setEncodedId(String encodedId) {
		this.encodedId = encodedId;
	}

	public String getTasksTotal() {
		return tasksTotal;
	}

	public void setTasksTotal(String tasksTotal) {
		this.tasksTotal = tasksTotal;
	}

	public String getWorkersTotal() {
		return workersTotal;
	}

	public void setWorkersTotal(String workersTotal) {
		this.workersTotal = workersTotal;
	}

	public String getExecutorsTotal() {
		return executorsTotal;
	}

	public void setExecutorsTotal(String executorsTotal) {
		this.executorsTotal = executorsTotal;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTopologies() {
		return topologies;
	}

	public void setTopologies(String topologies) {
		this.topologies = topologies;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAssignedTotalMem() {
		return assignedTotalMem;
	}

	public void setAssignedTotalMem(String assignedTotalMem) {
		this.assignedTotalMem = assignedTotalMem;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getRequestedMemOnHeap() {
		return requestedMemOnHeap;
	}

	public void setRequestedMemOnHeap(String requestedMemOnHeap) {
		this.requestedMemOnHeap = requestedMemOnHeap;
	}

	public String getAssignedMemOnHeap() {
		return assignedMemOnHeap;
	}

	public void setAssignedMemOnHeap(String assignedMemOnHeap) {
		this.assignedMemOnHeap = assignedMemOnHeap;
	}

	public String getSchedulerInfo() {
		return schedulerInfo;
	}

	public void setSchedulerInfo(String schedulerInfo) {
		this.schedulerInfo = schedulerInfo;
	}

	public String getRequestedMemOffHeap() {
		return requestedMemOffHeap;
	}

	public void setRequestedMemOffHeap(String requestedMemOffHeap) {
		this.requestedMemOffHeap = requestedMemOffHeap;
	}

	public String getRequestedCpu() {
		return requestedCpu;
	}

	public void setRequestedCpu(String requestedCpu) {
		this.requestedCpu = requestedCpu;
	}

	public String getReplicationCount() {
		return replicationCount;
	}

	public void setReplicationCount(String replicationCount) {
		this.replicationCount = replicationCount;
	}

	public String getUptimeSeconds() {
		return uptimeSeconds;
	}

	public void setUptimeSeconds(String uptimeSeconds) {
		this.uptimeSeconds = uptimeSeconds;
	}

	public String getAssignedCpu() {
		return assignedCpu;
	}

	public void setAssignedCpu(String assignedCpu) {
		this.assignedCpu = assignedCpu;
	}

	public String getAssignedMemOffHeap() {
		return assignedMemOffHeap;
	}

	public void setAssignedMemOffHeap(String assignedMemOffHeap) {
		this.assignedMemOffHeap = assignedMemOffHeap;
	}

	public String getRequestedTotalMem() {
		return requestedTotalMem;
	}

	public void setRequestedTotalMem(String requestedTotalMem) {
		this.requestedTotalMem = requestedTotalMem;
	}

}

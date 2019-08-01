package td.enterprise.wanalytics.etl.bean;


public class WifiProcessorLog {
     private String sessionId;
     private int projectDuration;
     private String mac ;
     private int projectId;
     private String line; //保留整行数据 

    public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public int getProjectDuration() {
		return projectDuration;
	}
	public void setProjectDuration(int projectDuration) {
		this.projectDuration = projectDuration;
	}
	public String getLine() {
		return line;
	}
	public void setLine(String line) {
		this.line = line;
	}
	
	public String getMac() {
        return mac;
    }
    public void setMac(String mac) {
        this.mac = mac;
    }
    
    public int getProjectId() {
        return projectId;
    }
    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    @Override
	public boolean equals(Object obj) {
    	if (obj == null)
    		return false;
    	if (this.getClass() != obj.getClass())
    		return false;
		String value1 = this.sessionId + "_" + this.projectId + "_" + this.mac;
		WifiProcessorLog dest = (WifiProcessorLog) obj;
		String value2 = "";
		value2 = dest.getSessionId() + "_" + dest.getProjectId() + "_" + dest.mac;
		return value1.equals(value2);
	}

	@Override
	public int hashCode() {
		String hash = this.sessionId + "_"  + this.projectId + "_" + this.mac;
		return hash.hashCode();
	}
}

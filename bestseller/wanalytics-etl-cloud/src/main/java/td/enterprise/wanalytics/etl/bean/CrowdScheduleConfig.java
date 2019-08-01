package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class CrowdScheduleConfig {
	
	private Integer id;
	private String tenantId;
	private String projectId;
	private String cycleStatistics;
	private String crowdId;
	private String cycle;
	private String lastExecTime;
	private String nextExecTime;
}


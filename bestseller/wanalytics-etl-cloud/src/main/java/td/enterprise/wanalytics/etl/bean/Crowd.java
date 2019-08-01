package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by Yan on 2017/4/20.
 */
@Setter
@Getter
@ToString
public class Crowd {
    private String tenantId;
    private int projectId;
    private String crowdId;
    private int cycleStatistics;
    private String runDate ;
    private String startDate;
    private String endDate;
    private String crowdType;
}

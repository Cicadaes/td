package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ProjectDetailVM {
    private Integer projectId;
    private String principal;

    private Integer projectType;
    private String projectName;
    private Integer sensorNum;
    private Double healthRate;
    private Double noLogDuration;
    private Double thirtyNoLogDuration;

    private List<SensorDetailVM> sensorDetailVMS;

}

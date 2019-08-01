package td.enterprise.service.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by liran on 2017/4/20.
 */

@Setter
@Getter
@ToString
public class ThresholdValueDTO {

    private Integer activeUserVisitMinutes;
    private Integer projectStayUserMinutes;
    private Integer projectTimeoutMinutes;
    private Integer thresholdTimeUnit;
    private Integer stayTimeDistributionUnit;

}

package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.Sensor;

@Setter
@Getter
@ToString
public class SensorInfoVM extends Sensor {

    private String customizedInfo;


    // private List<SensorAccountVM> macs;
    // private List<SensorAccountVM> logs;
}

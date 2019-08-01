package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.Sensor;

@Setter
@Getter
@ToString
public class SensorChangeLogVM {

    private Sensor oldSensor;
    private Sensor newSensor;

}

package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.Sensor;

import java.util.List;

@Setter
@Getter
@ToString
public class SensorDetailVM extends Sensor{

    private Integer macTotal;//有效mac总计
    private Integer logTotal;//有效log总计

    private List<SensorAccountVM> macs; //macs数组
    private List<SensorAccountVM> logs; //logs数组
//    private List<SensorChangeLogVM> changelogs; //编辑记录数组
}

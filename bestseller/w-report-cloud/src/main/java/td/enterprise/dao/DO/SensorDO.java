package td.enterprise.dao.DO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.Sensor;

/**
 * Created by Yan on 2017/3/14.
 * SensorMapper.xml AssociationMap 对应
 */
@Setter
@Getter
@ToString
public class SensorDO extends Sensor {

    private Integer projectPlaceId;

    private String projectPlaceName;

    private Integer diargamId;

    private String longitude;

    private String latitude;
}

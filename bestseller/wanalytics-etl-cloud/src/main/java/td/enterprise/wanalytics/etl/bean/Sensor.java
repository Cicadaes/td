package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by Yan on 2017/4/27.
 */
@Getter
@Setter
@ToString
public class Sensor {

    //唯一标识
    private Integer id;

    //status 状态 1：生效，-1：失效
    private Integer status;

    private String tenantId;
    private Integer projectId;
    private Integer placeId;
    private String sensorMac;

    //营业开始时间 HH：MM，比如，09:00
    private String openingTime;

    //营业结束时间 HH：MM，比如，18:00
    private String closingTime;


}

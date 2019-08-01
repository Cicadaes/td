package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by Administrator on 2017/7/20.
 */
@Setter
@Getter
@ToString
public class SensorMinRssiVM {
    private Integer id;
    private String time;
    private String sensorMac;
    private String minRssi;
    private String remark;
    private int lock;
}

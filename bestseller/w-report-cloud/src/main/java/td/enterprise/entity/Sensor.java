package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>探针 SensorEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Getter
@Setter
@ToString
public class Sensor extends BaseEntity {

    private Integer id;
    private String sensorCode;
    private String sensorName;
    private String sensorMac;
    private Integer status;
    private String description;
    private String tenantId;

    private Integer projectId;
    private String minRssi;

    private Integer roomId;
    private String roomName;

    private String positionDescription;
    private Double distance;

    private String isOutside;

    private String sumHours;
    private String rawDataQuantity;
    private String processedData;
    private String compared;
    private String projectName;
    private String projectNum;
    private boolean isHealth;  // 是否健康
    private Double noLogDuration; // 无日志时长
    private long sum3Hour;//探针3小时数据量
    //营业开始时间 HH：MM，比如，09:00
    private String openingTime;

    //营业结束时间 HH：MM，比如，18:00
    private String closingTime;
    private String logHours; //探针3小时日志数

    private Integer normal;  // 0异常，1正常 ，2停用

    private String sensorVersion;  //探针型号
    private String sensorType;     //探针类型

}


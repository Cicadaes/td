package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>探针 SensorPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class SensorPage extends BasePage {

    private Integer id;
    private String sensorCode;
    private String sensorName;
    private String sensorMac;
    private Integer status;
    private String description;
    private String tenantId;

    private Integer projectId;
    private String projectName;
    private Integer projectPlaceId;
    private String projectPlaceName;
    private String minRssi;


    private String isOutside;
    private Integer roomId;
    private String roomName;
    private Integer diargamId;
    private String longitude;
    private String latitude;
    private String positionDescription;
    private Double distance;
    private String sumHours;
    private String rawDataQuantity;
    private String processedData;
    private String compared;
    private Double noLogDuration; // 无日志时长

    private boolean isHealth; //是否健康

    private Integer normal;  // 0异常，1正常 ，2停用

    //营业开始时间 HH：MM，比如，09:00
    private String openingTime;

    //营业结束时间 HH：MM，比如，18:00
    private String closingTime;

    private String logHours; //探针3小时日志数
    private String querySrcType;
    private List<String> projectIds;
    private List<String> sensorVersions;
    private List<String> sensorTypes;
    private List<String> statuses;
}

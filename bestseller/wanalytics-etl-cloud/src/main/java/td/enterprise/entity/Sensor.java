package td.enterprise.entity;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 
 * @description 
 * @author sxk
 * @date 2018年1月29日
 */

@Getter
@Setter
@ToString
public class Sensor extends BaseEntity {

    private static final long serialVersionUID = 1L;
    private Integer           id;
    private String            sensorCode;
    private String            sensorName;
    private String            sensorMac;
    private Integer           status;
    private String            description;
    private String            tenantId;

    private Integer           projectId;
    private String            minRssi;

    private Integer           roomId;
    private String            roomName;

    private String            positionDescription;
    private Double            distance;

    private String            isOutside;

    private String            sumHours;
    private String            rawDataQuantity;
    private String            processedData;
    private String            compared;
    private String            projectName;
    private String            projectNum;
    private boolean           isHealth;             // 是否健康
    private Double            noLogDuration;        // 无日志时长
    private long              sum3Hour;             //探针3小时数据量
    //营业开始时间 HH：MM，比如，09:00
    private String            openingTime;

    //营业结束时间 HH：MM，比如，18:00
    private String            closingTime;
    private String            logHours;             //探针3小时日志数

    private Integer           normal;               // 0异常，1正常 ，2停用

    private String            sensorVersion;        //探针型号
    private String            sensorType;           //探针类型

    //创建人账号
    private String            createBy;

    //创建人
    private String            creator;

    //修改人账号
    private String            updateBy;

    //修改人
    private String            updater;

    //创建时间
    private Timestamp         createTime;

    //修改时间
    private Timestamp         updateTime;

}

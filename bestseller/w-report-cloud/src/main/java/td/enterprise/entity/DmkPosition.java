package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>月聚集位置查询服务 DmkPositionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class DmkPosition {

    private Integer id;
    private String mac;
    private String tdid;
    private String imei;
    private String idfa;
    private String androidid;
    private String month;
    private String latlng;
    private String latlngGps84;
    private Date syncDate;
    private String dmkCode;
    private String dmkMsg;
    private String dmkSeq;
    private Date createTime;

}


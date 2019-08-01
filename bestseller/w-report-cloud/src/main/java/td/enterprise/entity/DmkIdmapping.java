package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>IDMAPPING同步记录 DmkIdmappingEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-17 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class DmkIdmapping {

    private Integer id;
    private String mac;
    private String tdid;
    private String imei;
    private String idfa;
    private String androidid;
    private Date syncDate;
    private String dmkCode;
    private String dmkMsg;
    private String dmkSeq;
    private Date createTime;

}


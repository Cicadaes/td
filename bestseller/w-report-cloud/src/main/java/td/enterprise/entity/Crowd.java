package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>人群 CrowdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class Crowd {

    private Integer id;
    private Integer tagId;
    private String tagCode;
    private String tagName;
    private String tagType;
    private String name;
    private String code;
    private Integer source;
    private Integer status;
    private Integer calcStatus;
    private String description;
    private Integer crowdCount;
    private Date updateDataTime;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;
    private String type;
    private String touchPointType;
    private String tenantId;
    private String attr1;
    private String attr2;
    private String attr3;
    private String attr4;
    private String attr5;

}


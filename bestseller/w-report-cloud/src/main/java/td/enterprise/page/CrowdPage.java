package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>人群 CrowdPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CrowdPage extends BasePage {

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

    private String type;
    private String touchPointType;
    private String tenantId;
    private String attr1;
    private String attr2;
    private String attr3;
    private String attr4;
    private String attr5;

}

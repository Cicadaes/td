package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>TAGS同步记录 DmkTagsPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-17 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class DmkTagsPage extends BasePage {

    private Integer id;
    private String mac;
    private String tdid;
    private String weight;
    private String name;
    private String label;
    private String tagType;
    private Date syncDate;
    private String dmkCode;
    private String dmkMsg;
    private String dmkSeq;
}

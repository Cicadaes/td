package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>WiFiPix标签 WifipixTagPoiPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class WifipixTagPoiPage extends BasePage {

    private Integer id;
    private String tagName;
    private String type;
    private String parentId;
    private String isLeaf;

}
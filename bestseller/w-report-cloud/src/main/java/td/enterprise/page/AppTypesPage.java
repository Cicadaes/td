package td.enterprise.page;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>APP分类表 AppTypesPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-01 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class AppTypesPage extends BasePage {

    private Integer id;
    private String parentId;
    private String type;
    private String typeEn;
    private String tagRef;
    private String seq;

}

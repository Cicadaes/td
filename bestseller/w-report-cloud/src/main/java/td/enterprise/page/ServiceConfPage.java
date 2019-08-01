package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>服务接口 ServiceConfPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ServiceConfPage extends BasePage {

    private Integer id;
    private String name;
    private String code;
    private String service;
    private String token;
    private String appkey;
    private String type;
    private Integer status;
    private String description;
    private String systemCode;
    private String attr1;
    private String attr2;
    private String attr3;
    private String attr4;
}

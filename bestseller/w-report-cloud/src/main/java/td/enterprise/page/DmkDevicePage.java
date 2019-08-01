package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>DMK设备同步记录 DmkDevicePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-17 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class DmkDevicePage extends BasePage {

    private Integer id;
    private String mac;
    private String tdid;
    private String originModel;
    private String standardModel;
    private String standardBrand;
    private String deviceType;
    private String screen;
    private String price;
    private String functionType;
    private String hardwareType;
    private Date syncDate;
    private String dmkCode;
    private String dmkMsg;
    private String dmkSeq;
}

package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>客户围群表 CustomCrowdPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CustomCrowdPage extends BasePage {

    private Integer id;
    private Integer projectId;
    private String crowdName;
    private Integer recordType;
    private Integer calcStatus;
    private Integer execId;
    private Integer crowdRecordId;
    private Integer status;

}

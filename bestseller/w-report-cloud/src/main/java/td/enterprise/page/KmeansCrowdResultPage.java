package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>聚类客群任务计算结果 KmeansCrowdResultPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class KmeansCrowdResultPage extends BasePage {

    private Integer id;
    private Integer kmeansCrowdId;
    private String classificationName;
    private String classificationDescription;
    private String classificationValue;
    private String dataName;
    private Integer projectId;
    private Integer tenantId;
    private Integer execId;
    private String oldClassificationName;
    private String oldClassificationDescription;

}

package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

/**
 * <br>
 * <b>功能：</b>项目销售额 ProjectSalesVolumnPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectSalesVolumnPage extends BasePage {

    private Integer id;
    private String code;
    private String date;
    private Double value;
    private String unit;
    private Integer status;
    private String type;
    private String projectId;
    private String tenantId;
    private Integer crossAnalysisId;
    private Long passengerFlow;

    private MultipartFile file;
    private String overwrite;

    private String projectIds;
    private String start;

}

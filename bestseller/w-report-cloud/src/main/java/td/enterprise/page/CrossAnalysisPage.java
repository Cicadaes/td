package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.entity.ProjectSalesVolumn;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>交叉分析表 CrossAnalysisPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CrossAnalysisPage extends BasePage {

    private Integer id;
    private String projectId;
    private String analysisName;
    private String xAxis;
    private String yAxis;
    private String startDate;
    private String endDate;
    private Integer status;

    //批量上传数据附件
    private MultipartFile file;

    //对应销售数据
    private List<ProjectSalesVolumn> projectSalesVolumns;

}

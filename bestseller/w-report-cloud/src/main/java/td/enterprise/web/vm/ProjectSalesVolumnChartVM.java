package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.ProjectSalesVolumn;
import td.enterprise.service.DTO.ProjectSalesVolumnProjectDTO;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>销售客流数据<br>
 * <b>作者：</b>ran.li<br>
 * <b>日期：</b> 2017-04-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectSalesVolumnChartVM {
    private List<ProjectSalesVolumnProjectDTO> projectResult;
    private Double xAxisMiddle;
    private Double yAxisMiddle;
    private List<String> errMsgList;

    private List<ProjectSalesVolumn> projectSalesVolumns;
}

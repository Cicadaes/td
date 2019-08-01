package td.enterprise.service.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目销售客流数据<br>
 * <b>作者：</b>ran.li<br>
 * <b>日期：</b> 2017-04-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectSalesVolumnProjectDTO {
    private Integer projectId;
    private List<String> nameIndex;
    private List<String> date;
    private List<List<String>> resData;
}

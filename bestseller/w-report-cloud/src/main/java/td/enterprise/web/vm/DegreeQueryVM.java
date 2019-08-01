package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 项目查询参数
 */
@Setter
@Getter
@ToString
public class DegreeQueryVM {
    private Integer projectId;
    private String startDate;
    private String endDate;
    private Integer type;

}

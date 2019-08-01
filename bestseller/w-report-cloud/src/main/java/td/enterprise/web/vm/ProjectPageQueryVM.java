package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.page.BasePage;

/**
 * 项目指标分页查询参数
 */
@Setter
@Getter
@ToString
public class ProjectPageQueryVM extends BasePage {
    private Integer projectId;
    private String startDate;
    private String endDate;
}

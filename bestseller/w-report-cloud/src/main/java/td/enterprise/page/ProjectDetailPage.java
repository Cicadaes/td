package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by Administrator on 2017/6/20.
 */
@Getter
@Setter
@ToString
public class ProjectDetailPage extends BasePage {
    private Integer projectId;
    private String projectName;
    private String principal;
    private String position;
    private String department;
    private String email;
    private String phone1;
    private String phone2;
}

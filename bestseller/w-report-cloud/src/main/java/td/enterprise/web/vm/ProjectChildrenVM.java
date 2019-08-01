package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class ProjectChildrenVM {

    private String projectId; //项目ID
    private String parentId;  //父项目ID
    private String projectName;
    private String projectType;
    private Integer layer;    //层级

}

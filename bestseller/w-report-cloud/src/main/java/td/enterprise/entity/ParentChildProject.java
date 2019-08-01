package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class ParentChildProject {

    private String id;//为了前台匹配，添加此字段
    private String projectName;
    private String projectId;
    private String projectType;
    private String city;

}

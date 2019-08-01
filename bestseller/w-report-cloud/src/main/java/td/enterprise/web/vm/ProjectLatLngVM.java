package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
/**
 * @description 城市店铺坐标vitrual model
 * @author sxk
 * @date 2017年10月9日
 */
@Getter
@Setter
@ToString
public class ProjectLatLngVM {
    private Integer projectId;
    //private String  position;
    private String  projectName;
    //private String  city;
    //private String  projectType;
    private String  latitude;
    private String  longitude;
}

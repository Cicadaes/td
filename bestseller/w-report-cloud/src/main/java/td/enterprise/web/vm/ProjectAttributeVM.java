package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.ParentChildProject;

import java.util.List;

@Getter
@Setter
@ToString
public class ProjectAttributeVM {

    //唯一标识
    private Integer id;

    //项目名称
    private String projectName;

    //status 状态 1：生效，-1：失效
    private Integer status;

    /**
     * 项目类型
     * {@link td.enterprise.entity.type.ProjectTypeEnum}
     */
    private Integer projectType;

    //项目位置信息
    private String projectPosition;

    //营业开始时间 HH：MM，比如，09:00'
    private String openingTime;

    //营业结束时间 HH：MM，比如，18:00'
    private String closingTime;

    //租户
    private String tenantId;

    //项目坐标-经度,百度坐标
    private String longitude;

    //项目坐标-纬度,百度坐标
    private String latitude;

    //项目所在城市名称
    private String city;

    //竞品比较项目ID
    private Integer relatedId;

    //项目归属
    private String affiliation;

    //项目描述
    private String description;

    //店组、店铺编号
    private String projectNum;

    //备注信息
    private String projectRemark;

    //面积
    private String area;

    //排序字段
    private Integer orderline;

    //图片路径
    private String picUrl;

    //默认人群
    private String defaultCrowd;

    //项目类别细分
    private String category;

    //品牌
    private String brand;

    //类型
    private String typeId;

    //阀值
    private String activeUserVisitMinutes;
    private String projectStayUserMinutes;
    private String projectTimeoutMinutes;
    private String thresholdTimeUnit;
    private String stayTimeDistributionUnit;

    private List<ParentChildProject> childProjectList;
    private List<ParentChildProject> projectList;

    //项目属性
    private String principal;
    private String position;
    private String department;
    private String email;
    private String phone1;
    private String phone2;

}

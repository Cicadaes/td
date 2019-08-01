package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目 ProjectEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class Project extends BaseEntity {

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

  //营业开始时间 HH：MM，比如，09:00
  private String openingTime;

  //营业结束时间 HH：MM，比如，18:00
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
  private Integer roomCount;

  private Integer ssidCount;

  private String region;
  private String province;
  private String channel;
  private String mall;
  private Integer downNums;

  private String logicalCity;
  private String county;
  private String cityType;
  private Integer cityLevel;

  private String projectParentName;// project 上游 名称
  private String projectChildrenNames;//project 下游 名称

  private String shopSize;//店铺大小：L、M、S。入店信号强度

  @Override
  public boolean equals(Object obj) {
    if (obj == null) {
      return false;
    }
    if (this == obj) {
      return true;
    }
    if (obj instanceof Project) {
      Project project = (Project) obj;
      if (this.id == project.getId()) {
        return true;
      }
    }
    return false;
  }

  /**
   * 重写hashcode 方法，返回的hashCode 不一样才认定为不同的对象
   */
  @Override
  public int hashCode() {
    return id.hashCode();
  }

}


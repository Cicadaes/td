package td.enterprise.page;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Builder;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.entity.Project;

/**
 * <br>
 * <b>功能：</b>项目 ProjectPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectPage extends BasePage {

  private Integer id;
  private Integer status;
  private String projectName;
  private Integer projectType;
  private String projectPosition;
  private String openingTime;
  private String closingTime;
  private String tenantId;
  private String createBy;
  private String creator;
  private String updateBy;
  private String updater;
  private Date createTime;
  private Date updateTime;
  private MultipartFile[] file;
  private Integer diagramId;

  private String startDate;
  private String endDate;

  private String longitude;
  private String latitude;
  private String city;

  private String region;
  private String province;
  private String channel;
  private String mall;

  private Integer type;
  private Integer relatedId; //竞品比较项目ID
  private String relatedIds; //竞品比较项目IDs
  private String affiliation; //项目归属
  private String description; //项目描述

  private String projectNum;//店组、店铺编号
  private String projectParentsId;//店组、店铺的上组店组
  private String projectChildrenId;//店组的下级店铺
  private String projectRemark;//备注信息
  private String area;//面积

  //阀值
  private String activeUserVisitMinutes;
  private String projectStayUserMinutes;
  private String projectTimeoutMinutes;
  private String thresholdTimeUnit;
  private String stayTimeDistributionUnit;

  private List<String> childProjectIdList;
  private List<String> projectNameList;
  private List<Project> projectList;

  private Integer orderline; //排序顺序

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

  private String rssi;

  private Integer downNums;

  private String logicalCity;
  private String county;
  private String cityType;
  private Integer cityLevel;

  private Map<String, Object> todayPassengerMap;

  private Map<String, Object> weekPassengerMap;

  private Map<String, Object> monthPassengerMap;

  private List<String> projectIds;

  //1全部 2收藏
  private int userRelationType;

  //登录账号
  private String umid;

  //项目属性
  private String principal;
  private String position;
  private String department;
  private String email;
  private String phone1;
  private String phone2;

  private String shopSize;//店铺大小：L、M、S。入店信号强度

  private List<String> shopCodeList = new ArrayList<>();

  private List<String> cCityCnNameList = new ArrayList<>();

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    ProjectPage that = (ProjectPage) o;
    return id.equals(that.id);

  }

  @Override
  public int hashCode() {
    return id.hashCode();
  }

}

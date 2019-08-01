package td.enterprise.web.vm;

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
public class CompeteProjectVM {

    //唯一标识
    private Integer id;

    //项目名称
    private String projectName;

    //status 状态 1：生效，-1：失效
    private Integer status;

    //项目类型
    private Integer projectType;

    //项目位置信息
    private String projectPosition;

    //租户
    private String tenantId;

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

    //图片路径
    private String picUrl;

    //默认人群
    private String defaultCrowd;

    //项目类别细分
    private String category;

    private Integer roomCount;

    private Integer ssidCount;

    private String dataSources;
    private String startDate;
    private String endDate;

}


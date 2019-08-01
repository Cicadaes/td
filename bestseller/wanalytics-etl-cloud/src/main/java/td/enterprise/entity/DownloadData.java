package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

/**
 * <br>
 * <b>功能：</b>数据下载 DownloadDataEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-07 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString

public class DownloadData extends BaseEntity {

    private Integer id;
    private String name;
    private String code;
    private String type;
    private String startDate;
    private String endDate;
    private Integer sequence;
    private Integer isRecurring;   //0, 独立任务  1, 周期任务
    private Integer duration;
    private Integer status;   //0，没执行， 1，执行成功、周期才有，2，历史任务
    private String filePath;
    private Integer projectId;
    private String tenantId;
    //创建人账号
    private String createBy;

    //创建人
    private String creator;

    //修改人账号
    private String updateBy;

    //修改人
    private String updater;

    //创建时间
    private Timestamp createTime;

    //修改时间
    private Timestamp updateTime;
}


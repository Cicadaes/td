package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    private Integer isRecurring;
    private Integer duration;
    private Integer status;
    private String filePath;
    private Integer projectId;
    private String tenantId;

}


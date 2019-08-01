package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.service.DTO.ThresholdValueDTO;

import java.util.Map;

/**
 * <br>
 * <b>功能：</b>批量设置 ProjectBatchConfigEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Setter
@Getter
@ToString
public class ProjectBatchConfigVM {

    private String projectId;
    private String projectName;
    private String projectNum;
    private String city;
    private Map<String, String> customLabelData;
    private CrowdBlackListFilterVM crowdBlackListData;
    private ThresholdValueDTO thresholdValueData;
    private String themeData;

}


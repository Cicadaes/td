package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>调用批处理任务记录表 BatchRecordPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BatchRecordPage extends BasePage {

    private Integer id;
    private String batchId;
    private Integer projectId;
    private Integer roomId;
    private String batchName;
    private String batchFlowName;
    private Date batchStartTime;
    private Date batchEndTime;
    private Integer status;
    private String calculateDate;
}

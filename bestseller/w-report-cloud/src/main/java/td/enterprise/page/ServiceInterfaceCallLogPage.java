package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>服务接口调用日志 ServiceInterfaceCallLogPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-18 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ServiceInterfaceCallLogPage extends BasePage {

    private Integer id;
    private String serviceCode;
    private String serviceName;
    private String type;
    private String taskId;
    private String runDate;
    private Integer status;
    private Integer crowdId;
    private String crowdName;
    private Integer projectId;
    private String projectName;
    private String tenantId;
    private long startTimeLong;        //用于接收前端传过来的date long
    private long finishTimeLong;
    private Date beginTime;  //用于和run_date 字段做查询
    private Date endTime;    //用于和run_date 字段做查询
    private Date startTime;
    private Date finishTime;
    private String azkabanExecId;
    private String param;
    private String errorInfo;

}

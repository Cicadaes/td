package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>导出参数 <br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ExportParam {
    private String tenantId;
    private int projectId;
    private int sensorId;
    private String startDate;
    private String endDate;
    private String exportType;
    private int crowd1Id;  //人群画像 客群id
    private int crowd2Id;

    private int sourceRoomId;//选择房间id
    private int compareRoomId;//对比房间id

    private String chartCatagory;//数据类型，如均值、总值

    private String q;//查询条件

}

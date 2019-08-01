package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 店铺指标查询
 */
@Setter
@Getter
@ToString
public class RoomQueryVM {
    private Integer projectId;
    private String startDate;
    private String endDate;
    private String chartType; //图表类型，进店，新客，老客，停留，进店率，
    private String chartCatagory;  //分类类型 总值，均值

    private Integer roomId; //


}

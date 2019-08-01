package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：消费能力查询对象</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ConsumingAbilityQueryVM {
    private String startDate;
    private String endDate;
    private Integer projectId;
    private Integer phonebrandlimit;//手机品牌
    private Integer shopcenterlimit;//Shoppingmall足迹
    private Integer shopbrandlimit;// 品牌足迹（非餐饮）
    private Integer restaurantbrandlimit;// 品牌足迹（餐饮）
    private Integer crowdId;

    private String execId; //调用azkaban 执行任务返回id

}

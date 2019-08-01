package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.service.DTO.Tag;

import java.util.List;

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
public class ConsumingAbilityVM {
    private Integer projectId;
    private Integer crowdId;
    private List<Tag> shopCenterList; //
    private List<Tag> restaurantbrandList; //
    private List<Tag> shopBrandList; //
    private List<Tag> phoneBrandList; //
    private List<Tag> phonePriceList; //

}

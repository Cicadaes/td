package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <br>
 * <b>功能：竞品管理 top10店铺</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class RoomVM {
    private String projectId;
    private List<TopRoomVM> list;
}

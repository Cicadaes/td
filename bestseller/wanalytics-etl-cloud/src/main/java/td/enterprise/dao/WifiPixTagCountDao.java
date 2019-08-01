package td.enterprise.dao;

import td.enterprise.entity.WifiPixTagCount;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>wifiPix标签统计 WifiPixTagCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface WifiPixTagCountDao extends BaseDao<WifiPixTagCount> {

    void batchDeleteByProjectAndDate(WifiPixTagCount page);
    void batchSelectAndInsert(WifiPixTagCount page);

}

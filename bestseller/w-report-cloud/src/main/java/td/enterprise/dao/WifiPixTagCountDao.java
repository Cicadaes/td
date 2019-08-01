package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.WifiPixTagCount;
import td.enterprise.page.WifiPixTagCountPage;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>wifiPix标签统计 WifiPixTagCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface WifiPixTagCountDao extends BaseDao<WifiPixTagCount> {

    List<WifiPixTagCount> queryExists(WifiPixTagCount wifiPixTagCount);

    List<WifiPixTagCount> queryOften2Go(Map<String, Object> map);

    WifiPixTagCount queryLatestRow(WifiPixTagCountPage page);

    List<WifiPixTagCount> queryChildrenSum(WifiPixTagCountPage page);

    void batchDeleteByProjectAndDate(WifiPixTagCountPage page);

    void batchInsert(List<WifiPixTagCount> list);

    void batchSelectAndInsert(WifiPixTagCountPage page);

}

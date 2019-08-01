package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.LookalikeCrowd;
import td.enterprise.page.LookalikeCrowdPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>相似人群 LookalikeCrowdDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface LookalikeCrowdDao extends BaseDao<LookalikeCrowd> {

    List<LookalikeCrowd> queryByListWithOtherCrowd(LookalikeCrowdPage page);

    int queryByCountWithOtherCrowd(LookalikeCrowdPage page);
}

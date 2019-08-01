package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.Crowd;

/**
 * <br>
 * <b>功能：</b>人群 CrowdDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface CrowdDao extends BaseDao<Crowd> {
    Crowd findOneByProjectIdAndType(String projectId, String type);

    int updateCrowdsById(Crowd record);
}

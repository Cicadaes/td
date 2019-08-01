package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.KmeansCrowdResult;
import td.enterprise.page.KmeansCrowdResultPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>聚类客群任务计算结果 KmeansCrowdResultDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface KmeansCrowdResultDao extends BaseDao<KmeansCrowdResult> {
    int deleteByKmeansCrowdId(int crowdId);

    List<KmeansCrowdResult> queryListByParam(KmeansCrowdResultPage page);

    List<KmeansCrowdResult> queryClassificationByParam(KmeansCrowdResultPage page);

    List<KmeansCrowdResult> queryDataNameByParam(KmeansCrowdResultPage page);

    List<KmeansCrowdResult> queryListByDataName(KmeansCrowdResultPage page);

    int updateClassification(KmeansCrowdResultPage page);
}

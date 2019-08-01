package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.KmeansCrowdResultDao;
import td.enterprise.entity.KmeansCrowdResult;
import td.enterprise.page.KmeansCrowdResultPage;
import td.enterprise.service.DTO.KmeansCrowdResultTag;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>聚类客群任务计算结果 KmeansCrowdResultService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("kmeansCrowdResultService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class KmeansCrowdResultService extends BaseService<KmeansCrowdResult> {
    public final static Logger logger = Logger.getLogger(KmeansCrowdResultService.class);
    private static final String decimalFormatStr = "#.###";

    @Autowired
    private KmeansCrowdResultDao dao;

    public KmeansCrowdResultDao getDao() {
        return dao;
    }

    public int deleteByKmeansCrowdId(int crowdId) {
        return dao.deleteByKmeansCrowdId(crowdId);
    }

    public List<KmeansCrowdResult> queryListByParam(KmeansCrowdResultPage page) {
        return dao.queryListByParam(page);
    }

    /**
     * 数据名
     *
     * @param page
     * @return
     */
    public List<KmeansCrowdResult> queryDataNameByParam(KmeansCrowdResultPage page) {
        return dao.queryDataNameByParam(page);
    }

    /**
     * 更新类型
     *
     * @param params
     * @return
     */
    public int updateClassification(Map<String, Object> params) {
        KmeansCrowdResultPage page = new KmeansCrowdResultPage();
        String type = (String) params.get("updateType");
        String oldValue = String.valueOf(params.get("oldValue"));
        String newValue = String.valueOf(params.get("newValue"));
        String crowdId = String.valueOf(params.get("kmeansCrowdId"));
        page.setKmeansCrowdId(Integer.valueOf(crowdId));
        if ("classificationName".equals(type)) {
            page.setClassificationName(newValue);
            page.setOldClassificationName(oldValue);
        } else if ("classificationDescription".equals(type)) {
            String classificationName = String.valueOf(params.get("classificationName"));
            page.setOldClassificationName(classificationName);
            page.setClassificationDescription(newValue);
        }
        return dao.updateClassification(page);
    }

    /**
     * 构建人群标签结果
     *
     * @param page
     * @return
     */
    public List<KmeansCrowdResultTag> buildKmeansCrowdResultTags(KmeansCrowdResultPage page) {
        List<KmeansCrowdResult> names = queryDataNameByParam(page);
        KmeansCrowdResultTag tag = null;
        List<KmeansCrowdResultTag> list = new ArrayList<>();

        for (KmeansCrowdResult name : names) {
            page.setDataName(name.getDataName());
            List<KmeansCrowdResult> crowdResultList = dao.queryListByDataName(page);
            tag = new KmeansCrowdResultTag();
            tag.setDataName(name.getDataName());
            tag.setProjectId(name.getProjectId());
            tag.setTenantId(name.getTenantId());
            tag.setClassifications(crowdResultList);
            list.add(tag);
        }

        return list;
    }

    /**
     * 分类
     *
     * @param page
     * @return
     */
    public List<KmeansCrowdResult> queryClassificationByParam(KmeansCrowdResultPage page) {
        DecimalFormat decimalFormat = new DecimalFormat(decimalFormatStr);

        List<KmeansCrowdResult> list = dao.queryClassificationByParam(page);
        for (KmeansCrowdResult crowdResult : list) {
            crowdResult.setPercentStr(decimalFormat.format(100 * crowdResult.getPercent()));
        }
        return list;
    }
}

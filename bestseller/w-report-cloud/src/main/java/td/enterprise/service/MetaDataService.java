package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.MetaDataDao;
import td.enterprise.entity.MetaData;
import td.enterprise.page.MetaDataPage;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.MetaDataType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>元数据信息表 MetaDataService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("metaDataService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class MetaDataService extends BaseService<MetaData> {
    public final static Logger logger = Logger.getLogger(MetaDataService.class);

    @Autowired
    private MetaDataDao dao;

    public MetaDataDao getDao() {
        return dao;
    }

    /**
     * 添加项目数据字典
     *
     * @param metaData
     * @return
     */
    public MetaData addMetaData(MetaData metaData) {
        User user = UserInfoUtil.getUser();
        String tenantId = metaData.getTenantId();
        MetaDataPage page = new MetaDataPage();
        page.setTenantId(tenantId);
        page.setDataValue(metaData.getDataValue());

        MetaData t = new MetaData();
        try {
            List<MetaData> dics = dao.queryByList(page);

            if (dics == null || dics.size() == 0) {
                //创建数据信息
                t.setTenantId(tenantId);
                t.setDataType(MetaDataType.BRAND.toString());
                t.setDataValue(metaData.getDataValue());
                t.setCreateBy(user.getUmid());
                t.setCreator(user.getUmid());
                dao.insert(t);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return t;
    }

    /**
     * 批量获取的项目字典
     *
     * @param dataType
     * @param tenantId
     * @return
     * @throws Exception
     */
    public Map <String, Object> getMetaDataValues(String dataType, String tenantId) throws Exception {
        String[] dicNames = dataType.split(",");
        Map <String, Object> metaDataMap = new HashMap <>();
        for (String metaDataN : dicNames) {
            MetaDataPage page = new MetaDataPage();
            String dataTypeName = dataType.split("_")[0];
            page.setDataType(dataTypeName);
            page.setTenantId(tenantId);
            String key = metaDataN;
            Object value = getValue(key, page);
            metaDataMap.put(dataTypeName, value);
        }
        return metaDataMap;
    }
    /**
     *
     * 获取某种类型的全部项目参数
     *
     * @param page
     * @return
     * @throws Exception
     */
    public Map<String, List<MetaData>> getMetaDataValues(MetaDataPage page) throws Exception {
        Map<String, List<MetaData>> metaDataMap = new HashMap<>();

        String dataType = page.getDataType();
        if (dataType != null && !dataType.equals("")) {
            User user = td.enterprise.web.util.UserInfoUtil.getUser();
            String tenantId = UserInfoUtil.getCurrentTenantId();
            page.setTenantId(tenantId);

            String[] dicNames = dataType.split(",");
            for (String metaDataN : dicNames) {
                String dataTypeName = dataType.split("_")[0];
                page.setDataType(dataTypeName);
                String key = metaDataN;
                List<MetaData> value = getValue(key, page);
                metaDataMap.put(dataTypeName, value);
            }
        }
        return metaDataMap;
    }

    /**
     * 获取值
     *
     * @param key
     * @param page
     * @return
     */
    private List<MetaData> getValue(String key, MetaDataPage page) {
        List<MetaData> result = null;
        try {
            result = searchCacheValue(page);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 获取缓存（后改为直接从数据库中取）
     *
     * @param page
     * @return
     * @throws Exception
     */
    private List<MetaData> searchCacheValue(MetaDataPage page) throws Exception {
        page.setPageEnabled(false);
        return dao.queryByList(page);
    }
}

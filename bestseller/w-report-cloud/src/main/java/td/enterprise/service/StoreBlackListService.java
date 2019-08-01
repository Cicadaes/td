package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.dao.StoreBlackListDao;
import td.enterprise.entity.StoreBlackList;
import td.enterprise.page.StoreBlackListPage;
import td.enterprise.web.util.UserInfoUtil;

import java.io.InputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>店铺黑名单 StoreBlackListService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-04 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("storeBlackListService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class StoreBlackListService extends BaseService<StoreBlackList> {
    public final static Logger logger = Logger.getLogger(StoreBlackListService.class);

    @Autowired
    private StoreBlackListDao dao;

    public StoreBlackListDao getDao() {
        return dao;
    }

    /**
     * 新建店铺黑名单
     *
     * @param storeBlackList
     * @return
     * @throws Exception
     */
    public StoreBlackList create(StoreBlackList storeBlackList) throws Exception {
        User user = UserInfoUtil.getUser();
        storeBlackList.setCreateBy(user.getUmid());
        storeBlackList.setCreator(user.getUmid());
        storeBlackList.setStatus(1);
        storeBlackList.setSource(ReportConstants.CrowdBlackListType.ADD_BY_HAND);
        storeBlackList.setTenantId(UserInfoUtil.getCurrentUserTenantId());

        dao.insert(storeBlackList);
        return storeBlackList;
    }

    /**
     * 更新店铺黑名单
     *
     * @param storeBlackList
     * @return
     * @throws Exception
     */
    public StoreBlackList update(@RequestBody StoreBlackList storeBlackList) throws Exception {
        User user = UserInfoUtil.getUser();
        storeBlackList.setUpdateBy(user.getUmid());
        storeBlackList.setUpdater(user.getUmid());
        dao.updateByPrimaryKeySelective(storeBlackList);
        return storeBlackList;
    }

    /**
     * 批量导入店铺黑名单
     *
     * @param file
     * @param projectId
     * @param storeType
     * @return
     * @throws Exception
     */
    public List<String> batchImport(MultipartFile file, String projectId, int storeType) throws Exception {

        User user = UserInfoUtil.getUser();
        List<String> errMsgList = new ArrayList<>();
        if (file != null) {
            logger.info("black.store.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file.getSize());
            InputStream is = file.getInputStream();

            String sheetName = "Sheet1";
            int startRowNum = 1;
            List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);
            if (datas.size() == 0) {
                errMsgList.add("导入模板数据为空");
            }
            boolean exist = false;
            for (String[] strArray : datas) {
                if (strArray.length == 0 ||
                        strArray[0] == null) {  //stroeName,为null，跳到下条记录
                    continue;
                }
                List<StoreBlackList> checkList = isExist(strArray[0], storeType, projectId);
                if (checkList == null || checkList.size() <= 0) {
                    StoreBlackList storeBlackList = new StoreBlackList();
                    storeBlackList.setStoreName(strArray[0]);
                    storeBlackList.setStoreType(storeType);
                    storeBlackList.setTenantId(UserInfoUtil.getCurrentUserTenantId());
                    storeBlackList.setProjectId(Integer.parseInt(projectId));
                    storeBlackList.setCreateBy(user.getUmid());
                    storeBlackList.setCreator(user.getUmid());
                    storeBlackList.setStatus(1);
                    storeBlackList.setSource(ReportConstants.CrowdBlackListType.ADD_BY_BATCH_IMPORT);
                    dao.insert(storeBlackList);
                }
            }
        }
        return errMsgList;
    }

    private List<StoreBlackList> isExist(String storeName, int storeType, String projectId) throws Exception {
        String tenantId = UserInfoUtil.getCurrentTenantId();
        StoreBlackListPage page = new StoreBlackListPage();
        page.setStoreName(URLDecoder.decode(storeName, "UTF-8"));
        page.setStoreType(storeType);
        page.setProjectId(Integer.parseInt(projectId));
        page.setTenantId(tenantId);
        List<StoreBlackList> rows = dao.queryByList(page);
        return rows;
    }

}

package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.dao.AppWhiteListDao;
import td.enterprise.entity.AppInfo;
import td.enterprise.entity.AppWhiteList;
import td.enterprise.page.AppInfoPage;
import td.enterprise.page.AppWhiteListPage;
import td.enterprise.web.util.UserInfoUtil;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>App白名单 AppWhiteListService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("appWhiteListService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AppWhiteListService extends BaseService<AppWhiteList> {
    public final static Logger logger = Logger.getLogger(AppWhiteListService.class);

    @Autowired
    private AppWhiteListDao dao;
    @Autowired
    private AppInfoService appInfoService;

    public AppWhiteListDao getDao() {
        return dao;
    }

    private static Map<String, String> cacheMap = null; //key app_hash  value platform

    /**
     * 新建白名单
     *
     * @param appWhiteList
     * @return
     * @throws Exception
     */
    public List<String> create(AppWhiteList appWhiteList) throws Exception {
        List<String> msg = new ArrayList<>();
        User user = UserInfoUtil.getUser();
        String appName = appWhiteList.getAppName();
        msg = insertAppWhiteInfo(appName, user, msg, ReportConstants.AppWhiteListSource.BY_HAND);
        return msg;
    }

    /**
     * 批量导入白名单
     *
     * @param file
     * @return
     * @throws Exception
     */
    public List<String> batchImport(MultipartFile file) throws Exception {
        User user = UserInfoUtil.getUser();
        List<String> msg = new ArrayList<>();
        if (file != null) {
            InputStream is = file.getInputStream();
            String sheetName = "Sheet1";
            int startRowNum = 1;
            List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);
            String appName = "";
            for (String[] strArray : datas) {
                if (strArray.length == 0 ||
                        strArray[0] == null) {  //appName,为null，跳到下条记录
                    continue;
                }
                appName = strArray[0];
                if (strArray.length > 0) {
                    msg = insertAppWhiteInfo(appName, user, msg, ReportConstants.AppWhiteListSource.BY_IMPORT);
                }
            }
        }
        return msg;
    }

    private List<String> insertAppWhiteInfo(String appName, User user, List<String> msg, int source) throws Exception {
        AppInfo appInfo = new AppInfo();
        AppWhiteList appWhiteList = new AppWhiteList();
        AppWhiteListPage appWhiteListPage = new AppWhiteListPage();
        List<AppInfo> appInfoList = new ArrayList<>();
        AppInfoPage page = new AppInfoPage();
        page.setAppName(appName);
        appInfoList = appInfoService.queryByList(page);
        if (!appInfoList.isEmpty()) {
            for (AppInfo a : appInfoList) {
                appInfo = a;
                appWhiteListPage.setAppHash(appInfo.getAppHash());
                appWhiteListPage.setTenantId(UserInfoUtil.getCurrentUserTenantId());
                if (dao.queryByCount(appWhiteListPage) > 0) {
                    //appHash 已存在,跳到下条导入
                    msg.add("App名称：" + appName + " ,已存在 ");
                    continue;
                }
                appWhiteList.setAppName(appInfo.getAppName());
                appWhiteList.setAppHash(appInfo.getAppHash());
                appWhiteList.setAppVersion(appInfo.getAppVersion());
                appWhiteList.setCreateBy(user.getUmid());
                appWhiteList.setCreator(user.getUmid());
                appWhiteList.setPlatform(appInfo.getPlatform());
                appWhiteList.setSource(source);
                appWhiteList.setStatus(ReportConstants.AppWhiteListStatus.AVALIABLE);
                appWhiteList.setTenantId(UserInfoUtil.getCurrentUserTenantId());
                dao.insert(appWhiteList);
                logger.info("批量导入AppWhiteList , appName=" + appName + " ,appHash=" + appInfo.getAppHash());
            }
        } else {
            msg.add("App名称：" + appName + " ,没有在AppInfo表中匹配到对应APP信息");
            logger.error("批量导入AppWhiteList , appName=" + appName + " ,没有在appInfo表中匹配到对应APP信息");
        }
        return msg;
    }
}

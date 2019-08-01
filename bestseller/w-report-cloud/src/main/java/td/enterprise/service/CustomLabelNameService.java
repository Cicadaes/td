package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.CustomLabelNameDao;
import td.enterprise.entity.CustomLabelName;
import td.enterprise.page.CustomLabelNamePage;
import td.enterprise.web.util.UserInfoUtil;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>用户自定义标签名 CustomLabelNameService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("customLabelNameService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CustomLabelNameService extends BaseService<CustomLabelName> {
    public final static Logger logger = Logger.getLogger(CustomLabelNameService.class);

    @Autowired
    private CustomLabelNameDao dao;

    public CustomLabelNameDao getDao() {
        return dao;
    }

    /**
     * 查询并检查若没有则创建默认值
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List<CustomLabelName> query(CustomLabelNamePage page) throws Exception {
        List<CustomLabelName> customLabelNames = queryByList(page);
        CustomLabelNamePage customLabelNamePage = new CustomLabelNamePage();
        customLabelNamePage.setStatus(ReportConstants.DefaultStatus.DEFAULT + "");
        String projectId = page.getProjectId();
        List<CustomLabelName> defaultCustomLabelNames = queryByList(customLabelNamePage);
        User user = UserInfoUtil.getUser();
        if (customLabelNames != null) {
            for (CustomLabelName defaultCustomLabelName : defaultCustomLabelNames) {
                String value = defaultCustomLabelName.getLabel();
                boolean exist = false;
                for (CustomLabelName customLabelName : customLabelNames) {
                    if (customLabelName.getLabel().equals(value)) {
                        exist = true;
                    }
                }
                if (!exist) {
                    CustomLabelName customLabelName = getCustomLabelName(user, projectId, defaultCustomLabelName);
                    dao.insert(customLabelName);
                }
            }
        } else {
            for (CustomLabelName defaultCustomLabelName : defaultCustomLabelNames) {
                CustomLabelName customLabelName = getCustomLabelName(user, projectId, defaultCustomLabelName);
                dao.insert(customLabelName);
            }
        }
        customLabelNames = queryByList(page);

        return customLabelNames;
    }

    /**
     * 获取某默认标签对象
     *
     * @param user
     * @param projectId
     * @param defaultCustomLabelName
     * @return
     */
    private CustomLabelName getCustomLabelName(User user, String projectId, CustomLabelName defaultCustomLabelName) {
        CustomLabelName customLabelName = new CustomLabelName();
        customLabelName.setProjectId(projectId);
        customLabelName.setLabel(defaultCustomLabelName.getLabel());
        customLabelName.setName(defaultCustomLabelName.getName());
        customLabelName.setStatus(ReportConstants.DefaultStatus.AVALIABLE + "");
        customLabelName.setCreateBy(user.getUmid());
        customLabelName.setCreator(user.getUmid());
        return customLabelName;
    }
}

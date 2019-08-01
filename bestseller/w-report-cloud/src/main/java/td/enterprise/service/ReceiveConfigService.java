package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ReceiveConfigDao;
import td.enterprise.entity.ReceiveConfig;
import td.enterprise.page.ReceiveConfigPage;
import td.enterprise.web.util.UserInfoUtil;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>接收配置表 ReceiveConfigService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("receiveConfigService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ReceiveConfigService extends BaseService<ReceiveConfig> {
    public final static Logger logger = Logger.getLogger(ReceiveConfigService.class);

    @Autowired
    private ReceiveConfigDao dao;

    public ReceiveConfigDao getDao() {
        return dao;
    }

    public List<String> checkPwd(String uniqueId) {
        return dao.checkPwd(uniqueId);
    }

    public List<ReceiveConfig> queryByAllList(ReceiveConfigPage page) {
        return dao.queryByAllList(page);
    }

    public List<ReceiveConfig> queryByTenantList(ReceiveConfigPage page) {
        return dao.queryByTenantList(page);
    }

    /**
     * 创建接收配置
     *
     * @param receiveConfig
     * @return
     * @throws Exception
     */
    public ReceiveConfig create(ReceiveConfig receiveConfig) throws Exception {
        User user = UserInfoUtil.getUser();
        String tenantId = UserInfoUtil.getCurrentUserTenantId();
        if (tenantId != null) {
            receiveConfig.setUniqueId(tenantId);
            receiveConfig.setKafkaTopic(tenantId);
            receiveConfig.setStatus(1);
            receiveConfig.setIsTenant(1);
            List<String> pwds = dao.checkPwd(tenantId);
            String sftpPwd = "";
            if (pwds != null && pwds.size() > 0) {
                sftpPwd = pwds.get(0);
            } else {
//				sftpPwd = CommonUtil.getUUID();
            }
            receiveConfig.setSftpPwd(sftpPwd);

            User operatorUser = UserInfoUtil.getUser();
            String operatorUmid = operatorUser.getUmid();
            String operatorName = operatorUser.getUserName();

            //默认配置
            receiveConfig.setReceiveMode(1);  //0实时，1间隔
            receiveConfig.setReceiveInterval(10 * 60);  //10分钟

            ReceiveConfigPage page = new ReceiveConfigPage();
            page.setUniqueId(tenantId);

            List<ReceiveConfig> rows = dao.queryByList(page);
            if (rows.size() > 0) {
                receiveConfig.setUpdateBy(operatorUmid);
                receiveConfig.setUpdater(operatorName);
                dao.updateByPrimaryKeySelective(receiveConfig);
            } else {
                receiveConfig.setCreateBy(operatorUmid);
                receiveConfig.setCreator(operatorName);
                dao.insert(receiveConfig);
            }
        }
        return receiveConfig;
    }

    /**
     * 更新接收配置
     *
     * @param receiveConfig
     * @return
     * @throws Exception
     */
    public ReceiveConfig update(ReceiveConfig receiveConfig) throws Exception {
        User user = UserInfoUtil.getUser();
        String tenantId = UserInfoUtil.getCurrentUserTenantId();
        if (tenantId != null) {
            receiveConfig.setUniqueId(tenantId);
            receiveConfig.setKafkaTopic(tenantId);

            User operatorUser = UserInfoUtil.getUser();
            String operatorUmid = operatorUser.getUmid();
            String operatorName = operatorUser.getUserName();
            receiveConfig.setUpdateBy(operatorUmid);
            receiveConfig.setUpdater(operatorName);

            //默认配置
            receiveConfig.setReceiveMode(1);  //0实时，1间隔
            receiveConfig.setReceiveInterval(10 * 60);  //10分钟
            dao.updateByPrimaryKeySelective(receiveConfig);
        }
        return receiveConfig;
    }

}

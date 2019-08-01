package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import td.enterprise.dao.TenantDao;
import td.enterprise.entity.ReceiveConfig;
import td.enterprise.entity.Tenant;
import td.enterprise.page.ReceiveConfigPage;
import td.enterprise.page.TenantPage;
import td.enterprise.web.util.UserInfoUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * <br>
 * <b>功能：</b>租户信息 TenantService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-27 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantService extends BaseService<Tenant> {
    public final static Logger logger = Logger.getLogger(TenantService.class);

    @Autowired
    private TenantDao dao;
//	@Autowired
//	private SeriesDao seriesDao;
//	@Autowired
//	private SensorInstallInfoDao sensorInstallInfoDao;

    @Autowired
    private ReceiveConfigService receiveConfigService;

    public TenantDao getDao() {
        return dao;
    }

    public List<Tenant> queryBytend(TenantPage page) {
        List<Tenant> querylist = dao.queryBytend(page);
        return querylist;
    }

    public Tenant queryByUmid(String umid) throws Exception {
        List<Tenant> querylist = dao.queryByUmid(umid);
        if (querylist.size() != 1) {
            throw new Exception("TD_TENANT表中：" + umid + "数据异常！");
        }
        return querylist.get(0);
    }

    public List<Tenant> queryById(String id) {
        return dao.queryById(id);
    }

//	public Map<String, Object> queryByUmids(TenantPage page,String systemCode,String systemToken,String tenantId) throws Exception {
//		User operatorUser = UserInfoUtil.getUser();
//		List<Tenant> rows = new ArrayList<Tenant>();
//		int rowCount = 0;
//		page.getPager().setRowCount((page.getPage()-1)*page.getRows());
//		if(operatorUser.isTenantAdmin()){
//			List<User> umUsers = UmRmiServiceFactory.getSecurityService().getUserByTenentCode(systemCode, systemToken, tenantId);
//			List<String> umids = new ArrayList<String>();
//			for(User user: umUsers){
//				String umid = user.getUmid();
//				umids.add(umid);
//			}
//			page.setUmids(umids);
//			rows = dao.queryByUmids(page);
//			rowCount = dao.queryByUmidsCount(page);
//		}else{
//			Tenant tenant = queryByUmid(operatorUser.getUmid());
//			rows.add(tenant);
//			rowCount = dao.queryByCount(page);
//		}
//
//		queryCount(rows);
//
//		Map<String, Object> resultMap = new HashMap<String, Object>();
//		resultMap.put("total", rowCount);
//		resultMap.put("rows", rows);
//		return resultMap;
//	}

//	public Map<String, Object> queryByUmidsyj(TenantPage page,String systemCode,String systemToken,String tenantId) throws Exception {
//		User operatorUser = UserInfoUtil.getUser();
//		List<Tenant> rows = new ArrayList<Tenant>();
//		int rowCount = 0;
//		page.getPager().setRowCount((page.getPage()-1)*page.getRows());
//		if(operatorUser.isTenantAdmin()){
//			List<User> umUsers = UmRmiServiceFactory.getSecurityService().getUserByTenentCode(systemCode, systemToken, tenantId);
//			List<String> umids = new ArrayList<String>();
//			for(User user: umUsers){
//				String umid = user.getUmid();
//				umids.add(umid);
//			}
//			page.setUmids(umids);
//			rows = dao.queryByUmids(page);
//			rowCount = dao.queryByUmidsCount(page);
//		}else{
//			String realTenantId = operatorUser.getTenantId()+"";
//			List<User> umUsers = UmRmiServiceFactory.getSecurityService().getUserByTenentCode(systemCode, systemToken, realTenantId);
//			List<String> umids = new ArrayList<String>();
//			for(User user: umUsers){
//				String umid = user.getUmid();
//				umids.add(umid);
//			}
//			page.setUmids(umids);
//			rows = dao.queryBytend(page);
//			rowCount = dao.queryBytendCount(page);
//		}
//
//		queryCount(rows);
//
//		Map<String, Object> resultMap = new HashMap<String, Object>();
//		resultMap.put("total", rowCount);
//		resultMap.put("rows", rows);
//		return resultMap;
//	}

//	public Map<String, Object> queryByUmidsSd(TenantPage page,String systemCode,String systemToken,String tenantId) throws Exception {
////		User operatorUser = UserInfoUtil.getUser();
//		List<Tenant> rows = new ArrayList<Tenant>();
//		page.getPager().setRowCount((page.getPage()-1)*page.getRows());
////		if(operatorUser.isTenantAdmin()){
//			List<User> umUsers = UmRmiServiceFactory.getSecurityService().getUserByTenentCode(systemCode, systemToken, tenantId);
//			List<String> umids = new ArrayList<String>();
//			for(User user: umUsers){
//				String umid = user.getUmid();
//				umids.add(umid);
//			}
//			page.setUmids(umids);
//			if (page.getTenantHardId()==null || "".equals(page.getTenantHardId())) {
//				rows = dao.queryByUmidsSensorDataNoTenant(page);
//			}else{
//				rows = dao.queryByUmidsSensorDataHaveTenant(page);
//			}
////		}else{
////			rows = dao.queryByUmidsSensorData(page);
////		}
//		Map<String, Object> resultMap = new HashMap<String, Object>();
//		resultMap.put("rows", rows);
//		return resultMap;
//	}

//	private List<Tenant> queryCount(List<Tenant> rows){
//		for (Tenant tenant : rows) {
//			String tenantIdRow = tenant.getTenantId();
//			int queryByCount = 0;
//			if (tenant!=null && tenant.getType()!=null && tenant.getType()==1) {
//				SeriesPage seriesPage = new SeriesPage();
//				seriesPage.setTenantId(tenantIdRow);
//				seriesPage.getPager().setRowCount((seriesPage.getPage()-1)*seriesPage.getRows());
//				queryByCount = seriesDao.queryByCount(seriesPage);
//			}else{
//				SensorInstallInfoPage sensorInstallInfoPage = new SensorInstallInfoPage();
//				sensorInstallInfoPage.setTenantId(tenantIdRow);
//				sensorInstallInfoPage.getPager().setRowCount((sensorInstallInfoPage.getPage()-1)*sensorInstallInfoPage.getRows());
//				queryByCount = sensorInstallInfoDao.queryByCount(sensorInstallInfoPage);
//			}
//			tenant.setCounter(queryByCount);
//		}
//		return rows;
//	}

    /**
     * 创建租户
     *
     * @param tenant
     * @return
     * @throws Exception
     */
    public Tenant create(Tenant tenant) throws Exception {
        //校验session超时
        User user = UserInfoUtil.getUser();
        String tenantId = UserInfoUtil.getCurrentUserTenantId();
        if (tenantId != null) {
            //校验id
            List<Tenant> list = queryById(tenant.getTenantId() + "");
            if (list.size() > 0) {
                throw new Exception("ID已被使用！");
            }
            //添加UM
//			User userByUmId = UmRmiServiceFactory.getSecurityService().getUserByUmId(tenant.getUmid());
//			if(userByUmId!=null && userByUmId.getUmid().equals(tenant.getUmid())){
//				throw new Exception("账户名已被使用！");
//			}
            try {
                saveOrUpdateUMUser(tenant);
//				saveOrUpdateUMRole(tenant,request);
            } catch (Exception e) {
                throw new Exception(e.getMessage());
            }
            //添加数据库
            User operatorUser = UserInfoUtil.getUser();
            String operatorUmid = operatorUser.getUmid();
            String operatorName = operatorUser.getUserName();
            tenant.setCreateBy(operatorUmid);
            tenant.setCreator(operatorName);
            dao.insert(tenant);
            //合作商添加日志接收配置
            if (tenant.getType() == 2) {
                ReceiveConfig receiveConfig = new ReceiveConfig();
                receiveConfig.setUniqueId(tenant.getTenantId());
                receiveConfig.setIsTenant(1);
                List<String> pwds = receiveConfigService.checkPwd(tenant.getTenantId());
                String sftpPwd = "";
                if (pwds != null && pwds.size() > 0) {
                    sftpPwd = pwds.get(0);
                } else {
//	    			sftpPwd = CommonUtil.getUUID();
                }
                receiveConfig.setSftpPwd(sftpPwd);

                ReceiveConfigPage page = new ReceiveConfigPage();
                page.setUniqueId(tenant.getTenantId());

                List<ReceiveConfig> rows = receiveConfigService.queryByList(page);
                if (rows.size() > 0) {
                    receiveConfig.setUpdateBy(operatorUmid);
                    receiveConfig.setUpdater(operatorName);
                    receiveConfigService.updateByPrimaryKeySelective(receiveConfig);
                } else {
                    receiveConfig.setCreateBy(operatorUmid);
                    receiveConfig.setCreator(operatorName);
                    receiveConfigService.insert(receiveConfig);
                }
            }
        }
        return tenant;
    }

    /**
     * 更新租户
     *
     * @param tenant
     * @return
     * @throws Exception
     */
    public Tenant update(Tenant tenant) throws Exception {
        //校验id
        List<Tenant> list = queryById(tenant.getTenantId() + "");
        if (list.size() > 1) {
            throw new Exception("唯一ID异常！");
        }
        if (list.size() != 1) {
            throw new Exception("此ID不存在！");
        }
//    	//更新UM
//		try{
//			saveOrUpdateUMUser(tenant);
//		}catch(Exception e){
//			throw new Exception(e.getMessage());
//		}
        //更新数据库
        User operatorUser = UserInfoUtil.getUser();
        String operatorUmid = operatorUser.getUmid();
        String operatorName = operatorUser.getUserName();
        tenant.setUpdateBy(operatorUmid);
        tenant.setUpdater(operatorName);
        dao.updateByPrimaryKeySelective(tenant);
        return tenant;
    }

    /**
     * 删除租户
     *
     * @param tenantId
     * @return
     * @throws Exception
     */
    public Map<Object, Object> delete(@PathVariable String tenantId) throws Exception {
        //删除UM
//		WebApplicationContext ctx = null;
//		Properties sysConfig= new Properties();
//		try{
//			ctx=WebApplicationContextUtils.getWebApplicationContext(request.getServletContext());
//			sysConfig=(Properties)ctx.getBean("sysConfig");
//		}catch(Exception e){
//			logger.info("spring容器中没有sysConfig");
//		}
//		String systemCode=(String)sysConfig.get("systemCode");
//		String systemToken=(String)sysConfig.get("systemToken");
//		String umid = "";//TODO
////		String umid = tenant.getUmid();
//		User operatorUser = UserInfoUtil.getUser();
//		String operatorUmid = operatorUser.getUmid();
//    	UmRmiServiceFactory.getSecurityService().deleteUserByUmid(systemCode,systemToken,umid,operatorUmid);
        //删除数据库
        dao.deleteByPrimaryKey(tenantId);//tenantId实际为主键id
        //更新商更新日志接收配置
        Tenant tenant = dao.selectByPrimaryKey(tenantId);
        if (tenant.getType() == 2) {
            ReceiveConfig receiveConfig = new ReceiveConfig();
            receiveConfig.setUniqueId(tenantId);
            receiveConfig.setStatus(-1);
            receiveConfigService.updateByPrimaryKeySelective(receiveConfig);
        }
        return new HashMap<Object, Object>();
    }

    //添加\修改UM用户
    private static void saveOrUpdateUMUser(Tenant tenant) throws Exception {
        User user = new User();
//		user.setTenantId(realTenandId);
//		user.setUserName(tenant.getUmid());
//		user.setUmid(tenant.getUmid());
//		user.setUserPassword(tenant.getPassword());
//		user.setEmail(tenant.getUmid());
        UmRmiServiceFactory.getSecurityService().addOrUpdateUserWithPassword(user, "umadmin", "123456");
    }

    //添加\修改UM角色
//    private static void saveOrUpdateUMRole(Tenant tenant, HttpServletRequest request) throws Exception{
//		WebApplicationContext ctx = null;
//		Properties sysConfig= new Properties();
//		try{
//			ctx=WebApplicationContextUtils.getWebApplicationContext(request.getServletContext());
//			sysConfig=(Properties)ctx.getBean("sysConfig");
//		}catch(Exception e){
//			logger.info("spring容器中没有sysConfig");
//		}
//		String systemCode=(String)sysConfig.get("systemCode");
//		String systemToken=(String)sysConfig.get("systemToken");
//		List<String> roleCodeList = new ArrayList<String>();
//		if(tenant.getType()==1){
//			roleCodeList.add((String)sysConfig.get("roleyjs"));
//		}else if(tenant.getType()==2){
//			roleCodeList.add((String)sysConfig.get("rolehzs"));
//		}
//		String umid = "";//TODO
//		UmRmiServiceFactory.getSecurityService().allocateRoles(systemCode, systemToken, umid, roleCodeList);
//    }
}

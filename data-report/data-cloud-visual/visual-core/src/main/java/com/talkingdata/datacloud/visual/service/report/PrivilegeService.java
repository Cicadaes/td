package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.entity.report.Report;
import com.talkingdata.datacloud.visual.entity.report.ReportPrivilege;
import com.tendcloud.enterprise.um.umic.entity.ExtResource;
import com.tendcloud.enterprise.um.umic.entity.Role;
import com.tendcloud.enterprise.um.umic.entity.RoleResource;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.BusinessException;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service("privilegeService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PrivilegeService extends BaseService<Report, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PrivilegeService.class);
    private static final String resourceType="report";

    /**
     * UM权限获取服务
     */
    private SecurityService securityService = UmRmiServiceFactory.getSecurityService();

    private String appcode;
    private String apptaken;
    private String adminRoleCode;

    public void initApp(String appcodeEx,String apptakenEx,String adminRoleCodeEx){
        appcode = appcodeEx;
        apptaken = apptakenEx;
        adminRoleCode = adminRoleCodeEx;
    }

    public String getAppcode(){
        return appcode;
    }

    @Override
    public BaseDao<Report> getDao() {
        return null;
    }

    public User getUserByRequest(HttpServletRequest request) throws BusinessException {
        Principal principal= request.getUserPrincipal();
        if(principal==null){
            throw new BusinessException("Not Login Yet");
        }
        String umid = principal.getName();
        return securityService.getUserByUmId(umid);
    }

    /**
     * 返回应用的所有角色
     *
     * @param user        登录用户
     * @param dataAppCode 应用编码
     * @return 权限列表
     */
    public List<Role> findAllRole(User user, String dataAppCode) throws BusinessException {
        logger.info("userid="+user.getUmid()+",tenantId="+user.getTenantId()+",dataAppCode="+dataAppCode);
        // 增加要增加新的接口
        return securityService.getRoleByTenantAndAppID(String.valueOf(user.getTenantId()), dataAppCode);
    }

    /**
     * 判断用户是否为管理员
     * @return
     */
    public boolean isAdmin(User user, String dataAppCode) throws BusinessException{
        List<Role> roleList = findAllRole(user,dataAppCode);
        return isAdmin(roleList);
    }
    /**
     * 判断用户是否为管理员
     * @return
     */
    public boolean isAdmin(List<Role> roleList){
        if(roleList!=null && roleList.size()>0){
            for(Role role : roleList){
                // TODO
                if(role.getRoleCode().equals(adminRoleCode)){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 判断用户是否为管理员
     * @return
     */
    public boolean isAdmin() {
        List<Role> roleList = (List<Role>)getSession().getAttribute("roleList");
        if(roleList!=null && roleList.size()>0){
            for(Role role : roleList){
                // TODO
                if(role.getRoleCode().equals(adminRoleCode)){
                    return true;
                }
            }
        }
        return false;
    }

    public User getUser() throws BusinessException {
        User user = (User) getSession().getAttribute("user");
        return user;
    }

    public static HttpSession getSession(){
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes()).getRequest().getSession();
        return session;
    }

    /**
     *  当期用户对于的角色Ids
     * @return List
     */
    public List<String> getRoleIds() {
        List<Role> roleList = (List<Role>)getSession().getAttribute("roleList");
        ArrayList<String> rolesIds = new ArrayList<>();
        for (Role aRoleList : roleList) {
            rolesIds.add(String.valueOf(aRoleList.getRid()));
        }
        return rolesIds;
    }

    /**
     * 获取所有角色的Ids
     */
    private List<String> getAllRoleIds(User user, String appCode) throws BusinessException {
        List<String> roleIds = new ArrayList<>();
        List<Role> roles = findAllRole(user, appCode);
        for (Role role : roles) {
            roleIds.add(String.valueOf(role.getRid()));
        }
        return roleIds;
    }


    /**
     * 查看报表对应角色
     *
     * @param reportId 报表ID
     * @param user      权限
     * @param isAllRoles     在对报表权限进行解析时是否是所有角色，true：所有角色，false：当前用户所属角色
     */
    public List<ReportPrivilege> getPrivileges2Report(Integer reportId, User user, String appCode, boolean isAllRoles) throws BusinessException {
        logger.info("getPrivileges2Report : reportId =" + reportId + " userid=" + user.getUmid());
        ExtResource resource  = securityService.getResourceByCode(appCode, resourceType, String.valueOf(reportId));

        if(resource==null){
            return null;
        }
        List<RoleResource> roleResourceList = securityService.findRoleResourceByResourceId(String.valueOf(resource.getRid()));
        List<String> roleIds;
        if (isAllRoles) {
            roleIds = getAllRoleIds(user, appCode);
        } else {
            roleIds = getRoleIds();
        }
        List<ReportPrivilege> reportPrivilegeList=new ArrayList<>();
        for (RoleResource roleResource : roleResourceList) {
            String privilegeBitmap = roleResource.getAttr2();
            if(privilegeBitmap==null){
                logger.error(String.format("resource_rid: %s , role_rid: %s . 获取RoleResource中Attr2权限为空 ！",
                        roleResource.getResourceRid(), roleResource.getRoleRid()));
                continue;
            }
            if (roleIds.contains(roleResource.getRoleRid().toString())) {
                String bitmap = Integer.toBinaryString(Integer.valueOf(privilegeBitmap));
                ReportPrivilege reportPrivilege=ReportPrivilege.getPrivilageByBitmap(bitmap,roleResource.getRoleRid());
                reportPrivilegeList.add(reportPrivilege);
            }
        }
        return reportPrivilegeList;
    }

    /**
     * 给角色授权报表权限
     * 角色授权使用UM表中的UM_ROLE_RESOURCE的扩展属性存储权限信息.使用
     * attr1 1 表示报表
     * attr2 权限位信息,使用bitmap位存储,但实际存储时采用bitmap转int存储到物理存储中
     * attr3 标识这个角色是授权来的,还是继承来的
     *
     * @param reportId        报表ID
     * @param reportPrivilegeList 角色编码对象
     * @param user            用户
     */
    public void grantPrivileges2Report(Integer reportId, List<ReportPrivilege> reportPrivilegeList, User user, String appCode, String appTaken) throws BusinessException {
        ExtResource resource = securityService.getResourceByCode(appCode, resourceType, String.valueOf(reportId));
        if(resource==null){
            addResource(String.valueOf(user.getTenantId()), "", String.valueOf(reportId), "", appCode, appTaken);
            resource = securityService.getResourceByCode(appCode, resourceType, String.valueOf(reportId));
        }
        for (ReportPrivilege reportPrivilege : reportPrivilegeList) {
            String bitmap = reportPrivilege.privilege2Bitmap();
            securityService.deleteResourceRoleByRoleRid(resource.getRid().toString(),Integer.valueOf(reportPrivilege.getRoleId()));
            securityService.saveResourceRole(String.valueOf(resource.getRid()), Integer.valueOf(reportPrivilege.getRoleId()), user.getUmid(), resourceType, Integer.valueOf(bitmap, 2).toString(), "");
        }
    }

    /**
     * @param tenantId    租户ID
     * @param name        资源名称
     * @param resourceId  资源ID,report
     * @param resourceURN 资源URN
     * @throws BusinessException
     */
    public void addResource(String tenantId, String name, String resourceId, String resourceURN,String appCode,String appTaken) throws BusinessException {
        logger.info("增加资源：tenantId " + tenantId + " name : " + name + " resourceId : " + resourceId+ " resourceURN : " + resourceURN);
        securityService.addResource(appCode, appTaken, tenantId, resourceType, name, resourceId, resourceURN, "root");
    }

    public void deletePrivileges2Report(Integer reportId, String appCode, Integer roleRid) throws BusinessException {
        ExtResource resource = securityService.getResourceByCode(appCode, resourceType, String.valueOf(reportId));
        if(resource!=null){
            Integer resourceId = resource.getRid();
            securityService.deleteResourceRoleByRoleRid(resourceId.toString(),roleRid);
        }
    }

    public void deleteResource(Integer reportId) throws BusinessException {
        securityService.deleteResource(reportId);
    }

    /**
     * 查看当前请求用户拥有权限的reportId列表
     *
     * @param umid 当前用户id
     * @return 当前用户的reportId列表
     */
    public List<Integer> getUserResource(String umid,String appCode,String appTaken) throws BusinessException {
        List<Integer> resourceIds = new ArrayList<>();
        List<ExtResource> extReportResources = securityService.getExtResourcesByTypeAndUmid(appCode, appTaken, resourceType, umid);
        for(ExtResource extResource: extReportResources){
            if(extResource.getParentResourceRid()==0){
                continue;
            }
            resourceIds.add(Integer.parseInt(extResource.getResourceCode()));
        }
        return resourceIds;
    }
    public static void main(String[] args) {
        SecurityService securityService = UmRmiServiceFactory.getSecurityService();
        try{
            securityService.deleteResource(379);
            System.out.println("删除成功");
        }catch (Exception e){
            e.printStackTrace();
        }

    }
}

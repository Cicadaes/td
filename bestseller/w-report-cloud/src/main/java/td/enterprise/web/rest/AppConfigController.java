package td.enterprise.web.rest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import com.tendcloud.enterprise.um.umic.entity.ExtResource;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.constant.SessionConstant;
import td.enterprise.common.util.FileUtil;
import td.enterprise.entity.BsUser;
import td.enterprise.entity.DicItem;
import td.enterprise.entity.ProjectUserRelation;
import td.enterprise.page.ProjectUserRelationPage;
import td.enterprise.service.*;
import td.enterprise.service.manager.DicService;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.UserBean;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AppConfig 登录配置接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class AppConfigController extends BaseController {

    public final static Logger logger = Logger.getLogger(AppConfigController.class);

    @Autowired
    private ProjectService projectService;


    @Autowired
    private ParamService paramService;

    @Autowired
    private ProjectUserRelationService projectUserRelationService;

    @Autowired
    private ProjectParamService projectParamService;

    @Autowired
    private DicService dicService;

    @Autowired
    private CustomLabelNameService customLabelNameService;
    
    @Autowired
    private BsUserService bsUserService;

    @Value("${appcode}")
    private String appCode;
    @Value("${apptaken}")
    private String appToken;
    @Value("${cas.service.login}")
    private String casLogin;
    @Value("${cas.service.logout}")
    private String casLogout;
    @Value("${app.service.home}")
    private String appHome;


    /**
     * 获取用户的参数
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "获取用户的参数",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取用户的参数")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/appConfigs", method = RequestMethod.GET)
    @ResponseBody
    public String getAppConfigs(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(SessionConstant.SESSION_USER);
        HttpSession session = request.getSession();
        session.setAttribute(SessionConstant.SESSION_TENANT_ID, UserInfoUtil.getCurrentTenantId());
        
        long startTime=System.currentTimeMillis();
        
        Map<String, Object> appConfig = new HashMap<>();
        appConfig.put(SessionConstant.SESSION_USER, session.getAttribute(SessionConstant.SESSION_USER));
        //appConfig.put(SessionConstant.SESSION_ACCREDIT_USER, session.getAttribute(SessionConstant.SESSION_ACCREDIT_USER));

        List<ExtResource> menuList = (List<ExtResource>) session.getAttribute(SessionConstant.SESSION_MENU_LIST);
        List<ExtResource> menuListTmp = new ArrayList<>();
        for (ExtResource resource : menuList) {
            if (!"top".equals(resource.getExtAttr3())) {
                menuListTmp.add(resource);
            }
        }
        log.info("appConfigs menuList runTime:{}", System.currentTimeMillis()-startTime);
        appConfig.put(SessionConstant.SESSION_MENU_LIST, menuListTmp);
        appConfig.put(SessionConstant.SESSION_BUTTON_LIST, session.getAttribute(SessionConstant.SESSION_USER_ACL));
        startTime=System.currentTimeMillis();
        setCityConfig(appConfig);
        log.info("appConfigs setCityConfig runTime:{}", System.currentTimeMillis()-startTime);
        try {
            //获取用户操作记录，包括语言
            startTime=System.currentTimeMillis();
            ProjectUserRelationPage page1 = new ProjectUserRelationPage();
            page1.setStatus(1);
            page1.setType(3);
            ProjectUserRelation projectUserRelation = projectUserRelationService.queryForIndex(page1);
            appConfig.put("view_log", projectUserRelation);

            log.info("appConfigs ProjectUserRelationPage runTime:{}", System.currentTimeMillis()-startTime);
            
            if (projectUserRelation.getProjectId() != null) {
                String[] ids = projectUserRelation.getProjectId().split("&");
                if (ids.length > 3) {
                    appConfig.put("language", ids[3]);
                }
            }
            
            startTime=System.currentTimeMillis();
            //根据应用列表判断是否有tenant项目权限
            SecurityService securityService = UmRmiServiceFactory.getSecurityService();
            List<com.tendcloud.enterprise.um.umic.entity.App> allAuthAppList = securityService.getAppByUmId(user.getUmid());

            Boolean has_tenant_app = false;
            for (com.tendcloud.enterprise.um.umic.entity.App app : allAuthAppList) {
                if (app.getExtAttr3().equals("1") && "tenant".equals(app.getAppCode())) {
                    has_tenant_app = true;
                }
            }

            appConfig.put("authAppList", allAuthAppList);
            
            log.info("appConfigs um runTime:{}", System.currentTimeMillis()-startTime);
            
            appConfig.put("has_tenant_app", has_tenant_app);
            startTime=System.currentTimeMillis();
            //是否隐藏中英文标志
            List<DicItem> dicItems = dicService.queryDicItemsByDicName(ReportConstants.Dictionary.DICT_KEY_LANGUAGE);
            appConfig.put("language_sign", dicItems.get(0).getDicItemValue());
            
            
            log.info("appConfigs queryDicItemsByDicName runTime:{}", System.currentTimeMillis()-startTime);
            
            //获取TD_BS_USER表用户信息
            List<BsUser> bsUserList = bsUserService.queryListByUserId(user.getUmid());
            log.info("appConfigs queryBsUserList:{}", bsUserList.toString());
            bsUserService.setParamToAppConfig(bsUserList, appConfig, request.getSession());
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage(), e);
        }
        String jsonObject = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            jsonObject = objectMapper.writeValueAsString(appConfig);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    private void setCityConfig(Map<String, Object> appConfig) {
        String city_center_point_path = paramService.queryByParamKey("city_center_point").getParamValue();
        String city_center_point = FileUtil.readStringByFilePath(city_center_point_path, "UTF-8");
        if (!Strings.isNullOrEmpty(city_center_point)) {
            JSONObject object = JSON.parseObject(city_center_point);
            appConfig.put(SessionConstant.CITY_CENTER_POINT, object);
        } else {
            logger.error("city_center_point is null");
        }
    }

    /**
     * 获取无需认证的参数
     *
     * @return
     */
    @ApiOperation(value = "获取无需认证的参数",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取无需认证的参数")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/parameters", method = RequestMethod.GET)
    @ResponseBody
    public String getNoAuthigenicParameters() {
        Map<String, Object> appConfig = new HashMap<>();
        appConfig.put(SessionConstant.CAS_LOGIN, casLogin);
        appConfig.put(SessionConstant.APP_HOME, appHome);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonObject = null;
        try {
            jsonObject = objectMapper.writeValueAsString(appConfig);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    /**
     * 通过umid获取资源列表
     *
     * @param umid
     * @param extResourceType
     * @return
     */
    @SuppressWarnings("Duplicates")
    private List<ExtResource> getExtResourceListByUmid(String umid, String extResourceType) {
        List<ExtResource> list = new ArrayList<>();
        try {
            SecurityService securityService = UmRmiServiceFactory.getSecurityService();
            String type = extResourceType;
            List<ExtResource> extResourcesList = securityService.getExtResourcesByTypeAndUmid(appCode, appToken, type, umid);
            for (ExtResource resource : extResourcesList) {
                if (!"root".equalsIgnoreCase(resource.getResourceCode())) {
                    list.add(resource);
                }
            }
        } catch (Exception e) {
            logger.error("根据用户umid、appCode、appTaken，查询用户资源权限，异常" + e.getMessage());
        }
        return list;
    }

    @RequestMapping(value = "/logout2", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> logout(HttpServletRequest request) throws IOException {
        request.getSession().invalidate();

        Map<String, Object> appConfig = new HashMap<>();
        appConfig.put("casLogout", casLogout);
        appConfig.put(SessionConstant.CAS_LOGIN, casLogin);
        appConfig.put(SessionConstant.APP_HOME, appHome);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonObject = null;
        try {
            jsonObject = objectMapper.writeValueAsString(appConfig);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(jsonObject, HttpStatus.OK);
    }

    /**
     * 修改用户密码
     *
     * @param userBean
     * @return
     */
    @ApiOperation(value = "修改用户密码",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "修改用户密码")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/changeUserPassword", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeUserPassword(@RequestBody UserBean userBean) {
        String result;
        SecurityService securityService = UmRmiServiceFactory.getSecurityService();
        User user = UserInfoUtil.getUser();
        try {
//            user.setUserPassword(userBean.getNewPassword());
//            securityService.addOrUpdateUserWithPassword(user, "umadmin", "123456");
            securityService.changeUserPassword(user.getLoginName(), userBean.getOldPassword(), userBean.getNewPassword());
            result = "修改密码成功";

            Map<String, Object> appConfig = new HashMap<String, Object>();
            appConfig.put("msg", result);
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonObject = "";
            try {
                jsonObject = objectMapper.writeValueAsString(appConfig);
            } catch (IOException e) {
                e.printStackTrace();
            }

            return ResponseEntity.ok()
                    .headers(HeaderUtil.createAlert(jsonObject, user.getLoginName())).body(jsonObject);
        } catch (Exception e) {
            logger.error("修改密码异常", e);
            result = "修改密码失败";

            Map<String, Object> appConfig = new HashMap<String, Object>();
            appConfig.put("msg", result);
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonObject = "";
            try {
                jsonObject = objectMapper.writeValueAsString(appConfig);
            } catch (IOException ex) {
                ex.printStackTrace();
            }

            return ResponseEntity.ok()
                    .headers(HeaderUtil.createAlert(jsonObject, user.getLoginName())).body(jsonObject);
        }
    }
}

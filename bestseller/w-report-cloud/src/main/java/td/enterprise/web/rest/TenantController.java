package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import td.enterprise.entity.Tenant;
import td.enterprise.service.TenantService;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;

/**
 * Tenant 租户接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class TenantController {

    private final String BASE_URL = "/api/tenants";

    public final static Logger logger = Logger.getLogger(TenantController.class);

    @Autowired
    private TenantService tenantService;

//	@RequestMapping(value = "/tenants", method = RequestMethod.GET)
//	@ResponseBody
//	public Map<String, Object> query(HttpServletRequest request,TenantPage page) throws Exception {
//		HttpSession session = request.getSession();
//		String systemCode = (String) session.getAttribute(SessionConstant.SYSTEM_CODE);
//		String systemToken = (String) session.getAttribute(SessionConstant.SYSTEM_TOKEN);
//		String tenantId = session.getAttribute(SessionConstant.SESSION_TENANT_ID)+"";
//		return tenantService.queryByUmids(page, systemCode, systemToken, tenantId);
//	}
//
//	@RequestMapping(value = "/tenantsyj", method = RequestMethod.GET)
//	@ResponseBody
//	public Map<String, Object> queryyj(HttpServletRequest request,TenantPage page) throws Exception {
//		HttpSession session = request.getSession();
//		String systemCode = (String) session.getAttribute(SessionConstant.SYSTEM_CODE);
//		String systemToken = (String) session.getAttribute(SessionConstant.SYSTEM_TOKEN);
////		String tenantId = session.getAttribute(SessionConstant.SESSION_TENANT_ID)+"";
//		String tenantId = page.getTenantId();
//		return tenantService.queryByUmidsyj(page, systemCode, systemToken, tenantId);
//	}
//
//	@RequestMapping(value = "/tenantssd", method = RequestMethod.GET)
//	@ResponseBody
//	public Map<String, Object> querysdyj(HttpServletRequest request,TenantPage page) throws Exception {
//		HttpSession session = request.getSession();
//		String systemCode = (String) session.getAttribute(SessionConstant.SYSTEM_CODE);
//		String systemToken = (String) session.getAttribute(SessionConstant.SYSTEM_TOKEN);
//		String tenantId = session.getAttribute(SessionConstant.SESSION_TENANT_ID)+"";
//		return tenantService.queryByUmidsSd(page, systemCode, systemToken, tenantId);
//	}

//	@RequestMapping(value = "/tenantshz", method = RequestMethod.GET) 
//	@ResponseBody
//	public Map<String, Object> queryhz(TenantPage page) throws Exception {
//		List<Tenant> rows = tenantService.queryBytend(page);
//		for (Tenant tenant : rows) {
//			String tenantId = tenant.getTenantId();
//			int queryByCount = 0;
//			if (tenant.getType()==1) {
//				SeriesPage seriesPage = new SeriesPage();
//				seriesPage.setTenantId(tenantId);
//				queryByCount = seriesService.queryByCount(seriesPage);
//			}else{
//				SensorInstallInfoPage sensorInstallInfoPage = new SensorInstallInfoPage();
//				sensorInstallInfoPage.setTenantId(tenantId);
//				queryByCount = sensorInstallInfoService.queryByCount(sensorInstallInfoPage);
//			}
//			tenant.setCounter(queryByCount);
//		}
//		
//		return getGridData(page.getPager().getRowCount(), rows);
//	}

    /**
     * 新建租户
     *
     * @param tenant
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "新建租户",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建租户")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenants", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<Tenant> create(@RequestBody Tenant tenant) throws Exception {
        tenant.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        tenantService.create(tenant);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A tenant is created with identifier "
                        + tenant.getId(), tenant.getId() + ""))
                .body(tenant);
    }

    /**
     * 获取的单个租户
     *
     * @param tenantId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取的单个租户",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取的单个租户")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenants/{tenantId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Tenant> find(@PathVariable String tenantId) throws Exception {
        Tenant tenant = tenantService.selectByPrimaryKey(tenantId);
        if (tenant == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(tenant, HttpStatus.OK);
        }
    }

    /**
     * 更新租户
     *
     * @param tenant
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新租户",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新租户")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenants/{tenantId}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<Tenant> update(Tenant tenant) throws Exception {
        tenantService.updateByPrimaryKeySelective(tenant);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A tenant is updated "
                        + tenant.toString(), tenant.toString()))
                .body(tenant);
    }

    /**
     * 删除租户
     *
     * @param tenantId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除租户",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除租户")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenants/{tenantId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String tenantId) throws Exception {
        Tenant tenant = tenantService.selectByPrimaryKey(tenantId);
        if (tenant == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        tenantService.deleteByPrimaryKey(tenantId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A tenant is deleted with identifier "
                + tenantId, tenantId)).build();
    }

}

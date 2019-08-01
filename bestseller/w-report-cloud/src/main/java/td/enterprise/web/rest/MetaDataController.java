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
import td.enterprise.entity.MetaData;
import td.enterprise.service.MetaDataService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

/**
 * MetaData 项目数据字典接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class MetaDataController extends BaseController {

    private final String BASE_URL = "/api/metaDatas";

    public final static Logger logger = Logger.getLogger(MetaDataController.class);

    @Autowired
    private MetaDataService metaDataService;

    /**
     * 批量获取的项目字典
     *
     * @param dataType
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "批量获取的项目字典",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "批量获取的项目字典")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/metaDatas/type/{dataType}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <Map <String, Object>> getMetaDataValues(@PathVariable String dataType) throws Exception {
        String tenantId = UserInfoUtil.getUser().getTenantId() + "";
        Map <String, Object> metaDataValues = metaDataService.getMetaDataValues(dataType, tenantId);
        return new ResponseEntity <>(metaDataValues, HttpStatus.OK);
    }

    /**
     * 添加项目数据字典
     *
     * @param metaData
     * @return
     */
    @ApiOperation(value = "添加项目数据字典",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "添加项目数据字典")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/metaDatas/addMetaData", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity <MetaData> addMetaData(@RequestBody MetaData metaData) throws URISyntaxException {
        metaData.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        metaData = metaDataService.addMetaData(metaData);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A metaData is created with identifier " + metaData.getId(), metaData.getId() + ""))
                .body(metaData);
    }

}

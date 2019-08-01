package td.enterprise.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.service.manager.MCService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;

import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@Controller
@RequestMapping("/api")
public class MCController extends BaseController {

    private final String BASE_URL = "/api/mc";

    public final static Logger logger = Logger.getLogger(MCController.class);

    @Autowired
    private MCService mcService;

    /**
     * 地理围栏通过MC接口获取人群
     *
     * @param poiMap
     * @return
     */
    @ApiOperation(value = "地理围栏通过MC接口获取人群",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "地理围栏通过MC接口获取人群")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/mc/poiCrowd", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity <?> createPoiCrowd(@RequestBody Map poiMap) throws Exception {
        String name = mcService.createSegment(poiMap);

        Map <String, Object> appConfig = new HashMap<String, Object>();
        appConfig.put("name", name);//TODO crowdId
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonObject = "";
        try {
            jsonObject = objectMapper.writeValueAsString(appConfig);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.created(new URI(BASE_URL + name))
                .headers(HeaderUtil.createAlert("A PoiCrowd is created with identifier " + name, name + ""))
                .body(jsonObject);
    }

}

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
import td.enterprise.entity.KmeansCrowdResult;
import td.enterprise.page.KmeansCrowdResultPage;
import td.enterprise.service.DTO.KmeansCrowdResultTag;
import td.enterprise.service.KmeansCrowdResultService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * KmeansCrowdResult 聚类客群结果接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class KmeansCrowdResultController extends BaseController {

    private final String BASE_URL = "/api/kmeansCrowdResults";

    public final static Logger logger = Logger.getLogger(KmeansCrowdResultController.class);

    @Autowired
    private KmeansCrowdResultService kmeansCrowdResultService;

    /**
     * 根据人群获取聚类客群结果
     *
     * @param crowdId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "根据人群获取聚类客群结果",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "根据人群获取聚类客群结果")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/kmeansCrowdResults/queryResultById", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<KmeansCrowdResultTag>> queryResultById(String crowdId) throws Exception {
        List<KmeansCrowdResultTag> result = new ArrayList<>();
        if (crowdId != null && !"".equals(crowdId)) {
            KmeansCrowdResultPage page = new KmeansCrowdResultPage();
            page.setKmeansCrowdId(Integer.valueOf(crowdId));
            result = kmeansCrowdResultService.buildKmeansCrowdResultTags(page);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 根据人群获取聚类客群结果种类
     *
     * @param crowdId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "根据人群获取聚类客群结果种类",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "根据人群获取聚类客群结果种类")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/kmeansCrowdResults/queryClassificationByParam", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<KmeansCrowdResult>> queryClassificationByParam(String crowdId) throws Exception {
        List<KmeansCrowdResult> result = new ArrayList<>();
        if (crowdId != null && !"".equals(crowdId)) {
            KmeansCrowdResultPage page = new KmeansCrowdResultPage();
            page.setKmeansCrowdId(Integer.valueOf(crowdId));
            result = kmeansCrowdResultService.queryClassificationByParam(page);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 更新聚类客群结果
     *
     * @param kmeansCrowdResult
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新聚类客群结果",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新聚类客群结果")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/kmeansCrowdResults/updateClassification", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<KmeansCrowdResult> update(@RequestBody KmeansCrowdResult kmeansCrowdResult) throws Exception {
        kmeansCrowdResultService.updateByPrimaryKeySelective(kmeansCrowdResult);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A kmeansCrowdResult is updated " + kmeansCrowdResult.toString(), kmeansCrowdResult.toString()))
                .body(kmeansCrowdResult);
    }

    /**
     * 更新聚类客群结果类型
     *
     * @param params
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新聚类客群结果类型",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新聚类客群结果类型")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/kmeansCrowdResults/updateClassification", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Integer> updateClassification(@RequestBody Map<String, Object> params) throws Exception {
        logger.info(params);
        String kmeansCrowdId = String.valueOf(params.get("kmeansCrowdId"));
        int result = 0;
        if (kmeansCrowdId != null) {
            result = kmeansCrowdResultService.updateClassification(params);
        }
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A kmeansCrowdResult is updated with identifier : " + kmeansCrowdId, kmeansCrowdId))
                .body(result);
    }
}

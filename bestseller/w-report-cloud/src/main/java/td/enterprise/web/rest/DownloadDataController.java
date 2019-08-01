package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import td.enterprise.entity.DownloadData;
import td.enterprise.page.DownloadDataPage;
import td.enterprise.service.DownloadDataService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.util.List;

/**
 * DownloadData 数据下载接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class DownloadDataController extends BaseController {

    private final String BASE_URL = "/api/downloadDatas";

    public final static Logger logger = Logger.getLogger(DownloadDataController.class);

    @Autowired
    private DownloadDataService downloadDataService;


    /**
     * 获取查询条件下所有数据下载
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有数据下载",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有数据下载")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/downloadDatas", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<DownloadData>> query(DownloadDataPage page) throws Exception {
        page.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        List<DownloadData> rows = downloadDataService.query(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }

    /**
     * 检查数据下载任务
     *
     * @param dataId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "检查数据下载任务",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "检查数据下载任务")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/downloadDatas/checkDownload/{dataId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Boolean> checkDownload(@PathVariable String dataId) throws Exception {
        boolean result = downloadDataService.checkDownload(Integer.parseInt(dataId));
        if (!result) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
    }

    /**
     * 检查数据下载任务
     *
     * @param dataId
     * @param response
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "检查数据下载任务",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "检查数据下载任务")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/downloadDatas/download", method = RequestMethod.GET)
    public ResponseEntity<Void> download(@RequestParam("dataId") Integer dataId, HttpServletResponse response, HttpServletRequest request) throws Exception {
        downloadDataService.download(dataId, response,request);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A downloadData is downloaded with identifier "
                + dataId, dataId.toString())).build();
    }

    /**
     * 新建数据下载
     *
     * @param downloadData
     * @return
     */
    @ApiOperation(value = "新建数据下载",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建数据下载")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/downloadDatas", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<DownloadData> create(@RequestBody DownloadData downloadData) throws Exception {
        downloadDataService.create(downloadData);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A downloadData is created with identifier "
                        + downloadData.getId(), downloadData.getId() + ""))
                .body(downloadData);
    }

    /**
     * 更新数据下载
     *
     * @param downloadData
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新数据下载",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新数据下载")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/downloadDatas/{downloadDataId}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<DownloadData> update(@RequestBody DownloadData downloadData) throws Exception {
        downloadDataService.updateByPrimaryKeySelective(downloadData);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A downloadData is updated "
                        + downloadData, downloadData.toString()))
                .body(downloadData);
    }

    /**
     * 删除数据下载
     *
     * @param downloadDataId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除数据下载",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除数据下载")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/downloadDatas/{downloadDataId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String downloadDataId) throws Exception {
        DownloadData downloadData = downloadDataService.selectByPrimaryKey(downloadDataId);
        if (downloadData == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        downloadDataService.deleteByPrimaryKey(downloadDataId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A downloadData is deleted with identifier "
                + downloadDataId, downloadDataId)).build();
    }
}

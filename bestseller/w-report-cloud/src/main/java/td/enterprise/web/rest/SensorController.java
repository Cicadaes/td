package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.DO.SensorDO;
import td.enterprise.entity.Sensor;
import td.enterprise.page.ChangeLogPage;
import td.enterprise.page.SensorPage;
import td.enterprise.service.SensorService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.*;

import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.List;

/**
 * 探针管理
 *
 * @author zhengguang.ji, Yan
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class SensorController extends BaseController {

    private final String BASE_URL = "/api/sensors";

    @Autowired
    private SensorService sensorService;

    /**
     * 获取所有的project
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取所有的探针",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取所有的探针")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<SensorDO>> query(SensorPage page) throws Exception {
        if (page.getQ() != null) {
            page.setQ(URLDecoder.decode(page.getQ(), "UTF-8"));
        }
        List<SensorDO> sensorPages = sensorService.findAll(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);

        return new ResponseEntity<>(sensorPages, headers, HttpStatus.OK);
    }

    /**
     * 创建探针记录
     * <p>
     * 创建或更新探针数据，需要同步更新探针安装记录中的探针信息和房间信息
     *
     * @param sensorVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "创建探针记录",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "创建探针记录")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })

    @RequestMapping(value = "/sensors", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<?> create(@RequestBody SensorInfoVM sensorVM) throws Exception {

        if (sensorVM.getId() != null) {
            //支持更新
            return update(sensorVM);

        } else {
            SensorPage page = new SensorPage();
            page.setSensorMac(sensorVM.getSensorMac());
            page.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
            List<Sensor> sensors = sensorService.queryByList(page);


            if (sensors != null && sensors.size() > 0) {
                return ResponseEntity.badRequest()
                        .headers(HeaderUtil.createFailureAlert("Sensor", "nameexists", URLEncoder.encode("探针已经使用", "UTF-8")))
                        .body(null);
            } else {

                Sensor newSensor = sensorService.create(sensorVM);
                return ResponseEntity.created(new URI(BASE_URL +ReportConstants.Punctuation.SLASH+newSensor.getId()))
                        .headers(HeaderUtil.createAlert("A Project is created with identifier " + newSensor.getId(), newSensor.getId() + ""))
                        .body(newSensor);
            }
        }
    }

    /**
     * 更新探针
     *
     * @param sensorVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新探针",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新探针")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors/{sensorId}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody SensorInfoVM sensorVM) throws Exception {
        SensorPage page = new SensorPage();
        page.setSensorMac(sensorVM.getSensorMac());
        page.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
        List<Sensor> sensors = sensorService.queryByList(page);

        if (sensors != null && ((sensors.size() == 1 && !sensors.get(0).getId().equals(sensorVM.getId())) || sensors.size() > 1)) {
            return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert("Sensor", "nameexists", URLEncoder.encode("探针已经使用", "UTF-8")))
                    .body(null);
        } else {

            Sensor newSensor = sensorService.update(sensorVM);
            return ResponseEntity.ok()
                    .headers(HeaderUtil.createAlert("A project is updated with identifier " + newSensor.getId(), newSensor.getId() + ""))
                    .body(newSensor);
        }
    }

    /**
     * 批量导入探针信息
     * 探针手工编号（sensor_id）
     * 探针别名（sensor_name）
     * mac地址（sensor_mac）
     * 位置描述（position_description）
     * 场地名称（project_place_name）
     * 房间名称（room_name）
     *
     * @param file
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "批量创建项目",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "批量创建项目")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors/batchImport", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<List<String>> batchImport(MultipartFile file, @RequestParam(value = "projectId") int projectId) throws Exception {

        List<String> errorMsg = sensorService.batchImport(file, projectId);
        return new ResponseEntity<>(errorMsg, HttpStatus.OK);
    }

    @ApiOperation(value = "返回获取的单个探针详情",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回获取的单个探针详情")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors/{sensorId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Sensor> find(@PathVariable String sensorId) throws Exception {
        Sensor sensor = sensorService.selectByPrimaryKey(sensorId);
        if (sensor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(sensor, HttpStatus.OK);
        }
    }

    /**
     * 删除探针
     * 设置探针状态为无效
     * 更新探针安装信息为拆除
     *
     * @param sensorId
     * @return
     * @throws Exception
     */

    @ApiOperation(value = "删除探针",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除探针")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })

    @RequestMapping(value = "/sensors/{sensorId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String sensorId) throws Exception {
        Sensor sensor = sensorService.selectByPrimaryKey(sensorId);
        if (sensor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        sensorService.delete(sensor);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A sensor is deleted with identifier " + sensor.getSensorMac(), sensor.getSensorMac())).build();

    }

    @ApiOperation(value = "返回获取的单个探针修改记录",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回获取的单个探针修改记录")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors/history", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <List<SensorChangeLogVM>> history(ChangeLogPage page) throws Exception {
        Sensor sensor = sensorService.selectByPrimaryKey(page.getId());
        if (sensor == null) {
            return new ResponseEntity <>(HttpStatus.NOT_FOUND);
        } else {
            List<SensorChangeLogVM> history = sensorService.history(page);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
            return new ResponseEntity<>(history, headers, HttpStatus.OK);
        }
    }
    @ApiOperation(value = "未录入mac查询",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回获取的多个mac地址")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors/noTypeInSensors", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <List<String>> noTypeInSensors(SensorPage page) throws Exception {

       List<String> list = sensorService.getNoTypeInSensors(page);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "探针数据详情",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回获取探针数据详情")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors/{sensorId}/detail", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <SensorDetailVM> detail(@PathVariable String sensorId ) throws Exception {
        SensorPage page = new SensorPage();
        page.setId(Integer.parseInt(sensorId));
        SensorDetailVM sensorDetail = sensorService.getSensorDetail(page);
        return new ResponseEntity<>(sensorDetail, HttpStatus.OK);
    }

    @ApiOperation(value = "mac列表刷新",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回获取mac地址")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/sensors/{sensorId}/macList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity <List<SensorMinRssiVM>> macList(@PathVariable String sensorId ) throws Exception {
        SensorPage page = new SensorPage();
        page.setId(Integer.parseInt(sensorId));
        List<SensorMinRssiVM> sensorMacList = sensorService.getSensorMacList(page);
        return new ResponseEntity<>(sensorMacList, HttpStatus.OK);
    }





}

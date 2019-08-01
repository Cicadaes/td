package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.service.manager.DicService;
import td.enterprise.web.util.BaseController;

import java.util.HashMap;
import java.util.Map;


/**
 * Dic 数据字典接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class DicController extends BaseController {

    private final String BASE_URL = "/api/dics";

    public final static Logger logger = Logger.getLogger(DicController.class);

    @Autowired
    private DicService dicService;

    /**
     * 通过批量名称查找数据字典
     *
     * @param dicName
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "通过批量名称查找数据字典",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "通过批量名称查找数据字典")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/dics/name/{dicName}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getDicItems(@PathVariable String dicName) throws Exception {
        String[] dicNameArr = dicName.split(",");
        Map<String, Object> dicMap = new HashMap<String, Object>();
        for (String dicN : dicNameArr) {
            dicMap.put(dicN, dicService.queryDicItemsByDicName(dicN));
        }
        return dicMap;
    }
}

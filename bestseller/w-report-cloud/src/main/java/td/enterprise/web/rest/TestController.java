package td.enterprise.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import td.enterprise.entity.Param;
import td.enterprise.service.manager.ParamService;

import javax.inject.Inject;

/**
 * Created by Yan on 2017/3/24.
 */
@RestController
@RequestMapping("/test")
public class TestController {

    @Inject
    private ParamService paramService;

    @RequestMapping(value = "/params/{key}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Param> query(@PathVariable String key) throws Exception {
        Param param = paramService.queryByParamKey(key);
        return new ResponseEntity<>(param, HttpStatus.OK);
    }
}

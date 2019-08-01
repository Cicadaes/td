package com.talkingdata.datacloud.visual.controller.report;

import com.alibaba.fastjson.JSONObject;
import com.talkingdata.datacloud.visual.util.UserInfoUtil;
import com.tendcloud.enterprise.um.umic.rmi.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Slf4j
@Controller
@RequestMapping("/api")
public class
SystemController {

  public final static Logger logger = Logger.getLogger(SystemController.class);

  @RequestMapping(value = "/changeTenant/{tenantId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity changeTenantId(@PathVariable("tenantId") String tenantId) {
    String before = UserInfoUtil.getCurrentTenantId();
    UserInfoUtil.changeCurrentTenantId(tenantId);
    JSONObject result = new JSONObject();
    result.put("before", before);
    result.put("after", tenantId);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @RequestMapping(value = "/getCurrentTenant", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity getCurrentTenant() throws BusinessException {
    return new ResponseEntity<>(UserInfoUtil.getCurrentTenant(), HttpStatus.OK);
  }

}

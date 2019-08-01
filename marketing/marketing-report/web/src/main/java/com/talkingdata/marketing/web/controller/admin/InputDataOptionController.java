package com.talkingdata.marketing.web.controller.admin;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.admin.InputDataOption;
import com.talkingdata.marketing.core.page.admin.InputDataOptionPage;
import com.talkingdata.marketing.core.service.admin.InputDataOptionService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class InputDataOptionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(InputDataOptionController.class);

    @Autowired
    private InputDataOptionService inputDataOptionService;

    @RequestMapping(value = "/inputDataOptions", method = GET)
    @ResponseBody
    public List<InputDataOption> query(InputDataOptionPage page) throws Exception {
        page.setOrderBy(InputDataOption.fieldToColumn(page.getOrderBy()));
        return inputDataOptionService.queryByList(page);
    }

    @RequestMapping(value = "/inputDataOptions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(InputDataOptionPage page) throws Exception {
        page.setOrderBy(InputDataOption.fieldToColumn(page.getOrderBy()));
        List<InputDataOption> rows = inputDataOptionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/inputDataOptions/{id}", method = GET)
    @ResponseBody
    public InputDataOption find(@PathVariable Integer id) throws Exception {
        return inputDataOptionService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/inputDataOptions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public InputDataOption create(@RequestBody InputDataOption inputDataOption) throws Exception {
        inputDataOptionService.insert(inputDataOption);
        return inputDataOption;
    }

    @RequestMapping(value = "/inputDataOptions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody InputDataOption inputDataOption) throws Exception {
        inputDataOptionService.updateByPrimaryKeySelective(inputDataOption);
    }

    @RequestMapping(value = "/inputDataOptions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        inputDataOptionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_INPUT_DATA_OPTION where id = {}", id);
    }

}

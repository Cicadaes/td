package com.talkingdata.marketing.web.controller.admin;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import com.talkingdata.marketing.core.page.dto.InputDataSchemaDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.admin.InputDataSchema;
import com.talkingdata.marketing.core.page.admin.InputDataSchemaPage;
import com.talkingdata.marketing.core.service.admin.InputDataSchemaService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class InputDataSchemaController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(InputDataSchemaController.class);

    @Autowired
    private InputDataSchemaService inputDataSchemaService;

    @RequestMapping(value = "/inputDataSchemas", method = GET)
    @ResponseBody
    public List<InputDataSchema> query(InputDataSchemaPage page) throws Exception {
        page.setOrderBy(InputDataSchema.fieldToColumn(page.getOrderBy()));
        return inputDataSchemaService.queryByList(page);
    }

    @RequestMapping(value = "/inputDataSchemas/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(InputDataSchemaPage page) throws Exception {
        page.setOrderBy(InputDataSchema.fieldToColumn(page.getOrderBy()));
        List<InputDataSchema> rows = inputDataSchemaService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/inputDataSchemas/{id}", method = GET)
    @ResponseBody
    public InputDataSchema find(@PathVariable Integer id) throws Exception {
        return inputDataSchemaService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/inputDataSchemas", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public InputDataSchema create(@RequestBody InputDataSchema inputDataSchema) throws Exception {
        inputDataSchemaService.insert(inputDataSchema);
        return inputDataSchema;
    }

    @RequestMapping(value = "/inputDataSchemas", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody InputDataSchema inputDataSchema) throws Exception {
        inputDataSchemaService.updateByPrimaryKeySelective(inputDataSchema);
    }

    @RequestMapping(value = "/inputDataSchemas/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        inputDataSchemaService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_INPUT_DATA_SCHEMA where id = {}", id);
    }

    @RequestMapping(value = "/inputDataSchemas/list", method = GET)
    @ResponseBody
    public List<InputDataSchemaDto> getDataSchemaList() throws Exception {
        return inputDataSchemaService.getDataSchemaList();
    }

}

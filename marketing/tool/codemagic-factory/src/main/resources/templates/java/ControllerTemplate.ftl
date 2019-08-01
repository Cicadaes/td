package ${clientBussPackage}.controller.${entityPackage};

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

import ${baseClassPackage}.web.BaseController;
import ${bussPackage}.entity.${entityPackage}.${className};
#if($pkColumnCount > 1)
import ${bussPackage}.entity.${entityPackage}.${className}Key;
#end
import ${bussPackage}.page.${entityPackage}.${className}Page;
import ${bussPackage}.service.${entityPackage}.${className}Service;

@Controller
@RequestMapping("/${entityPackage}")
public class ${className}Controller extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(${className}Controller.class);

    @Autowired
    private ${className}Service ${lowerName}Service;

    @RequestMapping(value = "/${lowerNames}", method = GET)
    @ResponseBody
    public List<${className}> query(${className}Page page) throws Exception {
        page.setOrderBy(${className}.fieldToColumn(page.getOrderBy()));
        return ${lowerName}Service.queryByList(page);
    }

    @RequestMapping(value = "/${lowerNames}/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(${className}Page page) throws Exception {
        page.setOrderBy(${className}.fieldToColumn(page.getOrderBy()));
        List<${className}> rows = ${lowerName}Service.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

#if($pkColumnCount == 1)
    @RequestMapping(value = "/${lowerNames}/{${pkColumn.dataName}}", method = GET)
    @ResponseBody
    public ${className} find(@PathVariable ${pkColumn.shortDataType} ${pkColumn.dataName}) throws Exception {
        return ${lowerName}Service.selectByPrimaryKey(${pkColumn.dataName});
    }

#end
    @RequestMapping(value = "/${lowerNames}", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ${className} create(@RequestBody ${className} ${lowerName}) throws Exception {
        ${lowerName}Service.insert(${lowerName});
        return ${lowerName};
    }

#if($pkColumnCount > 0)
    @RequestMapping(value = "/${lowerNames}", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ${className} ${lowerName}) throws Exception {
        ${lowerName}Service.updateByPrimaryKeySelective(${lowerName});
    }

#end
#if($pkColumnCount == 1)
    @RequestMapping(value = "/${lowerNames}/{${pkColumn.dataName}}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable ${pkColumn.shortDataType} ${pkColumn.dataName}) throws Exception {
        ${lowerName}Service.deleteByPrimaryKey(${pkColumn.dataName});
        logger.info("delete from ${tableName} where ${pkColumn.dataName} = {}", ${pkColumn.dataName});
    }

#elseif($pkColumnCount > 1)
    @RequestMapping(value = "/${lowerNames}", method = DELETE)
    @ResponseBody
    public void delete(${className}Key key) throws Exception {
        ${lowerName}Service.deleteByPrimaryKey(key);
        logger.info("delete from ${tableName} where key: {}", key);
    }

#end
}
